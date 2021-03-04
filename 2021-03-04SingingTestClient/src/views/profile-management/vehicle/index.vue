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
  name: 'Vehicle',
  components: {
    QueryTool,
    BaseTable,
  },
  data() {
    return {
      AddListFormat: [
        { name: 'VehicleNumber', defaultInput: '', isRequired: true },
        { name: 'VehicleBrand', defaultInput: '', isRequired: false },
        { name: 'VehicleYearOfManufacture', defaultInput: '', isRequired: false },
      ],
      ImportListFormat: [
        {
          name: 'VehicleNumber',
          exampleValue: 'KKA-0001',
          displayName: '車號',
          key: 'bus_no',
        },
        {
          name: 'VehicleBrand',
          exampleValue: 'TOYOTA',
          displayName: '廠牌',
          key: 'bus_mark',
        },
        {
          name: 'VehicleYearOfManufacture',
          exampleValue: '2000',
          displayName: '年份',
          key: 'manufacturing_year',
        },
      ],

      Table: {
        fields: [
          {
            key: 'bus_no',
            label: '車號',
            sortable: true,
            customize: {
              editable: true,
              name: 'VehicleNumber',
            },
          },
          {
            key: 'bus_mark',
            label: '廠牌',
            sortable: true,
            customize: {
              editable: true,
              name: 'VehicleBrand',
            },
          },
          {
            key: 'manufacturing_year',
            label: '年份',
            sortable: true,
            customize: {
              editable: true,
              name: 'VehicleYearOfManufacture',
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
        GetResultApi: `${process.env.VUE_APP_BASE_API}/api/vehicle/GetList`,
        AddApi: `${process.env.VUE_APP_BASE_API}/api/vehicle/UpsertList`,
        ImportApi: `${process.env.VUE_APP_BASE_API}/api/vehicle/ImportList`,
        EnabledInputList: [
          { name: 'VehicleNumber', defaultInput: null },
          { name: 'VehicleBrand', defaultInput: null },
          { name: 'VehicleYearOfManufacture', defaultInput: null },
        ],
      };
    },
    BaseTableApi() {
      return {
        EditApi: `${process.env.VUE_APP_BASE_API}/api/vehicle/UpsertList`,
        DeleteApi: `${process.env.VUE_APP_BASE_API}/api/vehicle/DeleteList`,
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
