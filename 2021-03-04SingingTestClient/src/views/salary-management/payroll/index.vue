<template>
  <b-container ref="Content" fluid>
    <QueryTool
      v-bind="QueryToolApi"
      :dataNotUpdate="dataNotUpdate"
      :writable="writable"
      @updateResult="updateResult"
      @UpdateContentSize="UpdateContentSize"
      @refreshData="refreshData"
      ref="QueryTool"
    ></QueryTool>
    <div class="d-flex flex-flow flex-grow-1 overflow-hidden">
      <div class="h-100 bg-light list-panel" :class="{ 'collapse-panel': toggle }" ref="listPanel">
        <template v-if="!toggle">
          <div class="d-flex bg-dark p-0 list-panel-title-bar">
            <b-button squared class="collapse-btn" @click="sideBarCollapse">-</b-button>
            <div class="d-flex justify-content-center align-items-center text-light w-100">(員工編號)姓名</div>
          </div>
          <div class="query-list overflow-auto">
            <template v-for="(item, key) in Table.items">
              <div class="query-list-display" :key="key" @click="getSalaryDetail(item)" :class="{ 'background-primary': selectedEmplyee && item.emp_ID === selectedEmplyee.emp_ID }">
                <div class="text-area">({{ item.emp_ID }}){{ item.emp_name }}</div>
              </div>
            </template>
          </div>
        </template>
        <template v-else>
          <b-button squared class="collapse-btn" @click="sideBarCollapse">+</b-button>
        </template>
      </div>
      <div class="h-100 bg-light view-panel position-relative">
        <b-button class="mx-1" variant="primary" style="position: absolute; left: 12px; top: 20px; z-index:99;" :disabled="!writable" @click="REcalculate">重新計算薪資</b-button>
        <div class="operate-button-set">
          <b-button class="mx-1" variant="primary" :disabled="!writable" @click="calculate">試算</b-button>
          <b-button class="mx-1" variant="danger" :disabled="!writable" @click="updatePayroll">更新</b-button>
        </div>
        <CompensationTable
          :selectedItem="selectedItem"
          :originSelectedItem="originSelectedItem"
          :writable="writable"
          @checkDataNotUpdate="checkDataNotUpdate"
          ref="compensationTable"
        ></CompensationTable>
      </div>
    </div>
  </b-container>
</template>

<script>
import QueryTool from '@/components/QueryTool/index.vue';
import CompensationTable from '@/components/table/CompensationTable.vue';

export default {
  name: 'Payroll',
  components: {
    QueryTool,
    CompensationTable,
  },
  data() {
    return {
      toggle: false, // 側欄伸縮
      driverList: null, // 側欄司機清單

      Table: {
        fields: [],
        items: [],
      },

      selectedEmplyee: null,

      originSelectedItem: {},

      selectedItem: {},

      queriedData: {
        input: null,
        time: null,
      },

      convertTrialJSON: [
        { name: 'basic_payment', resultName: '薪俸' },
        { name: 'food_allowance', resultName: '伙食津貼' },
        { name: 'pension_company', resultName: '公司提撥勞工退休金' },
        { name: 'welfare_fee', resultName: '福利費' },
        { name: 'labor_insurance_fee', resultName: '勞保費' },
        { name: 'health_insurance_fee', resultName: '健保費' },
        { name: 'pension_personal', resultName: '勞退自提' },
        { name: 'insurance_fee', resultName: '保險費' },
        { name: 'special_allowance', resultName: '特殊津貼' },
        { name: 'night_allowance', resultName: '夜值津貼' },
        { name: 'bonus_cash', resultName: '獎金紅包' },
        { name: 'year_end_bonus', resultName: '年終獎金' },
        { name: 'consolation_money', resultName: '慰問金' },
        { name: 'mileage_allowance', resultName: '里程補貼' },
        { name: 'transportation_allowance', resultName: '交通費補貼' },
        { name: 'travel_allowance', resultName: '旅費' },
        { name: 'education_allowance', resultName: '教育補助費' },
        { name: 'loan', resultName: '暫借款' },
        { name: 'income_tax', resultName: '薪資所得稅' },
        { name: 'miscellaneous_fee', resultName: '雜費' },
        { name: 'supplement_fee', resultName: '補充保費' },
        { name: 'withholding', resultName: '執行命令代扣款' },
        { name: 'twocars_allowance', resultName: '一人2車津貼' },
        { name: 'car_damage_sharing', resultName: '車損協議分擔' },
        { name: 'incident_sharing', resultName: '肇事和解分擔' },
        { name: 'insurance_sharing', resultName: '保險費協議分擔' },
        { name: 'season_bonus', resultName: '季獎金' },
        { name: 'tip', resultName: '小費' },
        { name: 'extra_shuttle_allowance', resultName: '加班車津貼' },
        { name: 'other_bonus', resultName: '其他非勤務所得獎金' },
      ],

      REcalculateInput: {
        input: {
          emp_ID_name: null,
          expired: null,
          month: null,
          year: null,
        },
        time: null,
      },

      dataNotUpdate: false,

      containerHeight: 0,
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.UpdateContentSize();
      window.addEventListener('resize', this.UpdateContentSize);
    });
    const today = new Date();
    const nowyear = today.getFullYear();
    const nowmonth = today.getMonth();
    this.REcalculateInput.input.year = nowyear;
    this.REcalculateInput.input.month = nowmonth;
  },
  watch: {
    selectedItem: {
      handler() {
        // 比對初始暫存和選擇中的資料
        const compareObj = ((obj1, obj2) => Object.keys(obj1).length === Object.keys(obj2).length
          // eslint-disable-next-line no-prototype-builtins
          && Object.keys(obj1).every(key => obj2.hasOwnProperty(key) && obj2[key] === obj1[key]))(this.originSelectedItem, this.selectedItem);

        this.checkDataNotUpdate(!compareObj);
      },
      deep: true,
    },
  },
  computed: {
    QueryToolApi() {
      return {
        GetResultApi: `${process.env.VUE_APP_BASE_API}/api/salary/GetList`,
        AddApi: null,
        EnabledInputList: [
          { name: 'Year', defaultInput: this.$moment().add(-1, 'months').format('YYYY') },
          { name: 'Month', defaultInput: this.$moment().add(-1, 'months').format('MM') },
          { name: 'EmployeeInSalaryMonth', defaultInput: null },
          { name: 'Department', defaultInput: null },
        ],
      };
    },
    writable() {
      return this.$store.getters.permissions.salary_permission === 'W';
    },
  },
  methods: {
    sideBarCollapse() {
      this.toggle = !this.toggle;
    },
    UpdateContentSize() {
      const totalHeight = this.$refs.Content.clientHeight;

      const queryAreaHeight = this.$refs.QueryTool.$refs.QueryToolArea.clientHeight;

      this.containerHeight = totalHeight - queryAreaHeight;
    },
    updateResult(result, queriedInput, time) {
      this.dataNotUpdate = false;
      this.selectedEmplyee = null;
      this.selectedItem = {};
      this.originSelectedItem = {};

      this.Table.items = result;
      this.queriedData.input = queriedInput;
      this.queriedData.time = time;
      // this.getDriverList(result);
    },
    refreshData() {
      this.dataNotUpdate = false;

      this.$refs.QueryTool.GetResult(this.queriedData.input);
    },
    getDriverList(result) {
      // none use, deletable
      const res = result.reduce((a, b) => {
        const temp = a;

        const obj = {};

        obj.emp_ID = b.emp_ID;
        obj.emp_name = b.emp_name;

        temp.push(obj);

        return temp;
      }, []);

      this.driverList = res;
    },
    async getSalaryDetail(item) {
      let continueStatus = true;

      if (this.dataNotUpdate) {
        continueStatus = await this.$bvModal
          .msgBoxConfirm('有資料尚未更新，是否要繼續執行', {
            title: '訊息',
            size: 'sm',
            buttonSize: 'sm',
            okVariant: 'danger',
            okTitle: '繼續',
            cancelTitle: '取消',
            footerClass: 'p-2',
            hideHeaderClose: false,
            centered: true,
          })
          .then(value => value)
          .catch(e => console.log(e));
      }

      if (!continueStatus) return;

      const conditions = {
        year: item.year,
        month: item.month,
        emp_ID: item.emp_ID,
      };

      this.selectedEmplyee = item;

      const res = await this.$http.post(`${process.env.VUE_APP_BASE_API}/api/Compensation/GetDetailList`, conditions)
        .then(response => response.data.Resource)
        .catch(e => console.log(e));

      this.selectedItem = JSON.parse(res);
      this.originSelectedItem = JSON.parse(res);

      this.dataNotUpdate = false;
    },
    async REcalculate() {
      let continueStatus = true;

      if (this.dataNotUpdate) {
        continueStatus = await this.$bvModal
          .msgBoxConfirm('有資料尚未更新，是否要繼續執行', {
            title: '訊息',
            size: 'sm',
            buttonSize: 'sm',
            okVariant: 'danger',
            okTitle: '繼續',
            cancelTitle: '取消',
            footerClass: 'p-2',
            hideHeaderClose: false,
            centered: true,
          })
          .then(value => value)
          .catch(e => console.log(e));
      }

      if (!continueStatus) return;

      if (this.queriedData.input === null) {
        this.queriedData = this.REcalculateInput;
      }

      const res = await this.$http.post(`${process.env.VUE_APP_BASE_API}/api/salary/Compensation_Recalculate`, this.queriedData.input)
        .then(response => response.data.Resource)
        .catch(e => console.log(e));
      console.log(res);
      const GetResultApi = `${process.env.VUE_APP_BASE_API}/api/salary/Compensation_Recalculate`;
      this.$refs.QueryTool.GetResult(this.queriedData.input, GetResultApi);
      const message = `已重新計算${this.queriedData.input.year}年${this.queriedData.input.month}月薪資`;
      alert(message);
    },
    async calculate() {
      if (!this.selectedItem || this.checkEmpty()) {
        alert('尚無資料');
      }

      const trial = Object.keys(this.selectedItem).reduce((a, b) => {
        const temp = a;

        const convertProperty = this.convertTrialJSON.filter(item => item.resultName === b);

        if (convertProperty.length > 0) {
          const key = convertProperty[0].name;
          temp[`${key}`] = parseFloat(this.selectedItem[`${b}`]);
        }

        return temp;
      }, {});

      const head = {
        year: this.selectedEmplyee.year,
        month: this.selectedEmplyee.month,
        emp_ID: this.selectedEmplyee.emp_ID,
      };

      const finaltrial = [{ ...head, ...trial }];

      console.log(finaltrial);

      const condition = {
        year: this.selectedEmplyee.year,
        month: this.selectedEmplyee.month,
        emp_ID: this.selectedEmplyee.emp_ID,
        trial_json: JSON.stringify(finaltrial),
      };

      console.log(condition.trial_json);

      const res = await this.$http.post(`${process.env.VUE_APP_BASE_API}/api/Compensation/TrialCalculate`, condition)
        .then(response => response.data.Resource)
        .catch(e => console.log(e));

      // console.log(res);

      const trialResult = JSON.parse(res);

      // 解構 property一樣時後面會覆蓋前面
      const merge = { ...this.selectedItem, ...trialResult };

      this.selectedItem = merge;
    },
    async updatePayroll() {
      if (!this.selectedItem || this.checkEmpty()) {
        alert('尚無資料');
      }

      const trial = Object.keys(this.selectedItem).reduce((a, b) => {
        const temp = a;

        const convertProperty = this.convertTrialJSON.filter(item => item.resultName === b);

        if (convertProperty.length > 0) {
          const key = convertProperty[0].name;
          temp[`${key}`] = parseFloat(this.selectedItem[`${b}`]);
        }

        return temp;
      }, {});

      const head = {
        year: this.selectedEmplyee.year,
        month: this.selectedEmplyee.month,
        emp_ID: this.selectedEmplyee.emp_ID,
      };

      const finaltrial = [{ ...head, ...trial }];

      const condition = {
        year: this.selectedEmplyee.year,
        month: this.selectedEmplyee.month,
        emp_ID: this.selectedEmplyee.emp_ID,
        trial_json: JSON.stringify(finaltrial),
      };

      console.log(condition);

      const res = await this.$http.post(`${process.env.VUE_APP_BASE_API}/api/Compensation/UpsertList`, condition)
        .then(response => response.data.Resource)
        .catch(e => console.log(e));

      console.log(res);

      this.selectedItem = JSON.parse(res);
      this.originSelectedItem = JSON.parse(res);
    },
    checkDataNotUpdate(status) {
      // console.log(status);
      this.dataNotUpdate = status;
    },
    checkEmpty() {
      const $el = this.selectedItem;

      // 檢查 this.item 是否為空物件，是的話不做試算
      const isEmpty = ((obj) => {
        // eslint-disable-next-line no-restricted-syntax
        for (const key in obj) {
          if (Object.prototype.hasOwnProperty.call(obj, key)) return false;
        }

        return true;
      })($el);

      return isEmpty;
    },
  },
  beforeRouteLeave(to, from, next) {
    window.removeEventListener('resize', this.UpdateContentSize);
    next();
  },
};
</script>

<style lang="scss" scoped>
::v-deep .list-panel {
  display: flex;
  flex-direction: column;
  width: 300px;
  overflow: hidden;
  border-left: 1px solid #8e8e8e;
  border-right: 1px solid #8e8e8e;
  border-bottom: 1px solid #8e8e8e;

  .list-panel-title-bar {
    height: 40px;
  }

  &.collapse-panel {
    width: 50px;
  }

  .collapse-btn {
    width: 50px;
    height: 100%;
  }

  .query-list {
    display: flex;
    flex-direction: column;

    .query-list-display {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      width: 100%;
      height: 100%;
      border-bottom: 1px solid #cfcfcf;
      cursor: pointer;

      .text-area {
        display: flex;
        align-items: center;
        justify-content: flex-start;
        line-height: 1.2;
        padding: .75rem;
        width: 100%;
      }
    }

    .background-primary {
      background-color: #00a199;
    }
  }
}

::v-deep .view-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
  border-right: 1px solid #aaaaaa;
  border-bottom: 1px solid #aaaaaa;
}

.operate-button-set {
  position: fixed;
  right: 50px;
  margin-top: 20px;
  z-index: 999;
}
</style>
