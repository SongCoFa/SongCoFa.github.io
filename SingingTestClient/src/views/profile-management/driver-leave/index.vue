<template>
  <b-container ref="Content" fluid>
    <QueryTool
      v-bind="QueryToolApi"
      :AddListFormat="AddListFormat"
      :ImportListFormat="ImportListFormat"
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
    />
  </b-container>
</template>

<script>
import QueryTool from '@/components/QueryTool/index.vue';
import BaseTable from '@/components/table/BaseTable.vue';

export default {
  name: 'DriverLeave',
  components: {
    QueryTool,
    BaseTable,
  },
  data() {
    return {
      AddListFormat: [
        { name: 'LeaveStartDate', defaultInput: this.$moment.utc((new Date()).setDate((new Date()).getDate())).format('YYYY-MM-DD'), isRequired: true },
        { name: 'LeaveEndDate', defaultInput: this.$moment.utc((new Date()).setDate((new Date()).getDate() + 1)).format('YYYY-MM-DD'), isRequired: true },
        { name: 'LeaveEmployee', defaultInput: '', isRequired: true },
        { name: 'LeaveType', defaultInput: '', isRequired: true },
        { name: 'LeaveDays', defaultInput: '', isRequired: true },
      ],
      ImportListFormat: [
        {
          name: 'LeaveEmployee',
          exampleValue: '陳繼發',
          displayName: '員工姓名',
          key: 'emp_name',
        },
        {
          name: 'LeaveStartDate',
          exampleValue: '2019/11/3',
          displayName: '休假起始日期',
          key: 'leave_start_date',
        },
        {
          name: 'LeaveEndDate',
          exampleValue: '2019/11/4',
          displayName: '休假結束日期',
          key: 'leave_end_date',
        },
        {
          name: 'LeaveType',
          exampleValue: '事假',
          displayName: '假別',
          key: 'leave_type',
        },
        {
          name: 'LeaveDays',
          exampleValue: '0.5',
          displayName: '休假日數',
          key: 'leave_days',
        },
      ],

      Table: {
        fields: [
          {
            key: 'emp_name',
            label: '員工姓名',
            sortable: true,
            customize: {
              editable: false,
              name: 'EmployeeName',
            },
          },
          {
            key: 'leave_start_date',
            label: '休假起始日期',
            sortable: true,
            customize: {
              editable: true,
              name: 'LeaveStartDate',
            },
          },
          {
            key: 'leave_end_date',
            label: '休假結束日期',
            sortable: true,
            customize: {
              editable: true,
              name: 'LeaveEndDate',
            },
          },
          {
            key: 'leave_type',
            label: '假別',
            sortable: true,
            customize: {
              editable: true,
              name: 'LeaveType',
            },
          },
          {
            key: 'leave_days',
            label: '休假日數',
            sortable: true,
            customize: {
              editable: true,
              name: 'LeaveDays',
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
        GetResultApi: `${process.env.VUE_APP_BASE_API}/api/leave/GetList`,
        AddApi: `${process.env.VUE_APP_BASE_API}/api/leave/UpsertList`,
        ImportApi: `${process.env.VUE_APP_BASE_API}/api/leave/ImportList`,
        EnabledInputList: [
          { name: 'LeaveStartDate', defaultInput: this.$moment.utc((new Date()).setDate((new Date()).getDate())).format('YYYY-MM-DD') },
          { name: 'LeaveEndDate', defaultInput: '' },
          { name: 'EmployeeNameID', defaultInput: null },
          { name: 'LeaveType', defaultInput: null },
        ],
      };
    },
    BaseTableApi() {
      return {
        EditApi: `${process.env.VUE_APP_BASE_API}/api/leave/UpsertList`,
        DeleteApi: `${process.env.VUE_APP_BASE_API}/api/leave/DeleteList`,
      };
    },
    writable() {
      return this.$store.getters.permissions.profile_permission === 'W';
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

<style lang="scss" scoped>
::v-deep .container-border {
  border: 1px solid #aaaaaa;
}
</style>
