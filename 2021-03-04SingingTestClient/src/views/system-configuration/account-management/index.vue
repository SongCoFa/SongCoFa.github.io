<template>
  <b-container ref="Content" fluid>
    <QueryTool
      v-bind="QueryToolApi"
      :AddListFormat="AddListFormat"
      :writable="writable"
      @updateResult="updateResult"
      @UpdateContentSize="UpdateContentSize"
      @refreshData="refreshData"
      ref="QueryTool"
    />
    <BaseTable
      v-if="Table.items.length"
      v-bind="BaseTableApi"
      :Table="Table"
      :containerHeight="containerHeight"
      :queriedData="queriedData"
      :writable="writable"
      @refreshData="refreshData"
    >
      <template v-slot:DisplayWhichRow="slotItem">
        <span class="display-which-row px-1">({{ slotItem.data.emp_ID }}/{{ slotItem.data.emp_name }})</span>
      </template>
    </BaseTable>
  </b-container>
</template>

<script>
import QueryTool from '@/components/QueryTool/index.vue';
import BaseTable from '@/components/table/BaseTable.vue';

export default {
  name: 'AccountManagement',
  components: {
    QueryTool,
    BaseTable,
  },
  data() {
    return {
      AddListFormat: [
        { name: 'EmployeeNumber', defaultInput: '', isRequired: true },
        { name: 'EmployeeName', defaultInput: '', isRequired: true },
        { name: 'TitleInAccount', defaultInput: '', isRequired: true },
        { name: 'DepartmentWithoutDriver', defaultInput: '', isRequired: true },
        { name: 'StationNumber', defaultInput: '', isRequired: false },
        { name: 'ActivateDate', defaultInput: '', isRequired: true },
        { name: 'Mobile', defaultInput: '', isRequired: false },
        { name: 'Birthday', defaultInput: '', isRequired: false },
      ],

      Table: {
        fields: [
          {
            key: 'emp_ID',
            label: '員工編號',
            sortable: true,
            customize: {
              editable: false,
              name: 'EmployeeNumber',
            },
          },
          {
            key: 'emp_name',
            label: '員工姓名',
            sortable: true,
            customize: {
              editable: true,
              name: 'EmployeeName',
            },
          },
          {
            key: 'title',
            label: '職稱',
            sortable: true,
            customize: {
              editable: true,
              name: 'TitleInAccount',
            },
          },
          {
            key: 'dept',
            label: '部門',
            sortable: true,
            customize: {
              editable: true,
              name: 'DepartmentWithoutDriver',
            },
          },
          {
            key: 'station_no',
            label: '所屬站',
            sortable: true,
            customize: {
              editable: true,
              name: 'StationNumber',
            },
          },
          {
            key: 'activate_date',
            label: '到職日',
            sortable: true,
            customize: {
              editable: true,
              name: 'ActivateDate',
            },
          },
          {
            key: 'mobile',
            label: '手機',
            sortable: true,
            customize: {
              editable: true,
              name: 'Mobile',
            },
          },
          {
            key: 'profile_permission',
            label: '基本資料管理權限',
            sortable: true,
            customize: {
              editable: true,
              name: 'ProfilePermission',
            },
          },
          {
            key: 'schedule_permission',
            label: '排班管理權限',
            sortable: true,
            customize: {
              editable: true,
              name: 'SchedulePermission',
            },
          },
          {
            key: 'salary_permission',
            label: '薪資管理權限',
            sortable: true,
            customize: {
              editable: true,
              name: 'SalaryPermission',
            },
          },
        ],
        items: [],
      },

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
        GetResultApi: `${process.env.VUE_APP_BASE_API}/api/acount-management/GetList`,
        AddApi: `${process.env.VUE_APP_BASE_API}/api/acount-management/AddUser`,
        ImportApi: '',
        EnabledInputList: [
          { name: 'EmployeeNumber', defaultInput: null },
          { name: 'EmployeeName', defaultInput: null },
          { name: 'DepartmentWithoutDriver', defaultInput: null },
        ],
      };
    },
    BaseTableApi() {
      return {
        EditApi: `${process.env.VUE_APP_BASE_API}/api/acount-management/EditUser`,
        DeleteApi: `${process.env.VUE_APP_BASE_API}/api/acount-management/DeleteUser`,
        ResetPasswordApi: `${process.env.VUE_APP_BASE_API}/api/acount-management/ResetPassword`,
      };
    },
    writable() {
      return this.$store.getters.permissions.emp_ID === 'admin' && this.$store.getters.permissions.title === '系統管理者';
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
  },
  beforeRouteLeave(to, from, next) {
    window.removeEventListener('resize', this.UpdateContentSize);
    next();
  },
};
</script>
