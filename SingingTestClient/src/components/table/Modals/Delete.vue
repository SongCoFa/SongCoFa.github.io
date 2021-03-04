<template>
  <div>
    <b-button variant="danger" @click="$refs.modal.show()" :disabled="!DeleteApi || !writable">
      <font-awesome-icon :icon="['far', 'trash-alt']" />
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
      <h4 class="text-center">您確定要刪除該筆資料?</h4>
      <template v-slot:modal-footer>
        <b-button size="sm" block variant="danger" @click="handleOk();">刪除</b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'Delete',
  props: {
    delItem: Object,
    DeleteApi: String,
    writable: Boolean,
  },
  computed: {
    modalTitle() {
      return `${this.$route.name}-刪除`;
    },
  },
  methods: {
    handleOk() {
      const send = [this.delItem];
      const today = new Date();
      const date = `${today.getFullYear()
         }-${
         today.getMonth() + 1
         }-${
         today.getDate()}`;
      const time = `${today.getHours()}:${today.getMinutes()}:${today.getSeconds()}`;
      const dateTime = `${date} ${time}`;
      this.timestamp = dateTime;
      send[0].expire_date = dateTime;
      // console.log(send, dateTime);

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
