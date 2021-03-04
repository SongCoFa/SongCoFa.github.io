<template>
  <div ref="QueryToolArea">
    <QueryNav
      :AddListFormat="AddListFormat"
      :ImportListFormat="ImportListFormat"
      :AddApi="AddApi"
      :ImportApi="ImportApi"
      :writable="writable"
      @setQueryAreaCollapse="setQueryAreaCollapse"
      @refreshData="refreshData"
    >
      <template v-slot:checkButton>
        <slot name="checkButton"></slot>
      </template>
      <template v-slot:selectForm>
        <slot name="selectForm"></slot>
      </template>
      <template v-slot:checkVocation>
        <slot name="checkVocation"></slot>
      </template>
      <template v-slot:printButton>
        <slot name="printButton"></slot>
      </template>
      <template v-slot:downloadButton>
        <slot name="downloadButton"></slot>
      </template>
      <template v-slot:importWorkingHours>
        <slot name="importWorkingHours"></slot>
      </template>
      <template v-slot:importValueByDate>
        <slot name="importValueByDate"></slot>
      </template>
    </QueryNav>

    <div class="bg-light container-border p-3" :hidden="isQueryAreaCollapsed" v-if="EnabledInputList.length > 0">
      <InputTool
        :list="EnabledInputList"
        :inputClasses="cssClass"
        :selectedInput="selectedInput"
        @updateInput="setInput"
      />

      <b-row>
        <b-button block variant="primary" ref="searchBTN" class="mt-3 mx-3" @click="queue(selectedInput)">查詢</b-button>
      </b-row>
    </div>
  </div>
</template>

<script>
import QueryNav from '@/components/QueryTool/InputField/QueryNav/index.vue';
import InputTool from '@/components/InputTool/index.vue';

export default {
  name: 'QueryTool',
  components: {
    QueryNav,
    InputTool,
  },
  props: {
    AddListFormat: Array,
    ImportListFormat: Array,
    AddApi: String,
    ImportApi: String,
    EnabledInputList: Array,
    GetResultApi: String,
    dataNotUpdate: Boolean,
    writable: Boolean,
    dailyMileagesReportType: Array,
    expired: Number,
    getday: Boolean,
  },
  data() {
    return {
      isQueryAreaCollapsed: false,
      selectedInput: {},

      busyState: false,
    };
  },
  computed: {
    cssClass() {
      if (this.EnabledInputList.length === 6) {
        return ['col-4'];
      }
      return ['col-12 col-sm'];
    },
  },
  methods: {
    setInput({ backendFieldName, value }) {
      this.$set(this.selectedInput, backendFieldName, value);
    },
    async queue(input) {
      const flag = await this.checkExcutable();
      console.log(this.selectedInput);

      if (!flag) return;

       this.GetResult(input);
    },
    async GetResult(input) {
      this.$emit('BusyStatus', true);

      let search = input;
      if (search == null) {
        search = {};
      }

      // 只處理排班報表-每月里程表的條件
      if (this.dailyMileagesReportType) {
        const checkArray = ['regular', 'Charter', 'special'];

        checkArray.forEach((item) => {
          if (this.dailyMileagesReportType.includes(item)) {
            search[item] = true;
          } else {
            search[item] = false;
          }
        });
      }


      if (this.expired !== null) {
        search.expired = this.expired;
      }

      if (this.getday) {
        const today = new Date();
        const date = `${today.getFullYear()}-${today.getMonth() + 1}-${today.getDate()}`;
        search.today = date;
      }
      // console.log(this.GetResultApi, search);

      const result = await this.$http
        .post(this.GetResultApi, search)
        .then((response) => {
          console.log(response.data);

          const routeName = this.$route.name;
          // 駕駛長資料管理 default filter
          if (routeName === '駕駛長資料管理') {
            return response.data.Resource.filter(item => item.title === '駕駛長');
          }

          if (routeName === '帳號管理') {
            return response.data.Resource.filter(item => item.title !== '駕駛長' && item.emp_ID !== 'admin');
          }

          // TODO: 額外的篩選條件，API可修改傳入參數
          // 根據DisplayRouteID篩選資料 總班表查詢用
          if (search && search.DisplayRouteID) {
            const resultDisplayRouteID = response.data.Resource;

            return search.DisplayRouteID
              ? resultDisplayRouteID.filter(item => item.DisplayRouteID.includes(search.DisplayRouteID))
              : resultDisplayRouteID;
          }

          // 根據年分篩選資料
          if (search && search.manufacturing_year) {
            const resultByYear = response.data.Resource;

            return search.manufacturing_year
              ? resultByYear.filter(item => item.manufacturing_year.includes(search.manufacturing_year))
              : resultByYear;
          }
          return response.data.Resource;
        })
        .catch(e => console.log(e));

      this.$emit(
        'updateResult',
        result,
        Object.assign({}, this.selectedInput),
        new Date(),
      );

      this.$emit('BusyStatus', false);

      this.UpdateContentSize();

      if (result.length === 0) {
        alert('查無資料');
      }
    },
    setQueryAreaCollapse(value) {
      this.isQueryAreaCollapsed = value;
      this.UpdateContentSize();
    },
    UpdateContentSize() {
      this.$nextTick(() => {
        this.$emit('UpdateContentSize');
      });
    },
    refreshData() {
      // GetResult帶查詢值因此不直接在這呼叫GetResult
      this.$emit('refreshData');
    },
    async checkExcutable() {
      if (this.dataNotUpdate) {
        const response = await this.$bvModal
          .msgBoxConfirm('有資料尚未更新，是否要繼續執行', {
            title: '訊息',
            size: 'sm',
            buttonSize: 'sm',
            okVariant: 'danger',
            okTitle: '繼續',
            cancelTitle: '取消',
            footerClass: 'p-2',
            hideHeaderClose: false,
            centered: true,
          })
          .then(value => value)
          .catch(e => console.log(e));

        return response;
      }

      return true;
    },
  },
};
</script>

<style lang="scss" scoped>
.container-border {
  border: 1px solid #aaaaaa;
}
</style>
