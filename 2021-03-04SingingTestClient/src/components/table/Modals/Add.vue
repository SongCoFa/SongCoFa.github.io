<template>
  <div>
    <b-button
      squared
      class="container-border"
      variant="primary"
      @click="$refs.modal.show()"
      :disabled="!writable"
    >
      {{componentName}}
    </b-button>
    <b-modal
      ref="modal"
      :title="modalTitle"
      centered
      scrollable
      header-class="modal-head-footer-color"
      footer-class="modal-head-footer-color"
      body-class="modal-body-color"
    >
      <InputTool
        :list="AddList"
        :inputClasses="['col-sm-6']"
        @updateInput="setInput"
        @validateRequired="isAbleToAdd = $event"
      />

      <template v-slot:modal-footer>
        <b-button
          :disabled="!isAbleToAdd"
          size="sm"
          block
          variant="primary"
          @click="handleOk();"
        >{{componentName}}</b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import InputTool from '@/components/InputTool/index.vue';

export default {
  name: 'Add',
  components: {
    InputTool,
  },
  props: {
    AddListFormat: Array,
    AddApi: String,
    writable: Boolean,
  },
  data() {
    return {
      componentName: '新增',
      AddList: [],

      selectedInput: {},
      isAbleToAdd: false,
    };
  },
  mounted() {
    this.AddList = this.AddListFormat
      .sort((a, b) => {
        const res = a.addSeq - b.addSeq;
        return res || 0;
      });
  },
  computed: {
    modalTitle() {
      return `${this.$route.name}-${this.componentName}`;
    },
    cssClass() {
      return ['col-sm-6'];
    },
  },
  methods: {
    setInput({ backendFieldName, value }) {
      this.$set(this.selectedInput, backendFieldName, value);
    },
    handleOk() {
      const send = [Object.assign({}, this.selectedInput)];

      // FIXME: 其他表做新增都會加入 intermediate_stations
      if (!send[0].intermediate_stations) {
        send[0].intermediate_stations = '[]';
      }

      const routeName = this.$route.name;

      // holiday date check start & end
      if (routeName === '國定假日資料管理') {
        const start = new Date(send[0].start_date);
        const end = new Date(send[0].end_date);
        if (start > end) {
          this.$bvModal.msgBoxOk('起始日必須小於結束日', {
            title: '訊息',
            size: 'sm',
            buttonSize: 'sm',
            okVariant: 'info',
            headerClass: 'p-2 border-bottom-0',
            footerClass: 'p-2 border-top-0',
            centered: true,
          })
          .then(() => {})
          .catch(e => console.log(e));

          return;
        }
      }

      // 特殊日期檢查
      if (routeName === '特殊日期資料管理') {
        const start = new Date(send[0].special_start_date);
        const end = new Date(send[0].special_end_date);
        if (start > end) {
          this.$bvModal.msgBoxOk('起始日必須小於結束日', {
            title: '訊息',
            size: 'sm',
            buttonSize: 'sm',
            okVariant: 'info',
            headerClass: 'p-2 border-bottom-0',
            footerClass: 'p-2 border-top-0',
            centered: true,
          })
          .then(() => {})
          .catch(e => console.log(e));

          return;
        }
      }

      // 駕駛長休假資料管理
      if (routeName === '駕駛長休假資料管理') {
        const start = new Date(send[0].leave_start_date);
        const end = new Date(send[0].leave_end_date);

        const times = end.getTime() - start.getTime();
        const timesToDates = times / (1000 * 3600 * 24);

        const days = parseInt(send[0].leave_days, 10);

        const check = days <= timesToDates + 1 && days >= timesToDates;

        if (!check) {
          this.$bvModal.msgBoxOk('日數請在起始日期和結束日期有效區間內', {
            title: '訊息',
            size: 'sm',
            buttonSize: 'sm',
            okVariant: 'info',
            headerClass: 'p-2 border-bottom-0',
            footerClass: 'p-2 border-top-0',
            centered: true,
          })
          .then(() => {})
          .catch(e => console.log(e));

          return;
        }
      }

      // 總班表檢查起始結束日
      if (routeName === '總班表管理') {
        const start = new Date(send[0].active_date);
        const end = new Date(send[0].expire_date);

        if (start > end) {
          this.$bvModal.msgBoxOk('失效日必須大於生效日', {
            title: '訊息',
            size: 'sm',
            buttonSize: 'sm',
            okVariant: 'info',
            headerClass: 'p-2 border-bottom-0',
            footerClass: 'p-2 border-top-0',
            centered: true,
          })
          .then(() => {})
          .catch(e => console.log(e));

          return;
        }
      }
      const member = window.sessionStorage.getItem('member');
      if (member === 'visitor') {
        alert('使用者權限不足');
        return;
      }

      // console.log(this.AddApi, send);

      this.$http
        .post(this.AddApi, send)
        .then((response) => {
          console.log(response.data);

          this.$refs.modal.hide();

          this.$bvModal
            .msgBoxOk(response.data.Resource.ReturnMessage, {
              title: '訊息',
              size: 'sm',
              okTitle: '確定',
              centered: true,
              buttonSize: 'sm',
              headerClass: 'p-2 border-bottom-0',
              footerClass: 'p-2 border-top-0',
            })
            .then((value) => {
              console.log(value);

              this.$emit('refreshData');
            })
            .catch(e => console.log(e));
        })
        .catch(e => console.log(e));
    },
  },
  destroyed() {},
};
</script>

<style lang="scss" scoped>
</style>
