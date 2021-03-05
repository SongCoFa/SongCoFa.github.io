<template>
  <div>
    <b-button variant="danger" @click="$refs.modal.show()" :disabled="disabled">
      <font-awesome-icon :icon="['fas', 'trash-restore-alt']" />
    </b-button>

    <b-modal
      ref="modal"
      centered
      scrollable
      header-class="modal-head-footer-color"
      footer-class="modal-head-footer-color"
      body-class="modal-body-color"
    >
      <h4 class="text-center">您確定要復職此名員工?</h4>
      <template v-slot:modal-footer>
        <b-button size="sm" block variant="danger" @click="handleOk();">確認</b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'Reinstatement',
  props: {
    item: Object,
    EditApi: String,
    writable: Boolean,
  },
  computed: {
    disabled() {
      let expired;

      if (this.item.expire_date) {
        expired = false;
      } else {
        expired = true;
      }

      const check = !this.writable || expired;
      return check;
    },
  },
  methods: {
    handleOk() {
      const send = Object.assign({}, this.item);
      send.expire_date = '2099-12-31';

      console.log(send);

      this.$http
        .post(this.EditApi, [send])
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
