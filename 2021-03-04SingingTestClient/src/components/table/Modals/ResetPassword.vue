<template>
  <div>
    <b-button variant="danger" @click="$refs.modal.show()" :disabled="!writable">
      <font-awesome-icon :icon="['fas', 'undo-alt']" />
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
      <h4 class="text-center">您確定要重置{{ `${item.emp_name}` }}的密碼?</h4>
      <template v-slot:modal-footer>
        <b-button size="sm" block variant="danger" @click="handleOk();">確認</b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'ResetPassword',
   props: {
    item: Object,
    ResetPasswordApi: String,
    writable: Boolean,
  },
  computed: {
    modalTitle() {
      return '密碼重置';
    },
  },
  methods: {
    handleOk() {
      const send = { emp_ID: this.item.emp_ID, password_new: null };
      const member = window.sessionStorage.getItem('member');
      if (member === 'visitor') {
        alert('使用者權限不足');
        return;
      }

      this.$http
        .post(
          this.ResetPasswordApi,
          send,
        )
        .then((response) => {
          console.log(response.data);

          this.$refs.modal.hide();

          this.$bvModal
            .msgBoxOk(response.data.Resource.ReturnMessage, {
              size: 'sm',
              okTitle: '確定',
              centered: true,
            })
            .then(() => {
              this.$emit('refreshData');
            })
            .catch(e => console.log(e));
        })
        .catch(e => console.log(e));
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
