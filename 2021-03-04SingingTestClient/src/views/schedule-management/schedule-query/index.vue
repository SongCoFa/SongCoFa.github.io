<template>
  <b-container ref="Content" fluid>
    <QueryTool
      v-bind="QueryToolApi"
      @updateResult="updateResult"
      @UpdateContentSize="UpdateContentSize"
      @refreshData="refreshData"
      ref="QueryTool"
    >
      <template v-slot:selectForm>
        <b-form-select v-model="formType" :options="formOptions" class="form-type-selector border-primary mx-1"></b-form-select>
      </template>
      <template v-slot:checkVocation>
        <b-form-checkbox v-model="includeVocation" class="vocation-check mx-1" @change="uncheckAll">
          包含休假排班資料
        </b-form-checkbox>
      </template>
      <template v-slot:printButton>
        <b-button squared variant="primary" @click="print" :disabled="loading">列印</b-button>
      </template>
      <template v-slot:downloadButton>
        <b-button squared class="ml-1" variant="primary" @click="downloadWord" :disabled="loading">下載 WORD 檔</b-button>
      </template>
    </QueryTool>
    <FormTool
      :Table="Table"
      :FormType="formType"
      :queriedData="queriedData"
      :includeVocation="includeVocation"
      @fileProcessing="fileProcessing"
      ref="FormTool"
    >
    </FormTool>
  </b-container>
</template>

<script>
import QueryTool from '@/components/QueryTool/index.vue';
import FormTool from '@/components/FormTool/index.vue';

export default {
  name: 'ScheduleQuery',
  components: {
    QueryTool,
    FormTool,
  },
  data() {
    return {
      Table: {
        fields: [],
        items: [],
      },
      queriedData: {
        input: null,
        time: null,
      },
      containerHeight: 0,
      formType: 'VoucherListForm',
      formOptions: [
        { value: 'VoucherListForm', text: '班車行駛路程表' },
        { value: 'VoucherForm', text: '行車憑單' },
      ],

      loading: false,
      includeVocation: true,
    };
  },
  computed: {
    QueryToolApi() {
      return {
        GetResultApi: `${process.env.VUE_APP_BASE_API}/api/voucher/ValidDriverList`,
        EnabledInputList: [
          { name: 'StartDate', defaultInput: this.$moment.utc((new Date()).setDate((new Date()).getDate())).format('YYYY-MM-DD') },
          { name: 'EndDate', defaultInput: this.$moment.utc((new Date()).setDate((new Date()).getDate())).format('YYYY-MM-DD') },
          { name: 'EmployeeIDSelection', defaultInput: null },
          { name: 'VoucherRouteName', defaultInput: null },
        ],
      };
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.UpdateContentSize();
      window.addEventListener('resize', this.UpdateContentSize);
    });
  },
  methods: {
    UpdateContentSize() {
      const totalHeight = this.$refs.Content.clientHeight;

      const queryAreaHeight = this.$refs.QueryTool.$refs.QueryToolArea
        .clientHeight;

      this.containerHeight = totalHeight - queryAreaHeight;
    },
    updateResult(result, queriedInput, time) {
      this.Table.items = result;
      this.queriedData.input = queriedInput;
      this.queriedData.time = time;
    },
    refreshData() {
      this.$refs.QueryTool.GetResult(this.queriedData.input);
    },
    print() {
      this.$refs.FormTool.printPDF();
    },
    downloadWord() {
      this.$refs.FormTool.downloadWord();
    },
    fileProcessing(value) {
      this.loading = value;
    },
    uncheckAll() {
      this.$refs.FormTool.uncheckAll();
    },
  },
  beforeRouteLeave(to, from, next) {
    window.removeEventListener('resize', this.UpdateContentSize);
    next();
  },
};
</script>

<style lang="scss" scoped>
::v-deep .custom-control-input:checked ~ .custom-control-label::before {
  border-color: #fff;
}

.form-type-selector {
  width: 200px
}

.vocation-check {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background: #00a199;
  color: #fff;
  width: 180px;
}
</style>
