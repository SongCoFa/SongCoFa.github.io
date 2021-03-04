<template>
  <b-container ref="Content" fluid>
    <div class="driverExpireCheckbox">
      <input type="checkbox" v-model="getExpireList" @click="GetExpireList"/>
      離職人員
    </div>
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
      v-if="Table.items.length && !getExpireList"
      v-bind="BaseTableApi"
      :Table="Table"
      :containerHeight="containerHeight"
      :queriedData="queriedData"
      :writable="writable"
      @refreshData="refreshData"
    >
      <template v-slot:DisplayWhichRow="slotItem">
        <span
          class="display-which-row px-1"
        >({{ slotItem.data.emp_ID }}/{{ slotItem.data.emp_name }})</span>
      </template>
    </BaseTable>

    <!-- ---離職員工--- -->
    <BaseTableExpire
      v-if="Table.items.length && getExpireList"
      v-bind="BaseTableApi"
      :Table="Table"
      :containerHeight="containerHeight"
      :queriedData="queriedData"
      :writable="writable"
      @refreshData="refreshData"
    >
      <template v-slot:DisplayWhichRow="slotItem">
        <span
          class="display-which-row px-1"
        >({{ slotItem.data.emp_ID }}/{{ slotItem.data.emp_name }})</span>
      </template>
    </BaseTableExpire>
  </b-container>
</template>

<script>
import QueryTool from '@/components/QueryTool/index.vue';
import BaseTable from '@/components/table/BaseTable.vue';
import BaseTableExpire from '@/components/table/BaseTableExpire.vue';

export default {
  name: 'Driver',
  components: {
    QueryTool,
    BaseTable,
    BaseTableExpire,
  },
  data() {
    return {
      AddListFormat: [
        { name: 'EmployeeNumber', defaultInput: '', isRequired: true },
        { name: 'EmployeeName', defaultInput: '', isRequired: true },
        { name: 'Title', defaultInput: '駕駛長', isRequired: true },
        { name: 'Department', defaultInput: '', isRequired: true },
        { name: 'StationNumber', defaultInput: '', isRequired: false },
        { name: 'ActivateDate', defaultInput: '', isRequired: true },
        { name: 'Mobile', defaultInput: '', isRequired: false },
        { name: 'Birthday', defaultInput: '', isRequired: false },
        { name: 'AnnualLeave', defaultInput: 0, isRequired: true },
      ],
      ImportListFormat: [
        {
          name: 'EmployeeNumber',
          exampleValue: '15007',
          displayName: '員工編號',
          key: 'emp_ID',
        },
        {
          name: 'EmployeeName',
          exampleValue: '零零七',
          displayName: '員工姓名',
          key: 'emp_name',
        },
        {
          name: 'Title',
          exampleValue: '駕駛長',
          displayName: '職稱',
          key: 'title',
        },
        {
          name: 'Department',
          exampleValue: '契約',
          displayName: '部門',
          key: 'dept',
        },
        {
          name: 'StationNumber',
          exampleValue: '永康站',
          displayName: '所屬站',
          key: 'station_no',
        },
        {
          name: 'ActivateDate',
          exampleValue: '2017-01-01',
          displayName: '到職日',
          key: 'activate_date',
        },
        {
          name: 'Mobile',
          exampleValue: '0987654321',
          displayName: '手機',
          key: 'mobile',
        },
        {
          name: 'Birthday',
          exampleValue: '1977-01-01',
          displayName: '生日',
          key: 'birthday',
        },
        {
          name: 'AnnualLeave',
          exampleValue: '10',
          displayName: '特休日數',
          key: 'annual_leave',
        },
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
              name: 'Title',
            },
          },
          {
            key: 'dept',
            label: '部門',
            sortable: true,
            customize: {
              editable: true,
              name: 'Department',
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
            key: 'birthday',
            label: '生日',
            sortable: true,
            customize: {
              editable: true,
              name: 'Birthday',
            },
          },
          {
            key: 'annual_leave',
            label: '特休日數',
            sortable: true,
            customize: {
              editable: true,
              name: 'AnnualLeave',
            },
          },
        ],
        items: [],
        ResignationItems: [],
      },

      queriedData: {
        input: null,
        time: null,
      },

      getExpireList: false,
      Expire: 1,
      containerHeight: 0,

    };
  },
  computed: {
    QueryToolApi() {
      return {
        GetResultApi: `${process.env.VUE_APP_BASE_API}/api/driver/GetList`,
        AddApi: `${process.env.VUE_APP_BASE_API}/api/driver/UpsertList`,
        ImportApi: `${process.env.VUE_APP_BASE_API}/api/driver/ImportList`,
        EnabledInputList: [
          { name: 'EmployeeName', defaultInput: null },
          { name: 'EmployeeNumber', defaultInput: null },
          { name: 'Department', defaultInput: null },
        ],
        expired: this.Expire,
      };
    },
    BaseTableApi() {
      return {
        EditApi: `${process.env.VUE_APP_BASE_API}/api/driver/UpsertList`,
        DeleteApi: `${process.env.VUE_APP_BASE_API}/api/driver/DeleteList`,
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
    GetExpireList() {
      if (this.Expire === 2) {
        this.Expire = 1;
      } else if (this.Expire === 1) {
        this.Expire = 2;
      }
      this.Table.items = [];
      // this.$refs.QueryTool.$refs.searchBTN.click();
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

.driverExpireCheckbox{
  position: absolute;
  right: 180px;

  z-index: 100;
  margin-top: 7px;
}
</style>
