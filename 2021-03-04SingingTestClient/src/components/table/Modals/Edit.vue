<template>
  <div>
    <b-button variant="primary" @click="$refs.modal.show()" :disabled="!EditApi || !writable">
      <font-awesome-icon :icon="['far', 'edit']" />
    </b-button>

    <b-modal
      ref="modal"
      :title="modalTitle"
      centered
      scrollable
      header-class="modal-head-footer-color"
      footer-class="modal-head-footer-color"
      body-class="modal-body-color"
      size="xl"
    >
      <template v-slot:modal-header="{ close }">
        <h5 class="modal-title">{{ modalTitle }}</h5>
        <slot name="DisplayWhichRow"></slot>
        <button type="button" aria-label="Close" class="close" @click="close()">×</button>
      </template>
      <InputTool
        :list="EditableList"
        :inputClasses="['col-sm-6']"
        @updateInput="setInput"
      />
      <template v-slot:modal-footer>
        <b-button
          :disabled="!isUserEdited"
          size="sm"
          block
          variant="primary"
          @click="handleOk();"
        >修改</b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import InputTool from '@/components/InputTool/index.vue';

export default {
  name: 'Edit',
  components: {
    InputTool,
  },
  props: {
    item: Object,
    fields: Array,
    EditApi: String,
    writable: Boolean,
  },
  data() {
    return {
      EditableList: [],
      selectedInput: {},
    };
  },
  computed: {
    modalTitle() {
      return `${this.$route.name}-編輯`;
    },
    isUserEdited() {
      return Object.keys(this.selectedInput).some(
        prop => this.item[prop] !== this.selectedInput[prop],
      );
    },
  },
  mounted() {
    this.EditableList = this.fields
      .filter(field => field.customize.editable === true)
      .sort((a, b) => {
        const res = a.customize.editSeq - b.customize.editSeq;
        return res || 0;
      })
      .map(field => ({
        name: field.customize.name,
        defaultInput: this.item[field.key],
      }));
  },
  methods: {
    setInput({ backendFieldName, value }) {
      this.$set(this.selectedInput, backendFieldName, value);
    },
    async handleOk() {
      const send = [Object.assign({}, this.item, this.selectedInput)];

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

      if (routeName === '帳號管理') {
        // 編輯權限API
        await this.revisePermission(send);
      }

      this.excuteAPI(send);
    },
    excuteAPI(send) {
      console.log(send);
      this.$http.post(this.EditApi, send)
        .then((response) => {
          this.$refs.modal.hide();
          console.log(response);
          this.$bvModal
            .msgBoxOk(`編輯訊息：${response.data.Resource.ReturnMessage}`, {
              size: 'sm',
              okTitle: '確定',
              centered: true,
            })
            .then((value) => {
              console.log(value);

              this.$emit('refreshData');
            })
            .catch(e => console.log(e));
        })
        .catch(e => console.log(e));
    },
    revisePermission(send) {
      return this.$http.post(`${process.env.VUE_APP_BASE_API}/api/acount-management/RevisePermission`, send)
        .then((response) => {
          this.$refs.modal.hide();
          console.log(response);
          return this.$bvModal
            .msgBoxOk(`權限變更${response.data.Resource.ReturnMessage}`, {
              size: 'sm',
              okTitle: '確定',
              centered: true,
            })
            .then(value => value)
            .catch(e => console.log(e));
        })
        .catch(e => console.log(e));
    },
  },
};
</script>
