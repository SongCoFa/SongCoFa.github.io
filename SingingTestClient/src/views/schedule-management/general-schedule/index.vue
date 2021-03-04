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
    >
    </QueryTool>
    <BaseTable
      v-if="Table.items.length"
      v-bind="BaseTableApi"
      :Table="Table"
      :containerHeight="containerHeight"
      :queriedData="queriedData"
      :writable="writable"
      @refreshData="refreshData"
    >
    </BaseTable>
  </b-container>
</template>

<script>
import QueryTool from '@/components/QueryTool/index.vue';
import BaseTable from '@/components/table/BaseTable.vue';

export default {
  name: 'GeneralSchedule',
  components: {
    QueryTool,
    BaseTable,
  },
  data() {
    return {
      AddListFormat: [
        { name: 'TripRoute', defaultInput: '', isRequired: true },
        { name: 'DepartureTime', defaultInput: '', isRequired: true },
        { name: 'IsMonday', defaultInput: 'true', isRequired: false },
        { name: 'IsTuesday', defaultInput: 'true', isRequired: false },
        { name: 'IsWednesday', defaultInput: 'true', isRequired: false },
        { name: 'IsThursday', defaultInput: 'true', isRequired: false },
        { name: 'IsFriday', defaultInput: 'true', isRequired: false },
        { name: 'IsSaturday', defaultInput: 'true', isRequired: false },
        { name: 'IsSunday', defaultInput: 'true', isRequired: false },
        { name: 'TripActiveDate', defaultInput: '2019-01-01', isRequired: false },
        { name: 'TripExpireDate', defaultInput: '2199-12-31', isRequired: false },
      ],
      ImportListFormat: [
        {
          name: 'DisplayRouteID',
          exampleValue: '7401',
          displayName: '路線編號',
          key: 'DisplayRouteID',
        },
        {
          name: 'RouteDirection',
          exampleValue: '1',
          displayName: '路線方向',
          key: 'Direction',
        },
        {
          name: 'DepartureTime',
          exampleValue: '06:00',
          displayName: '預估發車時間',
          key: 'departure',
        },
        {
          name: 'IsMonday',
          exampleValue: '1',
          displayName: '週一行駛',
          key: 'is_mon',
        },
        {
          name: 'IsTuesday',
          exampleValue: '1',
          displayName: '週二行駛',
          key: 'is_tue',
        },
        {
          name: 'IsWednesday',
          exampleValue: '1',
          displayName: '週三行駛',
          key: 'is_wed',
        },
        {
          name: 'IsThursday',
          exampleValue: '1',
          displayName: '週四行駛',
          key: 'is_thu',
        },
        {
          name: 'IsFriday',
          exampleValue: '1',
          displayName: '週五行駛',
          key: 'is_fri',
        },
        {
          name: 'IsSaturday',
          exampleValue: '0',
          displayName: '週六行駛',
          key: 'is_sat',
        },
        {
          name: 'IsSunday',
          exampleValue: '0',
          displayName: '週日行駛',
          key: 'is_sun',
        },
        {
          name: 'ActiveDate',
          exampleValue: '2019-01-01',
          displayName: '生效日',
          key: 'active_date',
        },
        {
          name: 'ExpireDate',
          exampleValue: '2199-12-31',
          displayName: '失效日',
          key: 'expire_date',
        },
      ],
      Table: {
        fields: [
          {
            key: 'DisplayRouteID',
            label: '路線編號',
            sortable: true,
            customize: {
              editable: true,
              name: 'TripRoute',
            },
          },
          {
            key: 'Direction',
            label: '路線方向',
            sortable: true,
            customize: {
              editable: false,
              name: 'RouteDirection',
            },
          },
          {
            key: 'departure',
            label: '預估發車時間',
            sortable: true,
            customize: {
              editable: true,
              name: 'DepartureTime',
            },
          },
          {
            key: 'is_mon',
            label: '週一行駛',
            sortable: true,
            customize: {
              editable: true,
              name: 'IsMonday',
            },
            formatter: (value) => {
              if (value === 'false') {
                return '✗';
              } if (value === 'true') {
                return '✓';
              }

              return '-';
            },
          },
          {
            key: 'is_tue',
            label: '週二行駛',
            sortable: true,
            customize: {
              editable: true,
              name: 'IsTuesday',
            },
            formatter: (value) => {
              if (value === 'false') {
                return '✗';
              } if (value === 'true') {
                return '✓';
              }

              return '-';
            },
          },
          {
            key: 'is_wed',
            label: '週三行駛',
            sortable: true,
            customize: {
              editable: true,
              name: 'IsWednesday',
            },
            formatter: (value) => {
              if (value === 'false') {
                return '✗';
              } if (value === 'true') {
                return '✓';
              }

              return '-';
            },
          },
          {
            key: 'is_thu',
            label: '週四行駛',
            sortable: true,
            customize: {
              editable: true,
              name: 'IsThursday',
            },
            formatter: (value) => {
              if (value === 'false') {
                return '✗';
              } if (value === 'true') {
                return '✓';
              }

              return '-';
            },
          },
          {
            key: 'is_fri',
            label: '週五行駛',
            sortable: true,
            customize: {
              editable: true,
              name: 'IsFriday',
            },
            formatter: (value) => {
              if (value === 'false') {
                return '✗';
              } if (value === 'true') {
                return '✓';
              }

              return '-';
            },
          },
          {
            key: 'is_sat',
            label: '週六行駛',
            sortable: true,
            customize: {
              editable: true,
              name: 'IsSaturday',
            },
            formatter: (value) => {
              if (value === 'false') {
                return '✗';
              } if (value === 'true') {
                return '✓';
              }

              return '-';
            },
          },
          {
            key: 'is_sun',
            label: '週日行駛',
            sortable: true,
            customize: {
              editable: true,
              name: 'IsSunday',
            },
            formatter: (value) => {
              if (value === 'false') {
                return '✗';
              } if (value === 'true') {
                return '✓';
              }

              return '-';
            },
          },
          {
            key: 'active_date',
            label: '生效日',
            sortable: true,
            customize: {
              editable: true,
              name: 'TripActiveDate',
            },
          },
          {
            key: 'expire_date',
            label: '失效日',
            sortable: true,
            customize: {
              editable: true,
              name: 'TripExpireDate',
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
        GetResultApi: `${process.env.VUE_APP_BASE_API}/api/trip/GetList`,
        AddApi: `${process.env.VUE_APP_BASE_API}/api/trip/UpsertList`,
        ImportApi: `${process.env.VUE_APP_BASE_API}/api/trip/ImportList`,
        EnabledInputList: [
          { name: 'DisplayRouteID', defaultInput: null },
          { name: 'RouteDirection', defaultInput: null },
          { name: 'DepartureTime', defaultInput: null },
        ],
      };
    },
    BaseTableApi() {
      return {
        EditApi: `${process.env.VUE_APP_BASE_API}/api/trip/UpsertList`,
        DeleteApi: `${process.env.VUE_APP_BASE_API}/api/trip/DeleteList`,
      };
    },
    writable() {
      return this.$store.getters.permissions.schedule_permission === 'W';
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
