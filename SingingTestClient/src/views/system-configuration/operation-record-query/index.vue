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
  name: 'OperationRecord',
  components: {
    QueryTool,
    BaseTable,
  },
  data() {
    return {
      AddListFormat: null,
      ImportListFormat: null,

      Table: {
        fields: [
          {
            key: 'SQL_Date',
            label: '操作日期',
            sortable: true,
            customize: {
              editable: false,
              name: '',
            },
            formatter: value => (value ? this.$moment(value).format('YYYY-MM-DD HH:mm:ss') : '-'),
          },
          {
            key: 'emp_ID',
            label: '員工編號',
            sortable: true,
            customize: {
              editable: false,
              name: '',
            },
          },
          {
            key: 'emp_name',
            label: '員工姓名',
            sortable: true,
            customize: {
              editable: false,
              name: '',
            },
          },
          {
            key: 'item',
            label: '操作功能項目',
            sortable: true,
            customize: {
              editable: false,
              name: '',
            },
          },
          {
            key: 'content',
            label: '功能參數',
            sortable: true,
            customize: {
              editable: false,
              name: 'item',
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
        GetResultApi: `${process.env.VUE_APP_BASE_API}/api/operation-log/GetList`,
        AddApi: '',
        ImportApi: '',
        EnabledInputList: [
          { name: 'StartDate', defaultInput: this.$moment().format('YYYY-MM-DD') },
          { name: 'EndDate', defaultInput: this.$moment().add(1, 'days').format('YYYY-MM-DD') },
          { name: 'AccountSelection', defaultInput: null },
          { name: 'OperationFunctions', defaultInput: null },
        ],
      };
    },
    BaseTableApi() {
      return {
        EditApi: null,
        DeleteApi: null,
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

<style lang="scss" scoped>
::v-deep .container-border {
  border: 1px solid #aaaaaa;
}
</style>
