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
  name: 'NationalHoliday',
  components: {
    QueryTool,
    BaseTable,
  },
  data() {
    return {
      AddListFormat: [
        { name: 'HolidayName', defaultInput: '', isRequired: true },
        { name: 'HolidayStartDate', defaultInput: this.$moment.utc((new Date()).setDate((new Date()).getDate() + 1)).format('YYYY-MM-DD'), isRequired: false },
        { name: 'HolidayEndDate', defaultInput: this.$moment.utc((new Date()).setDate((new Date()).getDate() + 1)).format('YYYY-MM-DD'), isRequired: false },
      ],
      ImportListFormat: [
        {
          name: 'HolidayName',
          exampleValue: '元旦',
          displayName: '名稱',
          key: 'name',
        },
        {
          name: 'HolidayStartDate',
          exampleValue: '2020/1/1',
          displayName: '起始日期',
          key: 'start_date',
        },
        {
          name: 'HolidayEndDate',
          exampleValue: '2020/1/2',
          displayName: '結束日期',
          key: 'end_date',
        },
      ],
      Table: {
        fields: [
          {
            key: 'name',
            label: '名稱',
            sortable: true,
            customize: {
              editable: true,
              name: 'HolidayName',
            },
          },
          {
            key: 'start_date',
            label: '起始日期',
            sortable: true,
            customize: {
              editable: true,
              name: 'HolidayStartDate',
            },
          },
          {
            key: 'end_date',
            label: '結束日期',
            sortable: true,
            customize: {
              editable: true,
              name: 'HolidayEndDate',
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
        GetResultApi: `${process.env.VUE_APP_BASE_API}/api/national-holiday/GetList`,
        AddApi: `${process.env.VUE_APP_BASE_API}/api/national-holiday/ImportList`,
        ImportApi: `${process.env.VUE_APP_BASE_API}/api/national-holiday/ImportList`,
        EnabledInputList: [],
      };
    },
    BaseTableApi() {
      return {
        EditApi: `${process.env.VUE_APP_BASE_API}/api/national-holiday/UpsertList`,
        DeleteApi: `${process.env.VUE_APP_BASE_API}/api/national-holiday/DeleteList`,
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

      this.refreshData();
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
