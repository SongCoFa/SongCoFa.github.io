<template>
  <b-container ref="Content" fluid>
    <ExecuteTool
      ref="ExecuteTool"
      v-bind="ExecuteToolApi"
      @updateResult="updateResult"
    />
    <b-card class="my-2 flex-grow-1 h-100 overflow-hidden" body-class="p-0" no-body  style="border: none;">
      <div v-if="transferResult" class="h-100 overflow-auto">
        <template  v-for="(item, index) in transferResult">
          <b-alert class="my-1 mx-2" show :variant="alertvariant(item.isSuccessed)" :key="index">
            <span>轉換班表日期：{{ item.transferDate }}</span>
            <br>
            <span>轉換訊息：{{ item.message }}</span>
          </b-alert>
        </template>
      </div>
    </b-card>
  </b-container>
</template>

<script>
import ExecuteTool from '@/components/ExecuteTool/index.vue';

export default {
  name: 'TransferVoucher',
  components: {
    ExecuteTool,
  },
  data() {
    return {
      containerHeight: 0,
      transferResult: [],
    };
  },
  computed: {
    ExecuteToolApi() {
      return {
        ExecuteApi: `${process.env.VUE_APP_BASE_API}/api/voucher/TransferVoucher`,
        EnabledInputList: [
          { name: 'StartDate', defaultInput: this.$moment().format('YYYY-MM-DD') },
          { name: 'EndDate', defaultInput: this.$moment().format('YYYY-MM-DD') },
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

      const queryAreaHeight = this.$refs.ExecuteTool.$refs.QueryToolArea
        .clientHeight;

      this.containerHeight = totalHeight - queryAreaHeight;
    },
    updateResult(r) {
      const result = JSON.parse(r);
      this.transferResult = result;
    },
    alertvariant(s) {
      return s === true ? 'success' : 'danger';
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
