<template>
  <div class="d-flex flex-column flex-grow-1" ref="tableRoot">
    <b-table
      class="m-0 text-nowrap"
      ref="tableInfo"
      head-variant="dark"
      table-variant="light"
      striped
      hover
      bordered
      responsive
      no-border-collapse
      show-empty
      thead-tr-class="adjust-sticky-tr"
      :sticky-header="`${tableHeight}px`"
      :fields="tableFields"
      :items="itemsWithPk"
      :per-page="tableSettings.perPage"
      :current-page="tableSettings.currentPage"
      :sort-by="Table.sortBy"
      :sort-desc="Table.sortDesc"
      :sort-compare="Table.sortCompare"
    >
      <template v-slot:empty>
        <h5 class="text-center">尚無資料</h5>
      </template>

      <template v-slot:thead-top>
        <slot name="thead-top"></slot>
      </template>

      <template v-slot:cell(OPERATION)="row">
        <div class="h-100 column-shadow"></div>
        <div class="d-flex justify-content-center p-2" :key="row.item.PK">
          <Edit
            :fields="tableEditFields"
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
import Edit from '@/components/table/Modals/Edit.vue';

export default {
  name: 'TabTable',
  components: {
    Edit,
  },
  props: {
    Table: Object,
    tabIndex: Number,
    tabItems: Array,
    queriedData: Object,
    containerHeight: Number,
    EditApi: String,
    DeleteApi: String,
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
    };
  },
  computed: {
    tableHeight() {
      if (!this.isMounted) return this.tableSettings.baseHeight;

      const Pagination = this.$refs.tablePagination.clientHeight;

      // need to count tab nav's height
      const res = this.containerHeight - Pagination - 66;

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
    tableFields() {
      const tableFieldSetName = this.tabItems[this.tabIndex].name;
      const tableFieldSet = this.Table[`${tableFieldSetName}`];

      return [...tableFieldSet, this.tableSettings.appendTableField];
    },
    tableEditFields() {
      const tableFieldSetName = this.tabItems[this.tabIndex].name;
      const tableFieldSet = this.Table[`${tableFieldSetName}`];

      return [...tableFieldSet];
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
  },
};
</script>

<style lang="scss" scoped>
::v-deep .container-border {
  border: 1px solid #aaaaaa;
}

::v-deep .adjust-sticky-tr > th {
  top: 51px !important;
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
      rgba(0, 0, 0, 0) 10%,
      rgba(0, 0, 0, 0.1) 100%
    );
  }
  .column-non-bg-color {
    background-color: rgba(0, 0, 0, 0);
  }
}

// custumize fix column
::v-deep .adjust-th-year-column {
  left: 0px !important;
  background-color: #343a40 !important;
  border-color: #454d55 !important;
  min-width: 100px !important;
  width: 100px !important;
}

::v-deep .adjust-td-year-column {
  left: 0px !important;
  background-color: none !important;
  min-width: 100px !important;
  width: 100px !important;
}

::v-deep .adjust-th-month-column {
  left: 100px !important;
  background-color: #343a40 !important;
  border-color: #454d55 !important;
  min-width: 100px !important;
  width: 100px !important;
}

::v-deep .adjust-td-month-column {
  left: 100px !important;
  background-color: none !important;
  min-width: 100px !important;
  width: 100px !important;
}

::v-deep .adjust-th-empID-column {
  left: 200px !important;
  background-color: #343a40 !important;
  border-color: #454d55 !important;
  min-width: 100px !important;
  width: 100px !important;
}

::v-deep .adjust-td-empID-column {
  left: 200px !important;
  background-color: none !important;
  min-width: 100px !important;
  width: 100px !important;
}

::v-deep .adjust-th-empname-column {
  left: 301px !important;
  background-color: #343a40 !important;
  border-color: #454d55 !important;
  min-width: 150px !important;
  width: 150px !important;
}

::v-deep .adjust-td-empname-column {
  left: 301px !important;
  background-color: none !important;
  min-width: 150px !important;
  width: 150px !important;
}

::v-deep .table-striped tbody tr:nth-of-type(odd) {
  .adjust-td-year-column {
    background-color: #f0f0f1 !important;
  }

  .adjust-td-month-column {
    background-color: #f0f0f1 !important;
  }

  .adjust-td-empID-column {
    background-color: #f0f0f1 !important;
  }

  .adjust-td-empname-column {
    background-color: #f0f0f1 !important;
  }
}
</style>
