<template>
  <div class="wrap">
    <div class="table-function-bar bg-dark px-1">
      <div>
        <b-button variant="primary" size="sm" class="mx-1" @click="excuteWrite" :disabled="!writable">更新</b-button>
        <b-button variant="primary" size="sm" class="mx-1" @click="selectAll">全選/取消選取</b-button>
        <VoucherGroupEdit
          :isGroupEditable="isGroupEditable"
          @groupEdit="groupEdit"
        ></VoucherGroupEdit>
        <b-button variant="danger" size="sm" class="mx-1" @click="deleteRecords" :disabled="!writable">
          <font-awesome-icon :icon="['far', 'trash-alt']" />
        </b-button>
        <b-button variant="primary" size="sm" class="mx-1" @click="toUp" :disabled="!writable" v-if="place === 'second'">
          <font-awesome-icon :icon="['fas', 'arrow-up']" />
        </b-button>
        <b-button variant="primary" size="sm" class="mx-1" @click="toDown" :disabled="!writable" v-else>
          <font-awesome-icon :icon="['fas', 'arrow-down']" />
        </b-button>
        <b-button variant="primary" size="sm" class="mx-1" @click="redo">
          <font-awesome-icon :icon="['fas', 'redo']" />
        </b-button>
        <span class="mx-1" v-if="table">總共：{{ table.length }}筆資料</span>
      </div>
      <div class="d-flex justify-content-center align-items-center p-0 h-100">
        <b-pagination
          v-if="table"
          v-model="tableSettings.currentPage"
          :total-rows="tableRows.length"
          :per-page="tableSettings.perPage"
          first-text="首頁"
          prev-text="前一頁"
          next-text="下一頁"
          last-text="末頁"
          size="sm"
          class="custom-pagination"
        ></b-pagination>
      </div>
    </div>
    <b-table
      ref="table"
      class="table-wrapper"
      v-if="table"
      head-variant="dark"
      table-variant="light"
      striped
      hover
      responsive
      no-border-collapse
      show-empty
      sticky-header="1000px"
      thead-tr-class="no-change-line"
      :tbody-tr-class="tbodyRowClass"
      :fields="tableHead"
      :items="tableRows"
      :per-page="tableSettings.perPage"
      :current-page="tableSettings.currentPage"
      busy.sync="busyState"
      @row-clicked="rowSelect"
    >
      <template #head(OPERATION)>
        <div class="h-100 column-shadow"></div>
        <div class="d-flex justify-content-around">
          <!-- <div>編輯</div>
          <span>/</span>
          <div>刪除</div> -->
        </div>
      </template>

      <template v-slot:cell(selected)="{ value }">
        <template v-if="value === true">
          <span aria-hidden="true">&check;</span>
        </template>
        <template v-else>
          <span aria-hidden="true">&nbsp;</span>
        </template>
      </template>

      <template v-slot:cell(SubRouteUID)="data">
        <template v-if="data.item.hasOwnProperty('vpk') && data.item.路線編號">
          {{ data.item.路線編號 }}
        </template>
        <template v-else-if="data.item.路線編號">{{ data.value }}</template>
        <template v-else>-</template>
      </template>

      <template v-slot:cell(Direction)="data">
        {{data.value === 'false' ? '去程': data.value === 'true' ? '返程':'-'}}
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
      <template v-slot:cell(IntermediateETA)="data">
        <span v-if="data.item.intermediate_stations && JSON.parse(data.item.intermediate_stations).length !== 0">
          {{ JSON.parse(data.item.intermediate_stations).map(i => i.ETA ? $moment(i.ETA, 'HH:mm').format('HH:mm') : '-').join(' / ') }}
        </span>
        <span v-else></span>
      </template>
      <template v-slot:cell(IntermediateArrival)="data">
        <span v-if="data.item.intermediate_stations && JSON.parse(data.item.intermediate_stations).length !== 0">
          {{ JSON.parse(data.item.intermediate_stations).map(i => i.arrival ? $moment(i.arrival, 'HH:mm').format('HH:mm') : '-').join(' / ') }}
        </span>
        <span v-else></span>
      </template>

      <template v-slot:cell(OPERATION)="data">
        <div class="h-100 column-shadow"></div>
        <div class="d-flex justify-content-center p-2">
          <b-button
            variant="primary"
            size="sm"
            class="mx-1"
            @click="getDuplicated(data.item)"
            :disabled="data.item.labor_standards_check && !data.item.labor_standards_check.trim().split(',').includes('同一駕駛所開趟次之行駛時間重疊') && !data.item.labor_standards_check.trim().split(',').includes('同一車輛所行駛趟次之行駛時間重疊')"
          >
            <font-awesome-icon :icon="['fas', 'ellipsis-h']" />
          </b-button>
          <VoucherEdit
            :fields="Table.fields"
            :item="data.item"
            :writable="writable"
            @storedEdit="storedEdit($event, data)"
          />
          <b-button
            variant="danger"
            size="sm"
            class="mx-1"
            @click.stop="storedDelete(data.item)"
            :disabled="data.item.in_deleted || !writable"
          >
            <font-awesome-icon :icon="['far', 'trash-alt']" />
          </b-button>
        </div>
      </template>

      <template v-slot:empty>
        <h4 class="text-center">查無資料</h4>
      </template>
    </b-table>

    <div v-if="busyState" class="table-spinner">
      <div class="text-center text-light my-2 spinner">
        <b-spinner class="align-middle mr-1"></b-spinner>
        <strong>載入中...</strong>
      </div>
    </div>
  </div>
</template>

<script>
import VoucherGroupEdit from '@/components/table/Modals/VoucherGroupEdit.vue';
import VoucherEdit from '@/components/table/Modals/VoucherEdit.vue';

export default {
  name: 'ScheduleTable',
  components: {
    VoucherGroupEdit,
    VoucherEdit,
  },
  props: {
    table: Array,
    busyState: Boolean,
    place: String,
    writable: Boolean,
    isGroupEditable: Boolean,
  },
  data() {
    return {
      Table: {
        fields: [
          {
            key: 'voucher_date',
            label: '行駛日期',
            sortable: true,
            customize: {
              editable: false,
              name: 'VoucherDate',
            },
          },
          {
            key: 'emp_ID',
            label: '駕駛編號',
            sortable: true,
            customize: {
              editable: true,
              name: 'EmployeeIDSelection',
              isRequired: true,
            },
          },
          {
            key: 'emp_name',
            label: '駕駛姓名',
            sortable: true,
            customize: {
              editable: false,
              name: '',
            },
          },
          {
            key: 'bus_no',
            label: '車輛號碼',
            sortable: true,
            customize: {
              editable: true,
              name: 'VoucherVehicle',
              isRequired: true,
            },
          },
          {
            key: 'SubRouteUID',
            label: '路線編號',
            sortable: true,
            customize: {
              editable: true,
              name: 'VoucherRoute',
              isRequired: true,
            },
          },
          {
            key: 'Direction',
            label: '路線方向',
            sortable: true,
            customize: {
              editable: false,
              name: '',
            },
          },
          {
            key: 'distance',
            label: '公里數',
            sortable: true,
            customize: {
              editable: true,
              name: 'VoucherDistance',
            },
          },
          {
            key: 'departure',
            label: '預估發車時間',
            sortable: true,
            customize: {
              editable: true,
              name: 'VoucherDeparture',
            },
            formatter: value => (value ? this.$moment(value, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm') : '-'),
          },
          {
            key: 'arrival',
            label: '預估到終點站時間',
            sortable: true,
            customize: {
              editable: true,
              name: 'VoucherArrival',
            },
            formatter: value => (value ? this.$moment(value, 'YYYY-MM-DD HH:mm').format('YYYY-MM-DD HH:mm') : '-'),
          },
          {
            key: 'intermediate_stations',
            label: '中間站名',
            sortable: false,
            customize: {
              editable: true,
              name: 'VoucherIntermediateStations',
            },
          },
          {
            key: 'IntermediateETA',
            label: '中間站預估到站時間',
            sortable: false,
            customize: {
              editable: false,
              name: '',
            },
          },
          {
            key: 'IntermediateArrival',
            label: '中間站實際到站時間',
            sortable: false,
            customize: {
              editable: false,
              name: '',
            },
          },
          {
            key: 'remark',
            label: '備註',
            sortable: true,
            customize: {
              editable: true,
              name: 'VoucherRemark',
            },
          },
          {
            key: 'labor_standards_check',
            label: '資料異常訊息',
            sortable: true,
            customize: {
              editable: false,
              name: '',
            },
          },
        ],
      },
      tableSettings: {
        prependTableField: {
          key: 'selected',
          label: '選取',
          sortable: false,
        },
        appendTableField: {
          key: 'OPERATION',
          label: '',
          sortable: false,
          stickyColumn: true,
          class: 'column-sticky-right fix-operation-width',
          tdClass: 'p-0 border-0',
          thClass: 'bg-dark',
        },
        perPage: 20,
        currentPage: 1,
      },
    };
  },
  computed: {
    tableHead() {
      return [this.tableSettings.prependTableField, ...this.Table.fields, this.tableSettings.appendTableField];
    },
    tableRows() {
      return this.table;
    },
  },
  methods: {
    tbodyRowClass(item) {
      if (!item) return ['no-change-line', 'cursor-pointer'];

      if (item.in_deleted) {
        return ['no-change-line', 'cursor-pointer', 'b-table-row-selected', 'table-danger'];
      }

      if (item.in_edited) {
        return ['no-change-line', 'cursor-pointer', 'b-table-row-selected', 'table-warning'];
      }

      if (item.selected) {
        return ['no-change-line', 'cursor-pointer', 'b-table-row-selected', 'table-primary'];
      }

      if (item.labor_standards_check !== '成功' && item.labor_standards_check !== '漏排班') {
        return ['no-change-line', 'cursor-pointer', 'b-table-row-selected', 'condition-danger'];
      }

      if (item.labor_standards_check === '漏排班') {
        return ['no-change-line', 'cursor-pointer', 'b-table-row-selected', 'condition-warning'];
      }

      return ['no-change-line', 'cursor-pointer'];
    },

    selectAll() {
      this.$emit('selectAll');
    },

    rowSelect(item) {
      if (item.selected) {
        this.$set(item, 'selected', false);
      } else {
        if (item.in_deleted) {
          this.$set(item, 'in_deleted', false);
          return;
        }

        // if (item.in_edited) {
        //   return;
        // }

        this.$set(item, 'selected', true);
      }

      this.$emit('storedSelected', item);
    },

    storedEdit(send) {
      this.$emit('storedEdit', send);
    },

    storedDelete(data) {
      if (data.selected) {
        // eslint-disable-next-line no-param-reassign
        data.selected = false;
      }
      this.$set(data, 'in_deleted', true);
    },

    getDuplicated(data) {
      this.$emit('getDuplicated', data);
    },

    groupEdit(value) {
      this.$emit('groupEdit', value);
    },

    excuteWrite() {
      this.$emit('excuteWrite');
    },

    deleteRecords() {
      this.$emit('deleteRecords');
    },

    toUp() {
      this.$emit('toUp');
    },

    toDown() {
      this.$emit('toDown');
    },

    redo() {
      this.$emit('redo');
    },
  },
};
</script>

<style lang="scss" scoped>
.wrap {
  flex: 1;
  overflow: hidden;
  position: relative;
  border-right: 1px solid #8e8e8e;
  border-bottom: 1px solid #8e8e8e;
}

::v-deep .custom-pagination {
  margin-bottom: 0 ;

  .page-item {
    &.active .page-link {
      color: #00a199;
      background-color: none;
      border-color: #00a199;
    }

    &.disabled .page-link {
      color: #949494;
      pointer-events: none;
      cursor: auto;
      border-color: #dee2e6;
    }
  }

  .page-link {
    color: #fff !important;
    background-color: transparent !important;
  }
}

.table-spinner {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  background-color: rgba($color: #000000, $alpha: 0.4);

  .spinner {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}

::v-deep .cursor-pointer {
  cursor: pointer;
}

.table-function-bar {
  color: #ffffff;
  height: 40px;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
}

.table-wrapper {
  height: calc(100% - 40px);
  width: 100%;
}

::v-deep .table-responsive {
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

  .no-change-line {
    white-space: nowrap;
  }
}
</style>
