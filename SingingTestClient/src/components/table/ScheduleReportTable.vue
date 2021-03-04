<template>
  <div class="d-flex flex-column flex-grow-1" ref="tableRoot">
    <b-table
      v-if="item && item.length > 0"
      class="m-0 text-nowrap"
      ref="tableInfo"
      head-variant="dark"
      table-variant="light"
      striped
      hover
      bordered
      responsive
      no-border-collapse
      :sticky-header="`${tableHeight}px`"
      :fields="field"
      :items="item"
      :per-page="tableSettings.perPage"
      :current-page="tableSettings.currentPage"
      busy.sync="busyState"
    >
    </b-table>
    <div v-if="busyState" class="table-spinner">
      <div class="text-center text-light my-2 spinner">
        <b-spinner class="align-middle mr-1"></b-spinner>
        <strong>載入中...</strong>
      </div>
    </div>

    <div class="d-flex justify-content-center p-2" ref="tablePagination">
      <b-pagination
        v-show="item && item.length > 0"
        v-model="tableSettings.currentPage"
        :total-rows="item.length"
        :per-page="tableSettings.perPage"
        first-text="首頁"
        prev-text="前一頁"
        next-text="下一頁"
        last-text="末頁"
      ></b-pagination>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ScheduleReportTable',
  props: {
    reportType: String,
    Table: Object,
    containerHeight: Number,
    busyState: Boolean,
  },
  data() {
    return {
      isMounted: false,

      field: [],
      item: [],

      tableSettings: {
        baseHeight: 200,
        perPage: 20,
        currentPage: 1,
      },

      tableRendering: false,
    };
  },
  mounted() {
    this.isMounted = true;
    this.generateContent();
  },
  watch: {
    Table: {
      handler() {
        this.generateContent();
      },
      deep: true,
    },
  },
  computed: {
    tableHeight() {
      if (!this.isMounted) return this.tableSettings.baseHeight;

      const Pagination = 70;

      const res = this.containerHeight - Pagination - 20;

      return res > this.tableSettings.baseHeight
        ? res
        : this.tableSettings.baseHeight;
    },
  },
  methods: {
    generateContent() {
      const type = this.reportType;

      switch (type) {
        case 'MonthlyRoutesReport':
          this.renderMonthlyRoutesReport();
          break;
        case 'DailyMileagesReport':
          this.renderDailyMileagesReport();
          break;
        case 'DailyEmptyReport':
          this.renderDailyEmptyReport();
          break;
        case 'WorkingHoursReport':
          this.renderWorkingHoursReport();
          break;
        case 'DrivingHoursReport':
          this.renderDrivingHoursReport();
          break;
        case 'CharteredMileagesReport':
          this.renderCharteredMileagesReport();
          break;
        case 'BusMileagesReport':
          this.renderBusMileagesReport();
          break;
        case 'DriverLeavesReport':
          this.renderDriverLeavesReport();
          break;
        case 'AnnualLeaveReport':
          this.renderAnnualLeaveReportReport();
          break;
        default:
          this.field = [];
          this.item = [];
          break;
      }
    },
    renderMonthlyRoutesReport() {
      try {
        const { items } = { ...this.Table };

        // 表頭
        this.field = [{ key: 'emp_name', label: '姓名' }, ...items.map(item => item.DisplayRouteID)];

        // 扁平化二維陣列
        const flatItems = items.reduce((a, item) => {
          const result = a;
          const route = item.DisplayRouteID;

          const groupByRoute = item['main.Employees'].reduce((empArray, employee) => {
            const r2 = empArray;
            const employeeObj = {};

            employeeObj.DisplayRouteID = route;
            employeeObj.emp_name = employee.emp_name;
            employeeObj.count = employee.count;

            empArray.push(employeeObj);

            return r2;
          }, []);

          groupByRoute.forEach((element) => {
            result.push(element);
          });

          return result;
        }, []);

        // 根據員工分群物件
        const groupByEmployee = flatItems.reduce((a, b) => {
          const result = a;
          const obj = {};

          const existed = result.find(item => item.emp_name === b.emp_name);

          if (existed) {
            existed[`${b.DisplayRouteID}`] = b.count;
          } else {
            obj.emp_name = b.emp_name;
            obj[`${b.DisplayRouteID}`] = b.count;
            result.push(obj);
          }

          return result;
        }, []);

        // 內容
        this.item = groupByEmployee;
      } catch {
        this.field = [];
        this.item = [];
      }
    },
    renderDailyMileagesReport() {
      try {
        const { items } = { ...this.Table };
        // 表頭
        this.field = [{ key: 'emp_name', label: '姓名' }, ...items.map(item => item.date)];

        // 扁平化二維陣列
        const flatItems = items.reduce((a, item) => {
          const result = a;
          const { date } = { ...item };

          const groupByDate = item.employees.reduce((empArray, employee) => {
            const array = empArray;
            const employeeObj = {};

            employeeObj.date = date;
            employeeObj.emp_name = employee.emp_name;
            employeeObj.distance = employee.distance;

            array.push(employeeObj);

            return array;
          }, []);

          groupByDate.forEach((element) => {
            result.push(element);
          });

          return result;
        }, []);

        // 根據員工分群物件
        const groupByEmployee = flatItems.reduce((a, b) => {
          const result = a;
          const obj = {};

          const existed = result.find(item => item.emp_name === b.emp_name);

          if (existed) {
            existed[`${b.date}`] = b.distance;
          } else {
            obj[`${b.date}`] = b.distance;
            obj.emp_name = b.emp_name;
            result.push(obj);
          }

          return result;
        }, []);
        // 內容
        this.item = groupByEmployee;
      } catch {
        this.field = [];
        this.item = [];
      }
    },
    renderDailyEmptyReport() {
      try {
        const { items } = { ...this.Table };

        // 表頭
        this.field = [{ key: 'emp_name', label: '姓名' }, ...items.map(item => item.date)];

        // 扁平化二維陣列
        const flatItems = items.reduce((a, item) => {
          const result = a;
          const { date } = { ...item };
          const groupByDate = item.employees.reduce((empArray, employee) => {
            const array = empArray;
            const obj = {};

            obj.date = date;
            obj.emp_name = employee.emp_name;
            obj.distance = employee.distance;
            console.log(employee);

            array.push(obj);

            return array;
          }, []);

          groupByDate.forEach((element) => {
            result.push(element);
          });

          return result;
        }, []);

        // 根據員工分群物件
        const groupByEmployee = flatItems.reduce((a, b) => {
          const result = a;
          const obj = {};

          const existed = result.find(item => item.emp_name === b.emp_name);

          if (existed) {
            existed[`${b.date}`] = b.distance;
          } else {
            obj[`${b.date}`] = b.distance;
            obj.emp_name = b.emp_name;
            result.push(obj);
          }

          return result;
        }, []);

        // 內容
        this.item = groupByEmployee;
        // console.log(this.item);
      } catch {
        this.field = [];
        this.item = [];
      }
    },
    renderWorkingHoursReport() {
      try {
        const { items } = { ...this.Table };

        // 表頭
        this.field = [{ key: 'emp_name', label: '姓名' }, ...items.map(item => item.date)];

        // 扁平化二維陣列
        const flatItems = items.reduce((a, item) => {
          const result = a;
          const { date } = { ...item };

          const groupByDate = item.employee.reduce((empArray, employee) => {
            const array = empArray;
            const obj = {};

            obj.date = date;
            obj.emp_name = employee.emp_name;
            obj.hours = employee.hours;

            array.push(obj);

            return array;
          }, []);

          groupByDate.forEach((element) => {
            result.push(element);
          });

          return result;
        }, []);

        // 根據員工分群物件
        const groupByEmployee = flatItems.reduce((a, b) => {
          const result = a;
          const obj = {};

          const existed = result.find(item => item.emp_name === b.emp_name);

          if (existed) {
            existed[`${b.date}`] = b.hours;
          } else {
            obj[`${b.date}`] = b.hours;
            obj.emp_name = b.emp_name;
            result.push(obj);
          }

          return result;
        }, []);

        // 內容
        this.item = groupByEmployee;
      } catch {
        this.field = [];
        this.item = [];
      }
    },
    renderDrivingHoursReport() {
      try {
        const { items } = { ...this.Table };

        // 表頭
        this.field = [{ key: 'emp_name', label: '姓名' }, ...items.map(item => item.date)];

        // 扁平化二維陣列
        const flatItems = items.reduce((a, item) => {
          const result = a;
          const { date } = { ...item };

          const groupByDate = item.E.reduce((empArray, employee) => {
            const array = empArray;
            const obj = {};

            obj.date = date;
            obj.emp_name = employee.emp_name;
            obj.period = employee.period;

            array.push(obj);

            return array;
          }, []);

          groupByDate.forEach((element) => {
            result.push(element);
          });

          return result;
        }, []);

        // 根據員工分群物件
        const groupByEmployee = flatItems.reduce((a, b) => {
          const result = a;
          const obj = {};

          const existed = result.find(item => item.emp_name === b.emp_name);

          if (existed) {
            existed[`${b.date}`] = b.period;
          } else {
            obj[`${b.date}`] = b.period;
            obj.emp_name = b.emp_name;
            result.push(obj);
          }

          return result;
        }, []);

        // 內容
        this.item = groupByEmployee;
      } catch {
        this.field = [];
        this.item = [];
      }
    },
    renderCharteredMileagesReport() {
      try {
        const { items } = { ...this.Table };

        // 表頭
        this.field = [{ key: 'route_name', label: '單位' }, ...items.map(item => item.date)];

        // 扁平化二維陣列
        const flatItems = items.reduce((a, item) => {
          const result = a;
          const { date } = { ...item };

          const groupByDate = item.routes.reduce((routeArray, route) => {
            const array = routeArray;
            const obj = {};

            obj.date = date;
            obj.route_name = route.route_name;
            obj.distance = route.distance;

            array.push(obj);

            return array;
          }, []);

          groupByDate.forEach((element) => {
            result.push(element);
          });

          return result;
        }, []);

        // 根據路線分群物件
        const groupByRoute = flatItems.reduce((a, b) => {
          const result = a;
          const obj = {};

          const existed = result.find(item => item.route_name === b.route_name);

          if (existed) {
            existed[`${b.date}`] = b.distance;
          } else {
            obj[`${b.date}`] = b.distance;
            obj.route_name = b.route_name;
            result.push(obj);
          }

          return result;
        }, []);

        // 內容
        this.item = groupByRoute;
      } catch {
        this.field = [];
        this.item = [];
      }
    },
    renderBusMileagesReport() {
      try {
        const { items } = { ...this.Table };

        // 表頭
        this.field = [{ key: 'bus_no', label: '車號' }, ...items.map(item => item.date)];

        // 扁平化二維陣列
        const flatItems = items.reduce((a, item) => {
          const result = a;
          const { date } = { ...item };

          const groupByDate = item.bus.reduce((busArray, bus) => {
            const array = busArray;
            const obj = {};

            obj.date = date;
            obj.bus_no = bus.bus_no;
            obj.distance = bus.distance;

            array.push(obj);

            return array;
          }, []);

          groupByDate.forEach((element) => {
            result.push(element);
          });

          return result;
        }, []);

        // 根據車號分群物件
        const groupByBusno = flatItems.reduce((a, b) => {
          const result = a;
          const obj = {};

          const existed = result.find(item => item.bus_no === b.bus_no);

          if (existed) {
            existed[`${b.date}`] = b.distance;
          } else {
            obj[`${b.date}`] = b.distance;
            obj.bus_no = b.bus_no;
            result.push(obj);
          }

          return result;
        }, []);

        // 內容
        this.item = groupByBusno;
      } catch {
        this.field = [];
        this.item = [];
      }
    },
    renderDriverLeavesReport() {
      try {
        // FIXME: find a better way to pivot
        const { items } = { ...this.Table };
        console.log(this.Table.items);
        // 表頭
        this.field = [
          { key: 'emp_name', label: '姓名' },
          { key: 'activate_date', label: '到職日' },
          '例假應給日數',
          '例假',
          '例假剩餘日數',
          '休息日應給日數',
          '休息日',
          '休息日剩餘日數',
          '國定假日應給日數',
          '國定假日',
          '國定假日剩餘日數',
          '特別休假應給日數',
          '特別休假',
          '特別休假剩餘日數',
          '病假',
          '事假',
          '公假',
          '喪假',
          '婚假',
          '陪產假',
          '災防假',
          '選舉假',
          '曠職',
        ];

        // 扁平化二維陣列
        const flatItems = items.reduce((a, item) => {
          const result = a;
          const holidayName = item.holiday_name;

          const groupByType = item.leaves.reduce((leaveArray, leave) => {
            const array = leaveArray;
            const obj = {};

            obj.emp_name = leave.emp_name;
            obj.holiday_name = holidayName;
            obj.activate_date = leave.activate_date;
            obj.leave_days = leave.leave_days;
            obj.leave_default = leave.leave_default;
            obj.leave_reserved = leave.leave_reserved;

            array.push(obj);

            return array;
          }, []);

          groupByType.forEach((element) => {
            result.push(element);
          });

          return result;
        }, []);

        // 根據員工分群物件
        const groupByEmployee = flatItems.reduce((a, b) => {
          const result = a;
          const obj = {};

          // 遍歷過例假就會存在在 result 內
          const existed = result.find(item => item.emp_name === b.emp_name);

          if (existed) {
            existed['休息日應給日數'] = (b.holiday_name === '休息日') ? b.leave_default : existed['休息日應給日數'];
            existed['休息日'] = (b.holiday_name === '休息日') ? b.leave_days : existed['休息日'];
            existed['休息日剩餘日數'] = (b.holiday_name === '休息日') ? b.leave_reserved : existed['休息日剩餘日數'];

            existed['國定假日應給日數'] = (b.holiday_name === '國定假日') ? b.leave_default : existed['國定假日應給日數'];
            existed['國定假日'] = (b.holiday_name === '國定假日') ? b.leave_days : existed['國定假日'];
            existed['國定假日剩餘日數'] = (b.holiday_name === '國定假日') ? b.leave_reserved : existed['國定假日剩餘日數'];

            existed['特別休假應給日數'] = (b.holiday_name === '特別休假') ? b.leave_default : existed['特別休假應給日數'];
            existed['特別休假'] = (b.holiday_name === '特別休假') ? b.leave_days : existed['特別休假'];
            existed['特別休假剩餘日數'] = (b.holiday_name === '特別休假') ? b.leave_reserved : existed['特別休假剩餘日數'];

            existed['病假'] = (b.holiday_name === '病假') ? b.leave_days : existed['病假'];

            existed['事假'] = (b.holiday_name === '事假') ? b.leave_days : existed['事假'];

            existed['公假'] = (b.holiday_name === '公假') ? b.leave_days : existed['公假'];

            existed['喪假'] = (b.holiday_name === '喪假') ? b.leave_days : existed['喪假'];

            existed['婚假'] = (b.holiday_name === '婚假') ? b.leave_days : existed['婚假'];

            existed['陪產假'] = (b.holiday_name === '陪產假') ? b.leave_days : existed['陪產假'];

            existed['颱風假'] = (b.holiday_name === '颱風假') ? b.leave_days : existed['颱風假'];

            existed['選舉假'] = (b.holiday_name === '選舉假') ? b.leave_days : existed['選舉假'];

            existed['曠職'] = (b.holiday_name === '曠職') ? b.leave_days : existed['曠職'];
          } else {
            obj.emp_name = b.emp_name;
            obj.activate_date = b.activate_date;

            obj['例假應給日數'] = (obj.emp_name === b.emp_name && b.holiday_name === '例假') ? b.leave_default : obj['例假應給日數'];
            obj['例假'] = (obj.emp_name === b.emp_name && b.holiday_name === '例假') ? b.leave_days : obj['例假'];
            obj['例假剩餘日數'] = (obj.emp_name === b.emp_name && b.holiday_name === '例假') ? b.leave_reserved : obj['例假剩餘日數'];

            result.push(obj);
          }

          return result;
        }, []);

        // 內容
        this.item = groupByEmployee;
      } catch {
        this.field = [];
        this.item = [];
      }
    },
    renderAnnualLeaveReportReport() {
      try {
        const { items } = { ...this.Table };
        // console.log(this.Table.items);
        // 表頭
        this.field = [
          { key: 'emp_name', label: '姓名' },
          '任職日期',
          '年資',
          '去年計算日期區間',
          '去年剩餘特休日數',
          '今年計算日期區間',
          '今年剩餘特休日數',
          ];

        // 扁平化二維陣列
        const flatItems = items.reduce((a, item) => {
          const result = a;
          const holidayName = item.holiday_name;

          const groupByType = item.annual.reduce((annualArray, annual) => {
            const array = annualArray;
            const obj = {};

            obj.emp_name = annual.emp_name;
            obj.holiday_name = holidayName;
            obj.content = annual.content;

            array.push(obj);

            return array;
          }, []);

          groupByType.forEach((element) => {
            result.push(element);
          });

          return result;
        }, []);

        // 根據車號分群物件
        const groupByEmployee = flatItems.reduce((a, b) => {
          const result = a;
          const obj = {};

          const existed = result.find(item => item.emp_name === b.emp_name);

          if (existed) {
            existed['任職日期'] = (b.holiday_name === '任職日期') ? b.content : existed['任職日期'];
            existed['年資'] = (b.holiday_name === '年資') ? b.content : existed['年資'];
            existed['去年計算日期區間'] = (b.holiday_name === '去年計算日期區間') ? b.content : existed['去年計算日期區間'];
            existed['去年剩餘特休日數'] = (b.holiday_name === '去年剩餘特休日數') ? b.content : existed['去年剩餘特休日數'];
            existed['今年計算日期區間'] = (b.holiday_name === '今年計算日期區間') ? b.content : existed['今年計算日期區間'];
            existed['今年剩餘特休日數'] = (b.holiday_name === '今年剩餘特休日數') ? b.content : existed['今年剩餘特休日數'];
          } else {
            obj.emp_name = b.emp_name;

            result.push(obj);
          }

          return result;
        }, []);

        // 內容
        this.item = groupByEmployee;
      } catch {
        this.field = [];
        this.item = [];
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.table-spinner {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  // min-height: 100px;
  height: 100%;
  z-index: 10;
  background-color: rgba($color: #000000, $alpha: 0.4);

  .spinner {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}

</style>
