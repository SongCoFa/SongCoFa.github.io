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
      <template v-slot:printButton>
        <b-button squared variant="primary mr-1" @click="printV2(formType)" :disabled="loading">列印</b-button>
        <b-button squared variant="primary" @click="ExportExcel" :disabled="loading">匯出 EXCEL 檔</b-button>
      </template>
    </QueryTool>
    <FormTool
      :Table="Table"
      :FormType="formType"
      :queriedData="queriedData"
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
  name: 'PayrollQuery',
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
      formType: 'PayRollForm',
      formOptions: [
        { value: 'PayRollForm', text: '薪津表' },
      ],

      loading: false,
    };
  },
  computed: {
    QueryToolApi() {
      return {
        GetResultApi: `${process.env.VUE_APP_BASE_API}/api/salary/GetList`,
        EnabledInputList: [
          { name: 'Year', defaultInput: this.$moment().add(-1, 'months').format('YYYY') },
          { name: 'Month', defaultInput: this.$moment().add(-1, 'months').format('MM') },
          { name: 'EmployeeInSalaryMonth', defaultInput: null },
          { name: 'Department', defaultInput: null },
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
    printV2() {
      this.$refs.FormTool.printPDFV2();
    },
    ExportExcel() {
      this.$refs.FormTool.downloadExcel();
    },
    fileProcessing(value) {
      this.loading = value;
    },
  },
  beforeRouteLeave(to, from, next) {
    window.removeEventListener('resize', this.UpdateContentSize);
    next();
  },
};
</script>

<style lang="scss" scoped>
.form-type-selector {
  width: 200px
}
</style>
