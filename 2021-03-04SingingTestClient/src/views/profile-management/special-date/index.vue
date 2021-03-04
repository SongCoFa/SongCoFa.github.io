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
  name: 'SpecialDate',
  components: {
    QueryTool,
    BaseTable,
  },
  data() {
    return {
      AddListFormat: [
        { name: 'SpecialStartDate', defaultInput: '', isRequired: true },
        { name: 'SpecialEndDate', defaultInput: '', isRequired: true },
        { name: 'SpecialWeekday', defaultInput: '', isRequired: true },
        { name: 'SpecialRemark', defaultInput: '', isRequired: false },
      ],
      ImportListFormat: [
        {
          name: '',
          exampleValue: '2020-01-01',
          displayName: '特殊起始日期',
          key: 'special_start_date',
        },
        {
          name: '',
          exampleValue: '2020-01-01',
          displayName: '特殊結束日期',
          key: 'special_end_date',
        },
        {
          name: '',
          exampleValue: '週一',
          displayName: '設定值',
          key: 'weekday',
        },
        {
          name: '',
          exampleValue: '說明',
          displayName: '說明',
          key: 'remark',
        },
      ],
      Table: {
        fields: [
          {
            key: 'special_start_date',
            label: '特殊起始日期',
            sortable: true,
            customize: {
              editable: true,
              name: 'SpecialStartDate',
            },
          },
          {
            key: 'special_end_date',
            label: '特殊結束日期',
            sortable: true,
            customize: {
              editable: true,
              name: 'SpecialEndDate',
            },
          },
          {
            key: 'weekday',
            label: '設定值',
            sortable: true,
            customize: {
              editable: true,
              name: 'SpecialWeekday',
            },
          },
          {
            key: 'remark',
            label: '說明',
            sortable: true,
            customize: {
              editable: true,
              name: 'SpecialRemark',
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
        GetResultApi: `${process.env.VUE_APP_BASE_API}/api/special-date/GetList`,
        AddApi: `${process.env.VUE_APP_BASE_API}/api/special-date/InsertList`,
        ImportApi: `${process.env.VUE_APP_BASE_API}/api/special-date/ImportList`,
        EnabledInputList: [],
      };
    },
    BaseTableApi() {
      return {
        EditApi: `${process.env.VUE_APP_BASE_API}/api/special-date/UpsertList`,
        DeleteApi: `${process.env.VUE_APP_BASE_API}/api/special-date/DeleteList`,
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
