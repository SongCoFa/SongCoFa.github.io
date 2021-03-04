<template>
  <div class="wrap">
    <div class="table-function-bar bg-dark px-1">
      <div class="left-side">
        <b-button-group size="sm">
          <ShiftAdd :shiftMaster="shiftMaster" :shiftName="shiftName" :writable="writable" @addNewRecord="addNewRecord"></ShiftAdd>
          <b-button :disabled="!writable" @click="removeRecords"><font-awesome-icon :icon="['fas', 'minus']" size="lg" /></b-button>
        </b-button-group>
      </div>
      <div class="middle-side">
        <div class="shift-title float-left">
          {{ master.shift_name === null ? '-' : master.shift_name }} /
          {{ master.emp_ID === null ? '-' : master.emp_ID }} /
          {{ master.bus_no === null ? '-' : master.bus_no }}
        </div>
        <ShiftMasterEdit :shiftName="shiftName" :shiftMasterData="master" :writable="writable" @refreshData="refreshData"></ShiftMasterEdit>
      </div>
      <div class="right-side ml-1">
        <Exportshift :ExportColumn="ExportColumn" :tableData="table"></Exportshift>
        <b-button variant="primary" size="sm" @click="executeUpdateShift" :disabled="!writable">更新</b-button>
      </div>
    </div>
    <b-table
      v-if="table"
      head-variant="dark"
      table-variant="light"
      striped
      hover
      responsive
      no-border-collapse
      sticky-header="1000px"
      show-empty
      @row-clicked="rowSelect"
      primary-key="seq"
      thead-tr-class="no-change-line"
      class="table-wrapper"
      :fields="tableHead"
      :items="tableRows"
      :tbody-tr-class="tbodyRowClass"
      busy.sync="busyState"
    >
      <template #head(OPERATION)>
        <div class="h-100 column-shadow"></div>
        <div class="d-flex justify-content-around">
          <div>編輯</div>
          <span>/</span>
          <div>刪除</div>
        </div>
      </template>

      <template v-slot:cell(direction)="{ value }">
        {{ value === 'false' ? '去程': value === 'true' ? '返程':'-'}}
      </template>

      <template v-slot:cell(selected)="{ value }">
        <template v-if="value === true">
          <span aria-hidden="true">&check;</span>
        </template>
        <template v-else>
          <span aria-hidden="true">&nbsp;</span>
        </template>
      </template>

      <template v-slot:cell(IntermediateStations)="data">
        <span v-if="data.item.intermediate_stations && JSON.parse(data.item.intermediate_stations).length !== 0">
          {{ JSON.parse(data.item.intermediate_stations).map(item => item.station_fullname).join(' → ') }}
        </span>
        <span v-else></span>
      </template>
      <template v-slot:cell(IntermediateStationsArrival)="data">
        <span v-if="data.item.intermediate_stations && JSON.parse(data.item.intermediate_stations).length !== 0">
          {{ JSON.parse(data.item.intermediate_stations).map(item => item.ETA ? $moment(item.ETA, 'HH:mm').format('HH:mm') : '-').join(' / ') }}
        </span>
        <span v-else></span>
      </template>

      <template v-slot:cell(OPERATION)="data">
        <div class="h-100 column-shadow"></div>
        <div class="d-flex justify-content-center p-2">
          <ShiftEdit
            :data="data.item"
            :writable="writable"
            @updateEdited="updateEdited"
          ></ShiftEdit>
          <b-button
            variant="danger"
            size="sm"
            class="mx-1"
            @click.stop="removeOneRecord(data.item)"
            :disabled="data.item.in_deleted || !writable"
          >
            <font-awesome-icon :icon="['far', 'trash-alt']" />
          </b-button>
        </div>
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
import ShiftAdd from '@/components/table/Modals/ShiftAdd.vue';
import ShiftEdit from '@/components/table/Modals/ShiftEdit.vue';
import ShiftMasterEdit from '@/components/table/Modals/ShiftMasterEdit.vue';
import Exportshift from '@/components/table/Modals/ExportShift.vue';

export default {
  name: 'ShiftTable',
  props: {
    table: Array,
    shiftName: String,
    busyState: Boolean,
    shiftMaster: Object,
    writable: Boolean,
  },
  components: {
    ShiftAdd,
    ShiftEdit,
    ShiftMasterEdit,
    Exportshift,
  },
  data() {
    return {
      // 欄位定義
      ShiftTable: {
        fields: [
          // {
          //   key: 'shift_name',
          //   label: '仕業名稱',
          //   sortable: true,
          // },
          {
            key: 'emp_ID',
            label: '駕駛編號',
            sortable: true,
          },
          {
            key: 'emp_name',
            label: '駕駛姓名',
            sortable: true,
          },
          {
            key: 'bus_no',
            label: '車輛號碼',
            sortable: true,
          },
          {
            key: 'DisplayRouteID',
            label: '路線編號',
            sortable: true,
          },
          {
            key: 'direction',
            label: '路線方向',
            sortable: true,
          },
          {
            key: 'departure',
            label: '預估發車時間',
            sortable: true,
            formatter: value => (value ? this.$moment(value, 'HH:mm:ss').format('HH:mm') : '-'),
          },
          {
            key: 'arrival',
            label: '預估到終點站時間',
            sortable: true,
            formatter: value => (value ? this.$moment(value, 'HH:mm:ss').format('HH:mm') : '-'),
          },
          {
            key: 'IntermediateStations',
            label: '中間站',
            sortable: false,
          },
          {
            key: 'IntermediateStationsArrival',
            label: '中間站預估到站時間',
            sortable: false,
          },
          {
            key: 'remark',
            label: '備註',
            sortable: false,
          },
          {
            key: 'is_mon',
            label: '週一行駛',
            sortable: true,
          },
          {
            key: 'is_tue',
            label: '週二行駛',
            sortable: true,
          },
          {
            key: 'is_wed',
            label: '週三行駛',
            sortable: true,
          },
          {
            key: 'is_thu',
            label: '週四行駛',
            sortable: true,
          },
          {
            key: 'is_fri',
            label: '週五行駛',
            sortable: true,
          },
          {
            key: 'is_sat',
            label: '週六行駛',
            sortable: true,
          },
          {
            key: 'is_sun',
            label: '週日行駛',
            sortable: true,
          },
          {
            key: 'active_date',
            label: '生效日期',
            sortable: true,
          },
          {
            key: 'expire_date',
            label: '失效日期',
            sortable: true,
          },
        ],
      },
      // 表格其他選項
      tableSettings: {
        prependTableField: {
          key: 'selected',
          label: '選取',
          sortable: false,
        },
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
      },
      ExportColumn: [
        {
          key: 'shift_name',
          label: '仕業名稱',
        },
        {
          key: 'emp_name',
          label: '駕駛',
        },
        {
          key: 'bus_no',
          label: '車輛',
        },
        {
          key: 'DisplayRouteID',
          label: '路線編號',
        },
        {
          key: 'direction',
          label: '路線方向',
        },
        {
          key: 'departure',
          label: '開車時刻',
        },
        {
          key: 'arrival',
          label: '到站時刻',
        },
        {
          key: 'remark',
          label: '備註',
        },
        {
          key: 'intermediate_stations',
          label: '中間站',
        },
        {
          key: 'is_mon',
          label: '週一行駛',
        },
        {
          key: 'is_tue',
          label: '週二行駛',
        },
        {
          key: 'is_wed',
          label: '週三行駛',
        },
        {
          key: 'is_thu',
          label: '週四行駛',
        },
        {
          key: 'is_fri',
          label: '週五行駛',
        },
        {
          key: 'is_sat',
          label: '週六行駛',
        },
        {
          key: 'is_sun',
          label: '週日行駛',
        },
      ],

      driverList: null,
    };
  },
  created() {
    this.$store.dispatch('DriverList/getDrivers', null);
    this.getDrivers();
  },
  mounted() {
  },
  watch: {
  },
  computed: {
    tableHead() {
      const check = ['is_mon', 'is_fri', 'is_sat', 'is_sun', 'is_thu', 'is_tue', 'is_wed'];
      this.ShiftTable.fields.map((item) => {
        const temp = item;

        if (check.includes(item.key)) {
          temp.formatter = (value) => {
            let str = '';

            if (value === 'false') {
              // str = '不行駛';
              str = '✗';
            } else if (value === 'true') {
              // str = '行駛';
              str = '✓';
            } else {
              str = '-';
            }

            return str;
          };
        }

        return temp;
      });

      return [this.tableSettings.prependTableField, ...this.ShiftTable.fields, this.tableSettings.appendTableField];
    },
    tableRows() {
      return this.table;
    },
    master() {
      const temp = {
        shift_name: this.shiftMaster.shift_name,
        emp_ID: this.shiftMaster.emp_ID,
        bus_no: this.shiftMaster.bus_no,
      };
      return temp;
    },
  },
  methods: {
    getDrivers() {
      this.$http.post(`${process.env.VUE_APP_BASE_API}/api/driver/GetList`, { emp_ID: null, emp_name: null, dept: null })
        .then((response) => {
          const filterResult = response.data.Resource.filter(item => item.title === '駕駛長');
          this.driverList = filterResult;
        })
        .catch(error => console.log(error));
    },

    dutyDayFormatter(value) {
      let str = '';

      if (value === 'false') {
        str = '不開班';
      } else if (value === 'true') {
        str = '開班';
      } else {
        str = '-';
      }

      return str;
    },

    tbodyRowClass(item) {
      if (!item) return ['no-change-line', 'cursor-pointer'];

      if (item.in_deleted) {
        return ['no-change-line', 'cursor-pointer', 'b-table-row-selected', 'table-danger'];
      }

      if (item.in_added || item.in_edited) {
        return ['no-change-line', 'cursor-pointer', 'b-table-row-selected', 'table-warning'];
      }

      if (item.selected) {
        return ['no-change-line', 'cursor-pointer', 'b-table-row-selected', 'table-primary'];
      }

      return ['no-change-line', 'cursor-pointer'];
    },

    rowSelect(item) {
      // if (item.selected) {
      //   this.$set(item, 'selected', false);
      //   this.$emit('storedSelectedShift', item, 'remove');
      // } else {
      //   if (item.in_deleted) {
      //     this.$set(item, 'in_deleted', false);
      //     return;
      //   }

      //   this.$set(item, 'selected', true);
      //   this.$emit('storedSelectedShift', item, 'add');
      // }
      if (item.selected) {
        this.$set(item, 'selected', false);
      } else {
        if (item.in_deleted) {
          this.$set(item, 'in_deleted', false);
          return;
        }

        if (item.in_edited || item.in_added) {
          return;
        }

        this.$set(item, 'selected', true);
      }

      this.$emit('storedSelectedShift', item);
    },

    executeUpdateShift() {
      this.$emit('executeUpdateShift');
    },

    addNewRecord(record) {
      this.$emit('addNewRecord', record);
    },

    removeRecords() {
      this.$emit('removeRecords');
    },

    removeOneRecord(item) {
      if (item.selected) {
        // eslint-disable-next-line no-param-reassign
        item.selected = false;
      }

      this.$set(item, 'in_deleted', true);
    },

    refreshData() {
      this.$emit('refreshData');
    },

    updateEdited(record) {
      this.$emit('updateEdited', record);
    },
  },
};
</script>

<style lang="scss" scoped>
.wrap {
  flex: 1;
  overflow: hidden;
  position: relative;
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

.shift-title {
  max-width: 600px;
  white-space: nowrap;
  overflow: hidden;
}

::v-deep .cursor-pointer {
  cursor: pointer;
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

  .no-change-line {
    white-space: nowrap;
  }
}
</style>
