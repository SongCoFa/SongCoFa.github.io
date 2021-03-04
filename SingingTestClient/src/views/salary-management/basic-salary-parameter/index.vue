<template>
  <b-container ref="Content" fluid>
    <QueryTool
      v-bind="QueryToolApi"
      :writable="writable"
      @updateResult="updateResult"
      @UpdateContentSize="UpdateContentSize"
      @refreshData="refreshData"
      ref="QueryTool"
    ></QueryTool>
    <b-tabs
      nav-class="custom-tab-nav"
      active-nav-item-class="custom-tab-nav-item"
      class="mt-2"
      v-model="tabIndex"
      lazy
    >
      <b-tab title="每月固定項目">
        <TabTable
          v-bind="BaseTableApi"
          :Table="Table"
          :tabIndex="tabIndex"
          :tabItems="tabItems"
          :containerHeight="containerHeight"
          :queriedData="queriedData"
          :writable="writable"
          @refreshData="refreshData"
        >
          <template v-slot:thead-top>
            <b-tr>
              <b-th class="b-table-sticky-column" colspan="4"></b-th>
              <b-th class="text-center header-custom-bg-one" colspan="3">每月固定支付項目</b-th>
              <b-th class="text-center header-custom-bg-two" colspan="5">每月固定扣繳項目</b-th>
              <b-th class="b-table-sticky-column column-sticky-right"></b-th>
            </b-tr>
          </template>

          <template v-slot:DisplayWhichRow="slotItem">
            <span class="display-which-row px-1">({{ slotItem.data.emp_ID }}/{{ slotItem.data.emp_name }})</span>
          </template>
        </TabTable>
      </b-tab>
      <b-tab title="每月非固定項目">
        <TabTable
          v-bind="BaseTableApi"
          :Table="Table"
          :tabIndex="tabIndex"
          :tabItems="tabItems"
          :containerHeight="containerHeight"
          :queriedData="queriedData"
          :writable="writable"
          @refreshData="refreshData"
        >
          <template v-slot:thead-top>
            <b-tr>
              <b-th class="b-table-sticky-column" colspan="4"></b-th>
              <b-th class="text-center header-custom-bg-one" colspan="14">每月非固定支付項目</b-th>
              <b-th class="text-center header-custom-bg-two" colspan="8">每月非固定扣繳項目</b-th>
              <b-th class="b-table-sticky-column column-sticky-right"></b-th>
            </b-tr>
          </template>

          <template v-slot:DisplayWhichRow="slotItem">
            <span class="display-which-row px-1">({{ slotItem.data.emp_ID }}/{{ slotItem.data.emp_name }})</span>
          </template>
        </TabTable>
      </b-tab>
      <template v-slot:tabs-end>
        <li style="margin-left: auto">
          <TabImport
            :ImportListFormat="ImportListFormat"
            v-bind="BaseTableApi"
            :tabItems="tabItems"
            :writable="writable"
            @refreshData="refreshData"
          ></TabImport>
          <TabExport
            :tabItems="tabItems"
            :tabIndex="tabIndex"
            :Table="Table"
            :ImportListFormat="ImportListFormat"
          ></TabExport>
        </li>
      </template>
    </b-tabs>
  </b-container>
</template>

<script>
import QueryTool from '@/components/QueryTool/index.vue';
import TabTable from '@/components/table/TabTable.vue';
import TabExport from '@/components/table/Modals/TabExport.vue';
import TabImport from '@/components/table/Modals/TabImport.vue';

export default {
  name: 'Salary',
  components: {
    QueryTool,
    TabTable,
    TabExport,
    TabImport,
  },
  data() {
    return {
      ImportListFormat: {
        MonthlyFixedItemsFields: [
          {
            key: 'year',
            name: 'Year',
            displayName: '薪資年',
            exampleValue: `${this.$moment().format('YYYY')}`,
          },
          {
            key: 'month',
            name: 'Month',
            displayName: '薪資月',
            exampleValue: `${this.$moment().format('MM')}`,
          },
          {
            key: 'emp_name',
            name: 'Employee Name',
            displayName: '姓名',
            exampleValue: '員工姓名',
          },
          {
            key: 'basic_payment',
            name: 'Basic Payment',
            displayName: '薪俸',
            exampleValue: '20200',
          },
          {
            key: 'food_allowance',
            name: 'Food Allowance',
            displayName: '伙食津貼',
            exampleValue: '1800',
          },
          {
            key: 'pension_company',
            name: 'Pension Company',
            displayName: '退休金提撥',
            exampleValue: '0',
          },
          {
            key: 'labor_insurance_fee',
            name: 'Labor Insurance Fee',
            displayName: '勞保費',
            exampleValue: '0',
          },
          {
            key: 'health_insurance_fee',
            name: 'Health Insurance Fee',
            displayName: '健保費',
            exampleValue: '0',
          },
          {
            key: 'welfare_fee',
            name: 'Welfare Fee',
            displayName: '福利費',
            exampleValue: '0',
          },
          {
            key: 'pension_personal',
            name: 'Pension Personal',
            displayName: '勞退自提',
            exampleValue: '0',
          },
          {
            key: 'insurance_fee',
            name: 'Insurance Fee',
            displayName: '保險費',
            exampleValue: '0',
          },
        ],
        MonthlyNonFixedItemsFields: [
          {
            key: 'year',
            name: 'Year',
            displayName: '薪資年',
            exampleValue: `${this.$moment().format('YYYY')}`,
          },
          {
            key: 'month',
            name: 'Month',
            displayName: '薪資月',
            exampleValue: `${this.$moment().format('MM')}`,
          },
          {
            key: 'emp_name',
            name: 'Employee Name',
            displayName: '姓名',
            exampleValue: '員工姓名',
          },
          {
            key: 'night_allowance',
            name: 'Night Allowance',
            displayName: '夜值津貼',
            exampleValue: '0',
          },
          {
            key: 'special_allowance',
            name: 'Special Allowance',
            displayName: '特殊津貼',
            exampleValue: '0',
          },
          {
            key: 'mileage_allowance',
            name: 'Mileage Allowance',
            displayName: '里程補貼',
            exampleValue: '0',
          },
          {
            key: 'transportation_allowance',
            name: 'Transportation Allowance',
            displayName: '交通費補貼',
            exampleValue: '0',
          },
          {
            key: 'other_bonus',
            name: 'Other Bonus',
            displayName: '其他非勤務所得獎金',
            exampleValue: '0',
          },
          {
            key: 'twocars_allowance',
            name: 'Twocars Allowance',
            displayName: '1人2車保管津貼',
            exampleValue: '0',
          },
          {
            key: 'extra_shuttle_allowance',
            name: 'Extra Shuttle Allowance',
            displayName: '活動配合獎金',
            exampleValue: '0',
          },
          {
            key: 'season_bonus',
            name: 'Season Bonus',
            displayName: '季獎金',
            exampleValue: '0',
          },
          {
            key: 'year_end_bonus',
            name: 'Year End Bonus',
            displayName: '年終獎金',
            exampleValue: '0',
          },
          {
            key: 'bonus_cash',
            name: 'Bonus Cash',
            displayName: '獎金(紅包)',
            exampleValue: '0',
          },
          {
            key: 'consolation_money',
            name: 'Consolation Money',
            displayName: '慰問金',
            exampleValue: '0',
          },
          {
            key: 'tip',
            name: 'Tip',
            displayName: '小費',
            exampleValue: '0',
          },
          {
            key: 'travel_allowance',
            name: 'Travel Allowance',
            displayName: '旅費',
            exampleValue: '0',
          },
          {
            key: 'education_allowance',
            name: 'Education Allowance',
            displayName: '教育補助費',
            exampleValue: '0',
          },
          {
            key: 'loan',
            name: 'Loan',
            displayName: '暫借款',
            exampleValue: '0',
          },
          {
            key: 'income_tax',
            name: 'Income Tax',
            displayName: '薪資所得稅',
            exampleValue: '0',
          },
          {
            key: 'miscellaneous_fee',
            name: 'Miscellaneous Fee',
            displayName: '雜費',
            exampleValue: '0',
          },
          {
            key: 'supplement_fee',
            name: 'Supplement Fee',
            displayName: '補充保費',
            exampleValue: '0',
          },
          {
            key: 'withholding',
            name: 'Withholding',
            displayName: '執行命令代扣款',
            exampleValue: '0',
          },
          {
            key: 'car_damage_sharing',
            name: 'Car Damage Sharing',
            displayName: '車損協議分擔',
            exampleValue: '0',
          },
          {
            key: 'incident_sharing',
            name: 'Incident Sharing',
            displayName: '肇事和解分擔',
            exampleValue: '0',
          },
          {
            key: 'insurance_sharing',
            name: 'Insurance Sharing',
            displayName: '出險保險費協議分擔',
            exampleValue: '0',
          },
        ],
      },

      Table: {
        MonthlyFixedItemsFields: [
          {
            key: 'year',
            label: '薪資年',
            sortable: true,
            stickyColumn: true,
            thClass: 'adjust-th-year-column',
            tdClass: 'adjust-td-year-column',
            customize: {
              editable: false,
              name: '',
            },
          },
          {
            key: 'month',
            label: '薪資月',
            sortable: true,
            stickyColumn: true,
            thClass: 'adjust-th-month-column',
            tdClass: 'adjust-td-month-column',
            customize: {
              editable: false,
              name: '',
            },
          },
          {
            key: 'emp_ID',
            label: '駕駛編號',
            sortable: true,
            stickyColumn: true,
            thClass: 'adjust-th-empID-column',
            tdClass: 'adjust-td-empID-column',
            customize: {
              editable: false,
              name: '',
            },
          },
          {
            key: 'emp_name',
            label: '駕駛姓名',
            sortable: true,
            stickyColumn: true,
            thClass: 'adjust-th-empname-column',
            tdClass: 'adjust-td-empname-column',
            customize: {
              editable: false,
              name: '',
            },
          },
          {
            key: 'basic_payment',
            label: '薪俸',
            sortable: true,
            customize: {
              editable: true,
              name: 'BasicPayment',
            },
          },
          {
            key: 'food_allowance',
            label: '伙食津貼',
            sortable: true,
            customize: {
              editable: true,
              name: 'FoodAllowance',
            },
          },
          {
            key: 'pension_company',
            label: '退休金提撥',
            sortable: true,
            customize: {
              editable: true,
              name: 'PensionCompany',
            },
          },
          {
            key: 'labor_insurance_fee',
            label: '勞保費',
            sortable: true,
            customize: {
              editable: true,
              name: 'LaborInsuranceFee',
            },
          },
          {
            key: 'health_insurance_fee',
            label: '健保費',
            sortable: true,
            customize: {
              editable: true,
              name: 'HealthInsuranceFee',
            },
          },
          {
            key: 'welfare_fee',
            label: '福利費',
            sortable: true,
            customize: {
              editable: true,
              name: 'WelfareFee',
            },
          },
          {
            key: 'pension_personal',
            label: '勞退自提',
            sortable: true,
            customize: {
              editable: true,
              name: 'PensionPersonal',
            },
          },
          {
            key: 'insurance_fee',
            label: '保險費',
            sortable: true,
            customize: {
              editable: true,
              name: 'InsuranceFee',
            },
          },
        ],
        MonthlyNonFixedItemsFields: [
          {
            key: 'year',
            label: '薪資年',
            sortable: true,
            stickyColumn: true,
            thClass: 'adjust-th-year-column',
            tdClass: 'adjust-td-year-column',
            customize: {
              editable: false,
              name: '',
            },
          },
          {
            key: 'month',
            label: '薪資月',
            sortable: true,
            stickyColumn: true,
            thClass: 'adjust-th-month-column',
            tdClass: 'adjust-td-month-column',
            customize: {
              editable: false,
              name: '',
            },
          },
          {
            key: 'emp_ID',
            label: '駕駛編號',
            sortable: true,
            stickyColumn: true,
            thClass: 'adjust-th-empID-column',
            tdClass: 'adjust-td-empID-column',
            customize: {
              editable: false,
              name: '',
            },
          },
          {
            key: 'emp_name',
            label: '駕駛姓名',
            sortable: true,
            stickyColumn: true,
            thClass: 'adjust-th-empname-column',
            tdClass: 'adjust-td-empname-column',
            customize: {
              editable: false,
              name: '',
            },
          },
          {
            key: 'night_allowance',
            label: '夜值津貼',
            sortable: true,
            customize: {
              editable: true,
              name: 'NightAllowance',
            },
          },
          {
            key: 'special_allowance',
            label: '特殊津貼',
            sortable: true,
            customize: {
              editable: true,
              name: 'SpecialAllowance',
            },
          },
          {
            key: 'mileage_allowance',
            label: '里程補貼',
            sortable: true,
            customize: {
              editable: true,
              name: 'MileageAllowance',
            },
          },
          {
            key: 'transportation_allowance',
            label: '交通費補貼',
            sortable: true,
            customize: {
              editable: true,
              name: 'TransportationAllowance',
            },
          },
          {
            key: 'other_bonus',
            label: '其他非勤務所得獎金',
            sortable: true,
            customize: {
              editable: true,
              name: 'OtherBonus',
            },
          },
          {
            key: 'twocars_allowance',
            label: '1人2車保管津貼',
            sortable: true,
            customize: {
              editable: true,
              name: 'TwocarsAllowance',
            },
          },
          {
            key: 'extra_shuttle_allowance',
            label: '活動配合獎金',
            sortable: true,
            customize: {
              editable: true,
              name: 'ExtraShuttleAllowance',
            },
          },
          {
            key: 'season_bonus',
            label: '季獎金',
            sortable: true,
            customize: {
              editable: true,
              name: 'SeasonBonus',
            },
          },
          {
            key: 'year_end_bonus',
            label: '年終獎金',
            sortable: true,
            customize: {
              editable: true,
              name: 'YearEndBonus',
            },
          },
          {
            key: 'bonus_cash',
            label: '獎金(紅包)',
            sortable: true,
            customize: {
              editable: true,
              name: 'BonusCash',
            },
          },
          {
            key: 'consolation_money',
            label: '慰問金',
            sortable: true,
            customize: {
              editable: true,
              name: 'ConsolationMoney',
            },
          },
          {
            key: 'tip',
            label: '小費',
            sortable: true,
            customize: {
              editable: true,
              name: 'Tip',
            },
          },
          {
            key: 'travel_allowance',
            label: '旅費',
            sortable: true,
            customize: {
              editable: true,
              name: 'TravelAllowance',
            },
          },
          {
            key: 'education_allowance',
            label: '教育補助費',
            sortable: true,
            customize: {
              editable: true,
              name: 'EducationAllowance',
            },
          },
          {
            key: 'loan',
            label: '暫借款',
            sortable: true,
            customize: {
              editable: true,
              name: 'Loan',
            },
          },
          {
            key: 'income_tax',
            label: '薪資所得稅',
            sortable: true,
            customize: {
              editable: true,
              name: 'IncomeTax',
            },
          },
          {
            key: 'miscellaneous_fee',
            label: '雜費',
            sortable: true,
            customize: {
              editable: true,
              name: 'MiscellaneousFee',
            },
          },
          {
            key: 'supplement_fee',
            label: '補充保費',
            sortable: true,
            customize: {
              editable: true,
              name: 'SupplementFee',
            },
          },
          {
            key: 'withholding',
            label: '執行命令代扣款',
            sortable: true,
            customize: {
              editable: true,
              name: 'Withholding',
            },
          },
          {
            key: 'car_damage_sharing',
            label: '車損協議分擔',
            sortable: true,
            customize: {
              editable: true,
              name: 'CarDamageSharing',
            },
          },
          {
            key: 'incident_sharing',
            label: '肇事和解分擔',
            sortable: true,
            customize: {
              editable: true,
              name: 'IncidentSharing',
            },
          },
          {
            key: 'insurance_sharing',
            label: '出險保險費協議分擔',
            sortable: true,
            customize: {
              editable: true,
              name: 'InsuranceSharing',
            },
          },
        ],
        items: [],
      },

      tabIndex: 0,

      // 順序必須跟 tabIndex 對應，值必須跟 Table、ImportListFormat 對應
      tabItems: [
        {
          name: 'MonthlyFixedItemsFields',
          display: '每月固定項目',
        },
        {
          name: 'MonthlyNonFixedItemsFields',
          display: '每月非固定項目',
        },
      ],

      queriedData: {
        input: null,
        time: null,
      },

      containerHeight: 0,
    };
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
    BaseTableApi() {
      return {
        EditApi: `${process.env.VUE_APP_BASE_API}/api/salary/UpsertList`,
        ImportApi: `${process.env.VUE_APP_BASE_API}/api/salary/UpsertList`,
        DeleteApi: null,
      };
    },
    writable() {
      return this.$store.getters.permissions.salary_permission === 'W';
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
      const queryAreaHeight = this.$refs.QueryTool.$refs.QueryToolArea.clientHeight;
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
  },
  beforeRouteLeave(to, from, next) {
    window.removeEventListener('resize', this.UpdateContentSize);
    next();
  },
};
</script>

<style lang="scss" scoped>
::v-deep .container-border {
  border: 1px solid #aaaaaa;
}

::v-deep .custom-tab-nav {
  .nav-item {
    .nav-link {
      color: #ffffff;
      background: #a0a0a0;
      border-color: #dee2e6 #dee2e6 #fff;

      &.active {
        color: #ffffff;
        background: #d4721f;
        border: 1px solid transparent;
      }
    }
  }
}

.header-custom-bg-one {
  background-color: #64788C !important;
}

.header-custom-bg-two {
  background-color: #80868C !important;
}

.column-sticky-right {
  position: sticky;
  top: 0;
  z-index: 2;
}
</style>
