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
    >
      <template v-slot:DisplayWhichRow="slotItem">
        <span class="display-which-row px-1">({{ slotItem.data.DisplayRouteID }}/{{ slotItem.data.Direction === 'false' ? '去程': slotItem.data.Direction === 'true' ? '返程':'-' }})</span>
      </template>
    </BaseTable>
  </b-container>
</template>

<script>
import QueryTool from '@/components/QueryTool/index.vue';
import BaseTable from '@/components/table/BaseTable.vue';

export default {
  name: 'Route',
  components: {
    QueryTool,
    BaseTable,
  },
  data() {
    return {
      AddListFormat: [
        {
          name: 'RouteName', defaultInput: '', isRequired: true,
        },
        {
          name: 'RouteNumber', defaultInput: '', isRequired: true,
        },
        {
          name: 'RouteDirection', defaultInput: '', isRequired: true,
        },
        {
          name: 'DepartureStopNameZh', defaultInput: '', isRequired: true,
        },
        {
          name: 'DestinationStopNameZh', defaultInput: '', isRequired: true,
        },
        {
          name: 'Distance', defaultInput: '', isRequired: true,
        },
        {
          name: 'IntermediateStations', defaultInput: '', isRequired: false,
        },
        {
          name: 'RoutePrefix', defaultInput: '', isRequired: true,
        },
      ],
      ImportListFormat: [
        {
          name: 'RouteName',
          exampleValue: '測試路線1',
          displayName: '路線名稱',
          key: 'RouteName',
        },
        {
          name: 'RouteID',
          exampleValue: '99991',
          displayName: '路線編號',
          key: 'RouteID',
        },
        {
          name: 'RoutePrefix',
          exampleValue: '市公車',
          displayName: '路線種類',
          key: 'RoutePrefix',
        },
        {
          name: 'Direction',
          exampleValue: '0',
          displayName: '方向',
          key: 'Direction',
        },
        {
          name: 'DepartureStopNameZh',
          exampleValue: '新營',
          displayName: '起站',
          key: 'DepartureStopNameZh',
        },
        {
          name: 'DestinationStopNameZh',
          exampleValue: '朴子',
          displayName: '迄站',
          key: 'DestinationStopNameZh',
        },
        {
          name: 'distance',
          exampleValue: '30.4',
          displayName: '距離(公里數)',
          key: 'distance',
        },
        {
          name: 'intermediate_stations',
          exampleValue: '["鹽水", "義竹", "東後寮"]',
          displayName: '["中間站_1", "中間站_2", "中間站_3", "中間站_4", "中間站_5", "中間站_6", "中間站_7", "中間站_8", "中間站_9", "中間站_10", "中間站_11", "中間站_12"]',
          key: 'intermediate_stations',
        },
      ],
      Table: {
        fields: [
          {
            key: 'SubRouteName',
            label: '路線名稱',
            sortable: true,
            customize: {
              editable: true,
              name: 'SubRouteName',
              editSeq: 0,
            },
          },
          {
            key: 'DisplayRouteID',
            label: '路線編號',
            sortable: true,
            customize: {
              editable: false,
              name: 'DisplayRouteID',
              editSeq: 1,
            },
          },
          {
            key: 'RoutePrefix',
            label: '路線種類',
            sortable: true,
            customize: {
              editable: false,
              name: 'RoutePrefix',
              editSeq: 2,
            },
          },
          {
            key: 'Direction',
            label: '方向',
            sortable: true,
            customize: {
              editable: false,
              name: 'RouteDirection',
              editSeq: 3,
            },
          },
          {
            key: 'DepartureStopNameZh',
            label: '起站',
            sortable: true,
            customize: {
              editable: true,
              name: 'DepartureStopNameZh',
              editSeq: 4,
            },
          },
          {
            key: 'DestinationStopNameZh',
            label: '迄站',
            sortable: true,
            customize: {
              editable: true,
              name: 'DestinationStopNameZh',
              editSeq: 5,
            },
          },
          {
            key: 'distance',
            label: '距離(公里數)',
            sortable: true,
            customize: {
              editable: true,
              name: 'Distance',
              editSeq: 6,
            },
          },
          {
            key: 'intermediate_stations',
            label: '中間站',
            sortable: true,
            customize: {
              editable: true,
              name: 'IntermediateStations',
              editSeq: 10,
            },
          },
          {
            key: 'special_start_date',
            label: '特殊設定生效日',
            sortable: true,
            customize: {
              editable: true,
              name: 'SpecialStartDate',
              editSeq: 7,
              exportable: false,
            },
          },
          {
            key: 'special_end_date',
            label: '特殊設定失效日',
            sortable: true,
            customize: {
              editable: true,
              name: 'SpecialEndDate',
              editSeq: 8,
              exportable: false,
            },
          },
          {
            key: 'distance_special',
            label: '特殊里程數',
            sortable: true,
            customize: {
              editable: true,
              name: 'DistanceSpecial',
              editSeq: 9,
              exportable: false,
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
        GetResultApi: `${process.env.VUE_APP_BASE_API}/api/route/GetList`,
        AddApi: `${process.env.VUE_APP_BASE_API}/api/route/ImportList`,
        ImportApi: `${process.env.VUE_APP_BASE_API}/api/route/ImportList`,
        EnabledInputList: [
          { name: 'SubRouteName', defaultInput: null },
          { name: 'RouteNumber', defaultInput: null },
          { name: 'RouteDirection', defaultInput: null },
        ],
      };
    },
    BaseTableApi() {
      return {
        EditApi: `${process.env.VUE_APP_BASE_API}/api/route/UpsertList`,
        DeleteApi: `${process.env.VUE_APP_BASE_API}/api/route/DeleteList`,
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
