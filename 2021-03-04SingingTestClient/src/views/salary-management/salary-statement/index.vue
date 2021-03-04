<template>
  <!-- <UnderConstruction /> -->
  <b-container ref="Content" fluid>
    <div class="text-right" style="position:absolute; right:15px; z-index:99;">
      <b-form-select v-model="reportType" :options="reportOptions" class="form-type-selector border-primary mx-1"></b-form-select>
      <b-button variant="primary" @click="downloadExcel" :disabled="!queriedData.input">報表匯出</b-button>
    </div>
    <QueryTool
      v-bind="QueryToolApi"
      @updateResult="updateResult"
      @UpdateContentSize="UpdateContentSize"
      @refreshData="refreshData"
      ref="QueryTool"
    ></QueryTool>
    <b-card class="my-2 flex-grow-1" body-class="p-0">
      <!-- <b-card-header class="text-right">
        <b-form-select v-model="reportType" :options="reportOptions" class="form-type-selector border-primary mx-1"></b-form-select>
        <b-button variant="primary" @click="downloadExcel" :disabled="!queriedData.input">報表匯出</b-button>
      </b-card-header> -->
      <CompensationReportTable
        v-if="reportType === '薪津清冊'"
        :Table="Table"
        :containerHeight="containerHeight"
      ></CompensationReportTable>
      <WithholdingReportTable
        v-else-if="reportType === '扣繳清冊'"
        :Table="Table"
        :containerHeight="containerHeight"
      >
      </WithholdingReportTable>
      <div v-else>
        <span>未存在該種表單</span>
      </div>
    </b-card>
  </b-container>
</template>

<script>
// import UnderConstruction from '@/views/under-construction/index.vue';
import QueryTool from '@/components/QueryTool/index.vue';
import CompensationReportTable from '@/components/table/CompensationReportTable.vue';
import WithholdingReportTable from '@/components/table/WithholdingReportTable.vue';

export default {
  name: 'SalaryStatement',
  components: {
    // UnderConstruction,
    QueryTool,
    CompensationReportTable,
    WithholdingReportTable,
  },
  data() {
    return {
      reportType: '薪津清冊',
      reportOptions: [
        { value: '薪津清冊', text: '薪津清冊' },
        { value: '扣繳清冊', text: '扣繳清冊' },
      ],

      GetResultApi: `${process.env.VUE_APP_BASE_API}/api/ReportInventory/GetCompensationReport`,
      PrintReportApi: `${process.env.VUE_APP_BASE_API}/api/ReportInventory/PrintCompensationReport`,

      Table: {
        items: [],
      },

      queriedData: {
        input: null,
        time: null,
      },

      containerHeight: 0,
    };
  },
  created() {
  },
  mounted() {
    this.$nextTick(() => {
      this.UpdateContentSize();
      window.addEventListener('resize', this.UpdateContentSize);
    });
  },
  watch: {
    reportType(newValue) {
      this.queriedData.input = null;

      if (newValue === '薪津清冊') {
        this.GetResultApi = `${process.env.VUE_APP_BASE_API}/api/ReportInventory/GetCompensationReport`;
        this.PrintReportApi = `${process.env.VUE_APP_BASE_API}/api/ReportInventory/PrintCompensationReport`;
      }

      if (newValue === '扣繳清冊') {
        this.GetResultApi = `${process.env.VUE_APP_BASE_API}/api/ReportInventory/GetWithholdingReport`;
        this.PrintReportApi = `${process.env.VUE_APP_BASE_API}/api/ReportInventory/PrintWithholdingReport`;
      }
    },
  },
  computed: {
    QueryToolApi() {
      return {
        GetResultApi: this.GetResultApi,
        AddApi: null,
        EnabledInputList: [
          { name: 'Year', defaultInput: this.$moment().add(-1, 'months').format('YYYY') },
          { name: 'Month', defaultInput: this.$moment().add(-1, 'months').format('MM') },
        ],
      };
    },
  },
  methods: {
    UpdateContentSize() {
      const totalHeight = this.$refs.Content.clientHeight;
      const queryAreaHeight = this.$refs.QueryTool.$refs.QueryToolArea.clientHeight;
      this.containerHeight = totalHeight - queryAreaHeight;
    },
    updateResult(result, queriedInput, time) {
      if (!result) {
        this.Table.items = [];
      } else {
        this.Table.items = JSON.parse(result);
      }

      this.queriedData.input = queriedInput;
      this.queriedData.time = time;
    },
    refreshData() {
      this.$refs.QueryTool.GetResult(this.queriedData.input);
    },
    async downloadExcel() {
      const base64str = await this.$http.post(this.PrintReportApi, this.queriedData.input)
        .then((response) => {
          console.log(response.data.Resource);
          return response.data.Resource;
        })
        .catch(error => console.log(error));

      if (base64str.startsWith('FailMessage:')) {
        this.$bvModal.msgBoxOk(base64str.replace('FailMessage:', '失敗訊息:'), {
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

      const pre = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,';
      const file = pre + base64str;
      const filetitle = `${this.queriedData.input.year}_${this.queriedData.input.month}_${this.reportType}`;

      const link = document.createElement('a');
      link.setAttribute('href', file);
      link.setAttribute('download', `${filetitle}.xlsx`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
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
