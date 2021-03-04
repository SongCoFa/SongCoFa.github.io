<template>
  <div>
    <b-button variant="danger" @click="$refs.modal.show()" :disabled="!DeleteApi || !writable">
      <font-awesome-icon :icon="['fas', 'trash-restore-alt']" />
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
      <h4 class="text-center">您確定要復職此員工?</h4>
      <template v-slot:modal-footer>
        <b-button size="sm" block variant="danger" @click="handleOk();">復職</b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'DriverReinstatement',
   props: {
    delItem: Object,
    DeleteApi: String,
    writable: Boolean,
  },
  computed: {
    modalTitle() {
      return `${this.$route.name}-復職`;
    },
  },
  methods: {
    handleOk() {
      const send = [this.delItem];
      send[0].expire_date = null;
      console.log(send);

      this.$http
        .post(
          this.DeleteApi, // TODO: extract to outside
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
            .then((value) => {
              console.log(value);

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
