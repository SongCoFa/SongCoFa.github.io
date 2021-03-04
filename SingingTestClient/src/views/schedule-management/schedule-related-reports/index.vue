<template>
  <b-container ref="Content" fluid>
    <QueryTool
      v-if="!getday"
      v-bind="QueryToolApi"
      :dailyMileagesReportType="dailyMileagesReportType"
      @updateResult="updateResult"
      @UpdateContentSize="UpdateContentSize"
      @refreshData="refreshData"
      @BusyStatus="BusyStatus"
      ref="QueryTool"
    >
      <template v-slot:selectForm>
        <b-form-select v-model="reportType" :options="reportOptions" class="form-type-selector border-primary mx-1"></b-form-select>
      </template>
      <template v-slot:checkButton v-if="reportType === 'DailyMileagesReport'">
        <b-form-group class="m-0 h-100">
          <b-form-checkbox-group class="daily-mileages-group mx-1 pl-3"
            v-model="dailyMileagesReportType"
            :options="dailyMileagesReportOptions"
            :state="state"
          ></b-form-checkbox-group>
        </b-form-group>
      </template>
      <template v-slot:printButton>
        <b-button squared class="export-btn" variant="primary" @click="downloadExcel" :disabled="!queriedData.input || exporting || !state">
          <b-spinner variant="light" label="exporting" small class="mr-1" v-if="exporting"></b-spinner>
          <span>報表匯出</span>
        </b-button>
      </template>
    </QueryTool>
    <QueryTool
      v-if="getday"
      v-bind="QueryToolAnnual"
      :getday="getday"
      @updateResult="updateResult"
      @UpdateContentSize="UpdateContentSize"
      @refreshData="refreshData"
      @BusyStatus="BusyStatus"
      ref="QueryTool"
    >
      <template v-slot:selectForm>
        <b-form-select v-model="reportType" :options="reportOptions" class="form-type-selector border-primary mx-1"></b-form-select>
      </template>
      <template v-slot:printButton>
        <b-button squared class="export-btn" variant="primary" @click="downloadExcel" :disabled="!queriedData.input || exporting || !state">
          <b-spinner variant="light" label="exporting" small class="mr-1" v-if="exporting"></b-spinner>
          <span>報表匯出</span>
        </b-button>
      </template>
    </QueryTool>
    <b-card class="my-2 flex-grow-1" body-class="p-0" no-body  style="border: none">
      <ScheduleReportTable
        :reportType="reportType"
        :Table="Table"
        :containerHeight="containerHeight"
        :busyState="busyState"
      >
      </ScheduleReportTable>
    </b-card>
  </b-container>
</template>

<script>
import QueryTool from '@/components/QueryTool/index.vue';
import ScheduleReportTable from '@/components/table/ScheduleReportTable.vue';

export default {
  name: 'ScheduleRelatedReports',
  components: {
    QueryTool,
    ScheduleReportTable,
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

      JSONResultApi: `${process.env.VUE_APP_BASE_API}/api/ScheduleReport/MonthlyRoutesReportJSON`,
      PrintReportApi: `${process.env.VUE_APP_BASE_API}/api/ScheduleReport/MonthlyRoutesReport`,

      reportType: 'MonthlyRoutesReport',
      reportOptions: [
        { value: 'MonthlyRoutesReport', JSONvalue: 'MonthlyRoutesReportJSON', text: '每月班次表' },
        { value: 'DailyMileagesReport', JSONvalue: 'DailyMileagesReportJSON', text: '每日里程表' },
        { value: 'DailyEmptyReport', JSONvalue: 'DailyEmptyReportJSON', text: '每日空駛里程表' },
        { value: 'WorkingHoursReport', JSONvalue: 'WorkingHoursReportJSON', text: '駕駛區域工時表' },
        { value: 'DrivingHoursReport', JSONvalue: 'DrivingHoursReportJSON', text: '駕駛駕勤工時表' },
        { value: 'CharteredMileagesReport', JSONvalue: 'CharteredMileagesReportJSON', text: '專車里程表' },
        { value: 'BusMileagesReport', JSONvalue: 'BusMileagesReportJSON', text: '車輛總里程表' },
        { value: 'DriverLeavesReport', JSONvalue: 'DriverLeavesReportJSON', text: '每月出勤表' },
        { value: 'AnnualLeaveReport', JSONvalue: 'AnnualLeaveReportJSON', text: '特休明細表' },
      ],

      dailyMileagesReportType: ['regular', 'Charter', 'special'],
      dailyMileagesReportOptions: [
        { text: '班車', value: 'regular' },
        { text: '包車', value: 'Charter' },
        { text: '專車', value: 'special' },
      ],

      exporting: false,
      getday: false,
      busyState: false,
    };
  },
  watch: {
    reportType(value) {
      const option = this.reportOptions.find(item => item.value === value);

      if (!option) {
        option.value = '';
        option.JSONvalue = '';
      }
      if (option.value === 'AnnualLeaveReport') {
        this.getday = true;
      } else {
        this.getday = false;
      }
      this.PrintReportApi = `${process.env.VUE_APP_BASE_API}/api/ScheduleReport/${option.value}`;
      this.JSONResultApi = `${process.env.VUE_APP_BASE_API}/api/ScheduleReport/${option.JSONvalue}`;
    },
  },
  mounted() {
    this.$nextTick(() => {
      this.UpdateContentSize();
      window.addEventListener('resize', this.UpdateContentSize);
    });
  },
  computed: {
    QueryToolApi() {
      return {
        GetResultApi: this.JSONResultApi,
        EnabledInputList: [
          { name: 'Year', defaultInput: this.$moment().add(-1, 'months').format('YYYY') },
          { name: 'Month', defaultInput: this.$moment().add(-1, 'months').format('MM') },
        ],
      };
    },
    state() {
      return this.dailyMileagesReportType.length > 0;
    },
    QueryToolAnnual() {
      return {
        GetResultApi: this.JSONResultApi,
        EnabledInputList: [
          { name: 'Annualday', defaultInput: this.$moment().add(-1, 'dates').format('DD') },
        ],
      };
    },
  },
  methods: {
    BusyStatus(status) {
      this.busyState = status;
    },
    UpdateContentSize() {
      const totalHeight = this.$refs.Content.clientHeight;

      const queryAreaHeight = this.$refs.QueryTool.$refs.QueryToolArea
        .clientHeight;

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
      this.refreshData();

      this.exporting = true;

      const condition = Object.assign({}, this.queriedData.input);

      if (this.reportType === 'DailyMileagesReport') {
        const checkArray = ['regular', 'Charter', 'special'];

        checkArray.forEach((item) => {
          if (this.dailyMileagesReportType.includes(item)) {
            condition[item] = true;
          } else {
            condition[item] = false;
          }
        });
      }

      if (this.reportType === 'AnnualLeaveReport') {
        const today = new Date();
        const date = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate();
        condition.today = date;
      }

      const base64str = await this.$http.post(this.PrintReportApi, condition)
        .then(response => response.data.Resource)
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
      const name = this.reportOptions.find(item => item.value === this.reportType);
      const file = pre + base64str;
      const filetitle = `${this.queriedData.input.year}_${this.queriedData.input.month}_${name.text}`;

      const link = document.createElement('a');
      link.setAttribute('href', file);
      link.setAttribute('download', `${filetitle}.xlsx`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      this.exporting = false;
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

.export-btn {
  display: inline-flex;
  flex-direction: row;
  align-items: center;
}

::v-deep .custom-control-input:checked ~ .custom-control-label::before {
  border-color: #fff;
}

.daily-mileages-group {
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  border: 1px solid #00a199;
  color: #fff;
  height: 38px;
}
</style>
