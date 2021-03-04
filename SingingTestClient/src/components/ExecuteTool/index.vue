<template>
  <div ref="QueryToolArea">
    <QueryNav
      @setQueryAreaCollapse="setQueryAreaCollapse"
    ></QueryNav>
    <div class="bg-light container-border p-3" :hidden="isQueryAreaCollapsed" v-if="EnabledInputList.length > 0">
      <InputTool
        :list="EnabledInputList"
        :inputClasses="['col-12 col-sm']"
        :selectedInput="selectedInput"
        @updateInput="setInput"
      />

      <b-row>
        <b-button block variant="primary" class="mt-3 mx-3" @click="transfer">轉班表</b-button>
      </b-row>
    </div>

    <b-modal
      ref="progressModal"
      centered
      no-close-on-esc
      no-close-on-backdrop
      hide-header
      hide-footer
    >
      <b-progress :value="100" variant="primary" striped :animated="true"></b-progress>
    </b-modal>
  </div>
</template>

<script>
import QueryNav from '@/components/QueryTool/InputField/QueryNav/index.vue';
import InputTool from '@/components/InputTool/index.vue';

export default {
  name: 'ExecuteTool',
  components: {
    QueryNav,
    InputTool,
  },
  props: {
    ExecuteApi: String,
    EnabledInputList: Array,
  },
  data() {
    return {
      isQueryAreaCollapsed: false,
      selectedInput: {},
    };
  },
  methods: {
    setInput({ backendFieldName, value }) {
      this.$set(this.selectedInput, backendFieldName, value);
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
    async transfer() {
      const startDate = this.$moment(this.selectedInput.start_date);
      const endDate = this.$moment(this.selectedInput.end_date);
      const now = startDate.clone();
      const dates = [];

      const isDateValid = this.checkDateRange(startDate, endDate);

      if (!isDateValid) return;

      while (now.isSameOrBefore(endDate)) {
        dates.push({ voucher_date: now.format('YYYY-MM-DD') });
        now.add(1, 'days');
      }

      this.$refs.progressModal.show();

      const result = await this.$http
        .post(this.ExecuteApi, dates)
        .then((response) => {
          this.$refs.progressModal.hide();
          return response.data.Resource;
          // this.msgBox(response.data.Message);
        })
        .catch(e => console.log(e));

      this.$emit('updateResult', result);
    },
    checkDateRange(start, end) {
      if (start.isValid() === false || end.isValid() === false) {
        this.msgBox('請符合日期格式');
        return false;
      }

      // 檢查起始日是否在結束日之後
      const isAfter = start.isAfter(end);

      if (isAfter) {
        this.msgBox('結束日大於起始日');
        return false;
      }

      // 檢查是否超過一周
      const range = end.diff(start, 'days') + 1;

      if (range > 7) {
        this.msgBox('日期範圍請選在一周內');
        return false;
      }

      return true;
    },
    msgBox(msg) {
      this.$bvModal.msgBoxOk(msg, {
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
    },
  },
};
</script>

<style lang="scss" scoped>

</style>
