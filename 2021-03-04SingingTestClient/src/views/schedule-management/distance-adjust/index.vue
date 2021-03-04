<template>
  <b-container ref="Content" fluid>
    <QueryTool
      v-bind="QueryToolApi"
      :dataNotUpdate="dataNotUpdate"
      :writable="writable"
      @updateResult="updateResult"
      @UpdateContentSize="UpdateContentSize"
      @refreshData="refreshData"
      @BusyStatus="BusyStatus"
      ref="QueryTool"
    >
      <template v-slot:importValueByDate>
        <ImportValueByDate v-bind="QueryToolApi" :Table="Table" :dataNotUpdate="dataNotUpdate" :writable="writable" @refreshData="refreshData"></ImportValueByDate>
      </template>
    </QueryTool>
    <InputTable
      v-if="Table.items.length"
      v-bind="BaseTableApi"
      :Table="Table"
      :containerHeight="containerHeight"
      :queriedData="queriedData"
      :busyState="busyState"
      :writable="writable"
      @refreshData="refreshData"
      @checkDataNotUpdate="checkDataNotUpdate"
      ref="Table"
    >
    </InputTable>
  </b-container>
</template>

<script>
import QueryTool from '@/components/QueryTool/index.vue';
import InputTable from '@/components/table/InputByDayTable.vue';
import ImportValueByDate from '@/components/table/Modals/ImportValueByDate.vue';

export default {
  name: 'DistanceAdjust',
  components: {
    QueryTool,
    InputTable,
    ImportValueByDate,
  },
  data() {
    return {
      Table: {
        editable: 'distance',
        fields: [
          {
            key: 'emp_ID',
            label: '駕駛編號',
            stickyColumn: true,
            thClass: 'adjust-th-id-column',
            tdClass: 'adjust-td-id-column',
          },
          {
            key: 'emp_name',
            label: '駕駛姓名',
            stickyColumn: true,
            thClass: 'adjust-th-name-column',
            tdClass: 'adjust-td-name-column',
          },
        ],
        fieldsAtLast: [
          {
            key: 'total',
            label: '合計里程',
          },
        ],
        items: [],
      },

      queriedData: {
        input: null,
        time: null,
      },

      containerHeight: 0,

      busyState: false,

      dataNotUpdate: false,
    };
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
        GetResultApi: `${process.env.VUE_APP_BASE_API}/api/empty-run/GetList`,
        AddApi: null,
        ImportApi: `${process.env.VUE_APP_BASE_API}/api/empty-run/UpsertList`,
        EnabledInputList: [
          { name: 'Year', defaultInput: this.$moment().add(-1, 'months').format('YYYY') },
          { name: 'Month', defaultInput: this.$moment().add(-1, 'months').format('MM') },
          { name: 'EmployeeIDName', defaultInput: null },
          { name: 'Department', defaultInput: null },
        ],
      };
    },
    BaseTableApi() {
      return {
        EditApi: `${process.env.VUE_APP_BASE_API}/api/empty-run/UpsertList`,
        DeleteApi: null,
      };
    },
    writable() {
      return this.$store.getters.permissions.schedule_permission === 'W';
    },
  },
  methods: {
    BusyStatus(status) {
      this.busyState = status;
    },
    UpdateContentSize() {
      const totalHeight = this.$refs.Content.clientHeight;
      const queryAreaHeight = this.$refs.QueryTool.$refs.QueryToolArea.clientHeight;
      this.containerHeight = totalHeight - queryAreaHeight;
    },
    async updateResult(result, queriedInput, time) {
      this.dataNotUpdate = false;
      this.Table.items = result;
      this.queriedData.input = queriedInput;
      this.queriedData.time = time;
    },
    refreshData() {
      this.dataNotUpdate = false;
      this.$refs.QueryTool.GetResult(this.queriedData.input);
    },
    checkDataNotUpdate(status) {
      // 在變更畫面前檢查是否有資料尚未更新
      this.dataNotUpdate = status;
    },
  },
  beforeRouteLeave(to, from, next) {
    window.removeEventListener('resize', this.UpdateContentSize);
    next();
  },
};
</script>
