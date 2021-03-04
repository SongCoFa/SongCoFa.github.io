<template>
  <div class="d-flex flex-column flex-grow-1" ref="tableRoot">
    <b-row class="m-0" ref="tableNav">
      <b-col class="p-0">
        <b-nav align="left">
          <h4
            v-if="queriedData.time"
            class="mt-2"
          >查詢時間：{{queriedData.time | moment("YYYY-MM-DD HH:mm:ss")}}</h4>
        </b-nav>
      </b-col>
      <b-col class="d-flex align-self-end justify-content-end p-0">
        <b-nav>
          <Export v-if="noneExport" v-bind="Table" />
        </b-nav>
      </b-col>
    </b-row>

    <b-table
      class="m-0 text-nowrap"
      ref="tableInfo"
      head-variant="dark"
      table-variant="light"
      :sticky-header="`${tableHeight}px`"
      striped
      hover
      bordered
      responsive
      no-border-collapse
      :fields="[...this.Table.fields, ...this.tableSettings.appendTableField]"
      :items="itemsWithPk"
      :per-page="tableSettings.perPage"
      :current-page="tableSettings.currentPage"
      show-empty
      :sort-by="Table.sortBy"
      :sort-desc="Table.sortDesc"
      :sort-compare="Table.sortCompare"
    >
      <template #head(OPERATION)>
        <div class="h-100 column-shadow"></div>
        <div class="d-flex justify-content-around">
          <div v-if="ResetPasswordApi">
            <span class="mx-2">編輯</span>
            <span class="mx-2">復職</span>
            <span class="mx-2">重置</span>
          </div>
          <div v-else class="operation-panel-head">
            <span class="mx-2">編輯</span>
            <span class="mx-2">復職</span>
          </div>
        </div>
      </template>

      <template
        v-slot:cell(Direction)="data"
      >{{data.value === 'false' ? '去程': data.value === 'true' ? '返程':'-'}}</template>

      <template v-slot:cell(SubRouteUID)="data">
        <template v-if="data.item.hasOwnProperty('vpk') && data.item.路線編號">{{ data.item.路線編號 }}</template>
        <template v-else-if="data.item.路線編號">{{ data.value }}</template>
        <template v-else>-</template>
      </template>

      <template v-slot:cell(intermediate_stations)="data">
        <template v-if="data.value && JSON.parse(data.value).length !== 0">
          <span v-for="(item, index) in JSON.parse(data.value)" :key="index">
            {{item.station_fullname}}
            {{JSON.parse(data.value).length -1 === index?'':'→'}}
          </span>
        </template>
        <template v-else>-</template>
      </template>
      <template v-slot:cell(ScheduleIntermediateStations)="data">
        <span
          v-if="data.item.intermediate_stations && JSON.parse(data.item.intermediate_stations).length !== 0"
        >{{ JSON.parse(data.item.intermediate_stations).map(i => i.station_fullname ? i.station_fullname : '-').join(' → ') }}</span>
        <span v-else></span>
      </template>
      <template v-slot:cell(IntermediateETA)="data">
        <span
          v-if="data.item.intermediate_stations && JSON.parse(data.item.intermediate_stations).length !== 0"
        >{{ JSON.parse(data.item.intermediate_stations).map(i => i.ETA ? $moment(i.ETA, 'HH:mm:ss').format('HH:mm:ss') : '-').join(' / ') }}</span>
        <span v-else></span>
      </template>
      <template v-slot:cell(IntermediateArrival)="data">
        <span
          v-if="data.item.intermediate_stations && JSON.parse(data.item.intermediate_stations).length !== 0"
        >{{ JSON.parse(data.item.intermediate_stations).map(i => i.arrival ? $moment(i.arrival, 'HH:mm:ss').format('HH:mm:ss') : '-').join(' / ') }}</span>
        <span v-else></span>
      </template>

      <template v-slot:cell(OPERATION)="row">
        <div class="h-100 column-shadow"></div>
        <div class="d-flex justify-content-center p-2" :key="row.item.PK">
          <Edit
            :fields="Table.fields"
            :EditApi="EditApi"
            :item="row.item"
            :writable="writable"
            @refreshData="refreshData"
            class="mr-2"
          >
            <template v-slot:DisplayWhichRow>
              <slot name="DisplayWhichRow" :data="row.item"></slot>
            </template>
          </Edit>
          <DriverReinstatement
            :fields="Table.fields"
            :DeleteApi="DeleteApi"
            :delItem="row.item"
            :writable="writable"
            @refreshData="refreshData"
          />
          <ResetPassword
            v-if="ResetPasswordApi"
            :ResetPasswordApi="ResetPasswordApi"
            :item="row.item"
            :writable="writable"
            class="ml-2"
            @refreshData="refreshData"
          ></ResetPassword>
        </div>
      </template>
    </b-table>

    <div class="d-flex justify-content-center p-2" ref="tablePagination">
      <b-pagination
        v-model="tableSettings.currentPage"
        :total-rows="itemsWithPk.length"
        :per-page="tableSettings.perPage"
        first-text="首頁"
        prev-text="前一頁"
        next-text="下一頁"
        last-text="末頁"
      ></b-pagination>
    </div>
  </div>
</template>

<script>
import Export from '@/components/table/Modals/Export.vue';
import Edit from '@/components/table/Modals/Edit.vue';
import DriverReinstatement from '@/components/table/Modals/DriverReinstatement.vue';
import ResetPassword from '@/components/table/Modals/ResetPassword.vue';

export default {
  components: {
    Export,
    Edit,
    DriverReinstatement,
    ResetPassword,
  },
  props: {
    Table: Object,
    queriedData: Object,
    containerHeight: Number,
    EditApi: String,
    DeleteApi: String,
    ResetPasswordApi: String,
    OperationPanel: Boolean,
    writable: Boolean,
  },
  data() {
    return {
      isMounted: false,
      tableSettings: {
        appendTableField: {
          key: 'OPERATION',
          label: '編輯',
          sortable: false,
          stickyColumn: true,
          class: 'column-sticky-right fix-operation-width',
          tdClass: 'p-0 border-0',
          thClass: 'bg-dark',
        },
        perPage: 20,
        currentPage: 1,
        baseHeight: 200,
      },
      isExpire: false,
    };
  },
  computed: {
    tableHeight() {
      if (!this.isMounted) return this.tableSettings.baseHeight;

      const Nav = this.$refs.tableNav.clientHeight;

      const Pagination = this.$refs.tablePagination.clientHeight;

      const res = this.containerHeight - Nav - Pagination;

      return res > this.tableSettings.baseHeight
        ? res
        : this.tableSettings.baseHeight;
    },
    itemsWithPk() {
      return this.Table.items.map((item) => {
        const some = item;
        some.PK = this.uuid();
        return some;
      });
    },
    noneExport() {
      const compo = this.$parent.$options.name;

      console.log(compo);

      if (compo === 'AccountManagement') return false;

      return true;
    },
  },
  mounted() {
    this.isMounted = true;
  },
  methods: {
    refreshData() {
      this.$emit('refreshData');
    },
    uuid() {
      let d = Date.now();
      if (
        typeof performance !== 'undefined'
        && typeof performance.now === 'function'
      ) {
        d += performance.now(); // use high-precision timer if available
      }

      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        // eslint-disable-next-line no-bitwise
        const r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        // eslint-disable-next-line no-bitwise
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
      });
    },
    // tbodyRowClass(item) {
    //   if (!item) return ['no-change-line', 'cursor-pointer'];

    //   if (item.labor_standards_check && item.labor_standards_check !== '漏排班' && item.labor_standards_check !== '成功') {
    //     return ['no-change-line', 'cursor-pointer', 'b-table-row-selected', 'table-danger'];
    //   }

    //   if (item.labor_standards_check && item.labor_standards_check === '漏排班') {
    //     return ['no-change-line', 'cursor-pointer', 'b-table-row-selected', 'table-warning'];
    //   }

    //   return ['no-change-line', 'cursor-pointer'];
    // },
  },
};
</script>

<style lang="scss" scoped>
.operation-panel-head {
  display: flex;
  flex-direction: row;

  span {
  }
}

.table-responsive ::v-deep {
  .fix-operation-width {
    width: 150px;
  }
  .column-sticky-right {
    right: 0;
    text-align: center;
  }
  .column-shadow {
    position: absolute;
    top: 0ex;
    width: 20px;
    left: -20px;
    background: linear-gradient(
      90deg,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0.3) 100%
    );
  }
  .column-non-bg-color {
    background-color: rgba(0, 0, 0, 0);
  }
}
</style>
