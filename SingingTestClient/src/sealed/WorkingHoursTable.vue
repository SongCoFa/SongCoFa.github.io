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
          <div class="btn btn-primary container-border rounded-0" @click="save">更新</div>
          <Export :fields="exportFields" :items="exportItems" />
        </b-nav>
      </b-col>
    </b-row>

    <b-table
      class="m-0 text-nowrap"
      ref="tableInfo"
      head-variant="dark"
      table-variant="light"
      striped
      bordered
      responsive
      no-border-collapse
      show-empty
      :tbody-tr-class="tbodyRowClass"
      :sticky-header="`${tableHeight}px`"
      :fields="tableFields"
      :items="tableItems"
      :per-page="tableSettings.perPage"
      :current-page="tableSettings.currentPage"
      busy.sync="busyState"
    >
      <template
        v-for="field in tableFields"
        v-slot:[`cell(${field.key})`]="data"
      >
        <div
          v-if="!['emp_ID', 'emp_name', 'total'].includes(data.field.key)"
          :key="field.key"
          class="adjust-field-height"
          :class="{ 'leave': data.value.leave_flag === 'true','bisque': data.item.editedField && data.item.editedField.includes(field.key) }"
        >
          <b-form-input class="no-shadow" type="number" v-model="data.value.hours" :formatter="formatHour" @change="storedChange(data)"></b-form-input>
        </div>
        <div v-else :key="field.key" class="adjust-field-height">{{ data.value }}</div>
      </template>
    </b-table>

    <div class="d-flex justify-content-center p-2" ref="tablePagination">
      <b-pagination
        v-model="tableSettings.currentPage"
        :total-rows="tableItems.length"
        :per-page="tableSettings.perPage"
        first-text="首頁"
        prev-text="前一頁"
        next-text="下一頁"
        last-text="末頁"
      ></b-pagination>
    </div>

    <div v-if="busyState" class="table-spinner">
      <div class="text-center text-light my-2 spinner">
        <b-spinner class="align-middle mr-1"></b-spinner>
        <strong>載入中...</strong>
      </div>
    </div>
  </div>
</template>

<script>
import Export from '@/components/table/Modals/Export.vue';

export default {
  name: 'WorkingHoursTable',
  components: {
    Export,
  },
  props: {
    Table: Object,
    queriedData: Object,
    containerHeight: Number,
    EditApi: String,
    DeleteApi: String,
    busyState: Boolean,
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

      TableFields: [
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

      stored: [],
    };
  },
  watch: {
    Table: {
      handler() {
        this.stored.length = 0;
      },
      deep: true,
    },
    stored: {
      handler(value) {
        if (value.length > 0) {
          this.$emit('checkDataNotUpdate', true);
        }

        if (value.length === 0) {
          this.$emit('checkDataNotUpdate', false);
        }
      },
      deep: true,
    },
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
    tableFields() {
      const { year, month } = this.queriedData.input;

      const days = new Date(year, month, 0).getDate();

      const result = [];

      for (let i = 1; i <= days; i++) {
        const obj = {};
        const day = (i < 10) ? `0${i}` : i;
        obj.key = `${year}-${month}-${day}`;
        obj.label = `${year}-${month}-${day}`;
        result.push(obj);
      }

      return [...this.TableFields, ...result, { key: 'total', label: '合計時數' }];
    },
    tableItems() {
      // 同一個員工的資料為一群組
      const gatherByEmployee = this.Table.items.reduce((a, b) => {
        const temp = a;
        (temp[b.emp_ID] = temp[b.emp_ID] || []).push(b);
        return temp;
      }, {});

      // 組合成 b-table 接受的格式
      const res = Object.keys(gatherByEmployee).reduce((a, b) => {
        const temp = a;

        const obj = {};

        obj.emp_ID = gatherByEmployee[`${b}`][0].emp_ID;
        obj.emp_name = gatherByEmployee[`${b}`][0].emp_name;
        gatherByEmployee[`${b}`].forEach((row) => {
          // eslint-disable-next-line prefer-const, camelcase
          let { hours, leave_flag } = { ...row };
          obj[`${row.date}`] = { hours, leave_flag };
        });
        obj.total = gatherByEmployee[`${b}`][0].total;

        temp.push(obj);

        return temp;
      }, []);

      // 產生PK
      const rowWithPK = res.map((item) => {
        const some = item;
        some.PK = this.uuid();
        return some;
      });

      return rowWithPK;
    },
    exportFields() {
      const { year, month } = this.queriedData.input;

      const days = new Date(year, month, 0).getDate();

      const result = [];

      for (let i = 1; i <= days; i++) {
        const obj = {};
        const day = (i < 10) ? `0${i}` : i;
        obj.key = `${year}-${month}-${day}`;
        obj.label = `${year}-${month}-${day}`;
        result.push(obj);
      }

      return [{ key: 'emp_name', label: '駕駛姓名' }, ...result];
    },
    exportItems() {
      // 同一個員工的資料為一群組
      const gatherByEmployee = this.Table.items.reduce((a, b) => {
        const temp = a;
        (temp[b.emp_ID] = temp[b.emp_ID] || []).push(b);
        return temp;
      }, {});

      // 組合新的資料格式
      const res = Object.keys(gatherByEmployee).reduce((a, b) => {
        const temp = a;

        const obj = {};

        obj.emp_ID = gatherByEmployee[`${b}`][0].emp_ID;
        obj.emp_name = gatherByEmployee[`${b}`][0].emp_name;
        gatherByEmployee[`${b}`].forEach((row) => {
          obj[`${row.date}`] = row.hours;
        });
        obj.total = gatherByEmployee[`${b}`][0].total;

        temp.push(obj);

        return temp;
      }, []);

      return res;
    },
  },
  mounted() {
    this.stored.length = 0;
    this.isMounted = true;
  },
  updated() {
    // this.stored.length = 0;
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
    formatHour(e) {
      return e > 99 || e < 0 ? 0 : e;
    },
    tbodyRowClass() {
      return ['no-change-line', 'cursor-pointer'];
    },
    storedChange(data) {
      /* Change class when td change value start */
      let editedArray = [];

      if (data.item.editedField) {
        editedArray = data.item.editedField;
      }

      const check = editedArray.some(item => item === data.field.key);

      if (!check) {
        editedArray.push(data.field.key);
      }

      this.$set(data.item, 'editedField', editedArray);
      /* Change class when td change value end */

      const dataSet = {};
      dataSet.date = data.field.key;
      dataSet.emp_ID = data.item.emp_ID;
      dataSet.hours = data.value.hours;

      const keyname = [`${dataSet.date}`].hours;

      this.$set(data.item, `${keyname}`, dataSet.hours * 1);

      // check key {date + emp_ID} has exist and stored in update queue
      for (let i = 0; i < this.stored.length; i++) {
        if (this.stored[i].date === dataSet.date && this.stored[i].emp_ID === dataSet.emp_ID) {
          this.stored[i].hours = dataSet.hours;
          return;
        }
      }

      this.stored.push(dataSet);
    },
    save() {
      this.$http.post(this.EditApi, this.stored)
        .then((response) => {
          console.log(response);
          this.refreshData();
        })
        .catch(e => console.log(e));
    },
  },
};
</script>

<style lang="scss" scoped>
.leave {
  background-color: #a2a2a2;
  .form-control {
    background-color: #b3b3b3;
  }
}

.bisque {
  background-color: #ffe4c4;
  .form-control {
    background-color: #ffe4c4;
  }
}

.container-border {
  border: 1px solid #aaaaaa;
}

.adjust-field-height {
  // padding: 0.375rem 0;
  // height: calc(1.5em + 0.75rem + 2px);
  padding: 0.75rem;
  height: 100%;
}

::v-deep .table {
  td[role=cell] {
    padding: 0;
    vertical-align: middle;
  }
}

// class must underneath td[role=cell]
::v-deep .table-striped tbody tr:nth-of-type(odd) {
  .adjust-td-id-column {
    background-color: #f0f0f1 !important;
  }

  .adjust-td-name-column {
    background-color: #f0f0f1 !important;
  }
}

::v-deep .adjust-th-name-column {
  left: 90px !important;
}

::v-deep .adjust-td-name-column {
  left: 90px !important;
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

</style>
