<template>
  <div class="d-flex flex-column flex-grow-1" ref="tableRoot">
    <b-table-simple
      class="m-0 text-nowrap"
      ref="tableInfo"
      bordered
      responsive
      no-border-collapse
      thead-tr-class="text-center"
      :sticky-header="`${tableHeight}px`"
    >
      <b-thead>
        <b-tr>
          <b-th class="text-center align-middle" rowspan="2" sticky-column>姓名</b-th>
          <b-th class="text-center" colspan="2">固定薪資</b-th>
          <b-th class="text-center" colspan="3"></b-th>
          <b-th class="text-center" colspan="14">各種津貼獎金</b-th>
          <b-th class="text-center"></b-th>
          <b-th class="text-center"></b-th>
          <b-th class="text-center"></b-th>
          <b-th class="text-center"></b-th>
          <b-th class="text-center"></b-th>
          <b-th class="text-center"></b-th>
          <b-th class="text-center"></b-th>
          <b-th class="text-center"></b-th>
          <b-th class="text-center"></b-th>
          <b-th class="text-center"></b-th>
          <b-th class="text-center align-middle" rowspan="2">合計</b-th>
          <b-th class="text-center align-middle" rowspan="2">伙食津貼</b-th>
          <b-th class="text-center align-middle" rowspan="2">應領金額</b-th>
          <b-th class="text-center align-middle" rowspan="2">退休金提撥</b-th>
          <b-th class="text-center align-middle no-border" rowspan="2">備註</b-th>
        </b-tr>
        <b-tr class="adjust-sticky-tr">
          <b-th data-item="固定薪資" class="text-center">薪俸</b-th>
          <b-th data-item="固定薪資" class="text-center">特殊津貼</b-th>
          <b-th data-item="" class="text-center">夜值津貼</b-th>
          <b-th data-item="" class="text-center">一人2車保管津貼</b-th>
          <b-th data-item="" class="text-center">里程補貼</b-th>
          <b-th data-item="各種津貼獎金" class="text-center">假日加班費</b-th>
          <b-th data-item="各種津貼獎金" class="text-center">休息日加班費</b-th>
          <b-th data-item="各種津貼獎金" class="text-center">加班里程獎金</b-th>
          <b-th data-item="各種津貼獎金" class="text-center">加班區域津貼</b-th>
          <b-th data-item="各種津貼獎金" class="text-center">平日里程獎金</b-th>
          <b-th data-item="各種津貼獎金" class="text-center">平日區域津貼</b-th>
          <b-th data-item="各種津貼獎金" class="text-center">特休津貼</b-th>
          <b-th data-item="各種津貼獎金" class="text-center">未補休津貼</b-th>
          <b-th data-item="各種津貼獎金" class="text-center">交通費補貼</b-th>
          <b-th data-item="各種津貼獎金" class="text-center">活動配合獎金</b-th>
          <b-th data-item="各種津貼獎金" class="text-center">季獎金</b-th>
          <b-th data-item="各種津貼獎金" class="text-center">其他奬金</b-th>
          <b-th data-item="各種津貼獎金" class="text-center">小費</b-th>
          <b-th data-item="各種津貼獎金" class="text-center">旅費</b-th>
          <b-th data-item="" class="text-center">教育補助費</b-th>
          <b-th data-item="" class="text-center">年終獎金</b-th>
          <b-th data-item="" class="text-center">慰問金</b-th>
          <b-th data-item="" class="text-center">資遣費</b-th>
          <b-th data-item="" class="text-center">旅遊代金</b-th>
          <b-th data-item="" class="text-center">其他一</b-th>
          <b-th data-item="" class="text-center">其他二</b-th>
          <b-th data-item="" class="text-center">事假</b-th>
          <b-th data-item="" class="text-center">病假</b-th>
          <b-th data-item="" class="text-center">曠職</b-th>
        </b-tr>
      </b-thead>
      <b-tbody>
        <template v-for="(item, index) in pageTable">
          <b-tr :key="index">
            <b-td class="text-center" sticky-column>{{ item.姓名 }}</b-td>
            <b-td data-item="固定薪資" class="text-center">{{ item.薪俸 | thousandsComma }}</b-td>
            <b-td data-item="固定薪資" class="text-right">{{ item.特殊津貼 | thousandsComma }}</b-td>
            <b-td data-item="" class="text-right">{{ item.夜值津貼 | thousandsComma }}</b-td>
            <b-td data-item="" class="text-right">{{ item['一人2車津貼'] | thousandsComma }}</b-td>
            <b-td data-item="" class="text-right">{{ item.里程補貼 | thousandsComma }}</b-td>
            <b-td data-item="各種津貼獎金" class="text-right">{{ item.假日加班費 | thousandsCommaOrHyphen }}</b-td>
            <b-td data-item="各種津貼獎金" class="text-right">{{ item.休息日加班費 | thousandsCommaOrHyphen }}</b-td>
            <b-td data-item="各種津貼獎金" class="text-right">{{ item.加班里程獎金 | thousandsCommaOrHyphen }}</b-td>
            <b-td data-item="各種津貼獎金" class="text-right">{{ item.加班區域津貼 | thousandsCommaOrHyphen }}</b-td>
            <b-td data-item="各種津貼獎金" class="text-right">{{ item.平日里程獎金 | thousandsCommaOrHyphen }}</b-td>
            <b-td data-item="各種津貼獎金" class="text-right">{{ item.平日區域津貼 | thousandsCommaOrHyphen }}</b-td>
            <b-td data-item="各種津貼獎金" class="text-right">{{ item.未休特別休假工資 | thousandsComma }}</b-td>
            <b-td data-item="各種津貼獎金" class="text-right">{{ item.屆期未補休折發工資 | thousandsComma }}</b-td>
            <b-td data-item="各種津貼獎金" class="text-right">{{ item.交通費補貼 | thousandsComma }}</b-td>
            <b-td data-item="各種津貼獎金" class="text-right">{{ item.加班車津貼 | thousandsComma }}</b-td>
            <b-td data-item="各種津貼獎金" class="text-right">{{ item.季獎金 | thousandsComma }}</b-td>
            <b-td data-item="各種津貼獎金" class="text-right">{{ item.其他非勤務所得獎金 | thousandsComma }}</b-td>
            <b-td data-item="各種津貼獎金" class="text-right">{{ item.小費 | thousandsComma }}</b-td>
            <b-td data-item="各種津貼獎金" class="text-right">{{ item.旅費 | thousandsComma }}</b-td>
            <b-td data-item="" class="text-right">{{ item.教育補助費 | thousandsComma }}</b-td>
            <b-td data-item="" class="text-right">{{ item.年終獎金 | thousandsComma }}</b-td>
            <b-td data-item="" class="text-right">{{ item.慰問金 | thousandsComma }}</b-td>
            <b-td data-item="" class="text-right">{{ item.資遣費 | thousandsComma }}</b-td>
            <b-td data-item="" class="text-right">{{ item.旅遊代金 | thousandsComma }}</b-td>
            <b-td data-item="" class="text-right">{{ item.其他一 | thousandsComma }}</b-td>
            <b-td data-item="" class="text-right">{{ item.其他二 | thousandsComma }}</b-td>
            <b-td data-item="" class="text-right">{{ item.事假金額 | thousandsComma }}</b-td>
            <b-td data-item="" class="text-right">{{ item.病假金額 | thousandsComma }}</b-td>
            <b-td data-item="" class="text-right">{{ item.曠職金額 | thousandsComma }}</b-td>
            <b-td data-item="合計" class="text-right">{{ item.合計 | thousandsComma }}</b-td>
            <b-th data-item="伙食津貼" class="text-right">{{ item.伙食津貼 | thousandsComma }}</b-th>
            <b-th data-item="應領金額" class="text-right">{{ item.應領金額 | thousandsComma }}</b-th>
            <b-th data-item="退休金提撥" class="text-right">{{ item.公司提撥勞工退休金 | thousandsComma }}</b-th>
            <b-th data-item="備註" class="text-right no-border">{{ item.備註 }}</b-th>
          </b-tr>
        </template>
      </b-tbody>
      <b-tfoot>
        <b-tr>
          <b-td variant="secondary" class="text-right" rowspan="2" sticky-column>小計：</b-td>
          <b-td variant="secondary" data-item="固定薪資" class="text-right" rowspan="2">{{ pageTable.reduce((a, b) => a + b['薪俸'], 0) | thousandsComma }}</b-td>
          <b-td variant="secondary" data-item="固定薪資" class="text-right" rowspan="2">{{ pageTable.reduce((a, b) => a + b['特殊津貼'], 0) | thousandsComma }}</b-td>
          <b-td variant="secondary" data-item="" class="text-right" rowspan="2">{{ pageTable.reduce((a, b) => a + b['夜值津貼'], 0) | thousandsComma }}</b-td>
          <b-td variant="secondary" data-item="" class="text-right" rowspan="2">{{ pageTable.reduce((a, b) => a + b['一人2車津貼'], 0) | thousandsComma }}</b-td>
          <b-td variant="secondary" data-item="" class="text-right" rowspan="2">{{ pageTable.reduce((a, b) => a + b['里程補貼'], 0) | thousandsComma }}</b-td>
          <b-td variant="secondary" data-item="各種津貼獎金" class="text-right" rowspan="2">{{ pageTable.reduce((a, b) => a + b['假日加班費'], 0) | thousandsComma }}</b-td>
          <b-td variant="secondary" data-item="各種津貼獎金" class="text-right" rowspan="2">{{ pageTable.reduce((a, b) => a + b['休息日加班費'], 0) | thousandsComma }}</b-td>
          <b-td variant="secondary" data-item="各種津貼獎金" class="text-right" rowspan="2">{{ pageTable.reduce((a, b) => a + b['加班里程獎金'], 0) | thousandsComma }}</b-td>
          <b-td variant="secondary" data-item="各種津貼獎金" class="text-right" rowspan="2">{{ pageTable.reduce((a, b) => a + b['加班區域津貼'], 0) | thousandsComma }}</b-td>
          <b-td variant="secondary" data-item="各種津貼獎金" class="text-right" rowspan="2">{{ pageTable.reduce((a, b) => a + b['平日里程獎金'], 0) | thousandsComma }}</b-td>
          <b-td variant="secondary" data-item="各種津貼獎金" class="text-right" rowspan="2">{{ pageTable.reduce((a, b) => a + b['平日區域津貼'], 0) | thousandsComma }}</b-td>
          <b-td variant="secondary" data-item="各種津貼獎金" class="text-right">{{ pageTable.reduce((a, b) => a + b['未休特別休假工資'], 0) | thousandsComma }}</b-td>
          <b-td variant="secondary" data-item="各種津貼獎金" class="text-right">{{ pageTable.reduce((a, b) => a + b['屆期未補休折發工資'], 0) | thousandsComma }}</b-td>
          <b-td variant="secondary" data-item="各種津貼獎金" class="text-right">{{ pageTable.reduce((a, b) => a + b['交通費補貼'], 0) | thousandsComma }}</b-td>
          <b-td variant="secondary" data-item="各種津貼獎金" class="text-right">{{ pageTable.reduce((a, b) => a + b['加班車津貼'], 0) | thousandsComma }}</b-td>
          <b-td variant="secondary" data-item="各種津貼獎金" class="text-right">{{ pageTable.reduce((a, b) => a + b['季獎金'], 0) | thousandsComma }}</b-td>
          <b-td variant="secondary" data-item="各種津貼獎金" class="text-right">{{ pageTable.reduce((a, b) => a + b['其他非勤務所得獎金'], 0) | thousandsComma }}</b-td>
          <b-td variant="secondary" data-item="各種津貼獎金" class="text-right">{{ pageTable.reduce((a, b) => a + b['小費'], 0) | thousandsComma }}</b-td>
          <b-td variant="secondary" data-item="各種津貼獎金" class="text-right">{{ pageTable.reduce((a, b) => a + b['旅費'], 0) | thousandsComma }}</b-td>
          <b-td variant="secondary" data-item="" class="text-right">{{ pageTable.reduce((a, b) => a + b['教育補助費'], 0) | thousandsComma }}</b-td>
          <b-td variant="secondary" data-item="" class="text-right">{{ pageTable.reduce((a, b) => a + b['年終獎金'], 0) | thousandsComma }}</b-td>
          <b-td variant="secondary" data-item="" class="text-right">{{ pageTable.reduce((a, b) => a + b['慰問金'], 0) | thousandsComma }}</b-td>
          <b-td variant="secondary" data-item="" class="text-right">{{ pageTable.reduce((a, b) => a + b['資遣費'], 0) | thousandsComma }}</b-td>
          <b-td variant="secondary" data-item="" class="text-right">{{ pageTable.reduce((a, b) => a + b['旅遊代金'], 0) | thousandsComma }}</b-td>
          <b-td variant="secondary" data-item="" class="text-right">{{ pageTable.reduce((a, b) => a + b['其他一'], 0) | thousandsComma }}</b-td>
          <b-td variant="secondary" data-item="" class="text-right">{{ pageTable.reduce((a, b) => a + b['其他二'], 0) | thousandsComma }}</b-td>
          <b-td variant="secondary" data-item="" class="text-right">{{ pageTable.reduce((a, b) => a + b['事假金額'], 0) | thousandsComma }}</b-td>
          <b-td variant="secondary" data-item="" class="text-right">{{ pageTable.reduce((a, b) => a + b['病假金額'], 0) | thousandsComma }}</b-td>
          <b-td variant="secondary" data-item="" class="text-right">{{ pageTable.reduce((a, b) => a + b['曠職金額'], 0) | thousandsComma }}</b-td>
          <b-td variant="secondary" data-item="合計" class="text-right" rowspan="2">{{ pageTable.reduce((a, b) => a + b['合計'], 0) | thousandsComma }}</b-td>
          <b-td variant="secondary" data-item="伙食津貼" class="text-right" rowspan="2">{{ pageTable.reduce((a, b) => a + b['伙食津貼'], 0) | thousandsComma }}</b-td>
          <b-td variant="secondary" data-item="應領金額" class="text-right" rowspan="2">{{ pageTable.reduce((a, b) => a + b['應領金額'], 0) | thousandsComma }}</b-td>
          <b-td variant="secondary" data-item="退休金提撥" class="text-right" rowspan="2">{{ pageTable.reduce((a, b) => a + b['公司提撥勞工退休金'], 0) | thousandsComma }}</b-td>
        </b-tr>
      </b-tfoot>
    </b-table-simple>

    <div class="d-flex justify-content-center p-2" ref="tablePagination">
      <b-pagination-nav
        pills
        use-router
        v-model="tableSettings.currentPage"
        :link-gen="linkGen"
        :number-of-pages="pageAmount"
        first-text="首頁"
        prev-text="前一頁"
        next-text="下一頁"
        last-text="末頁"
        class="m-0"
      >
      </b-pagination-nav>
    </div>
  </div>
</template>

<script>
export default {
  name: 'CompensationReportTable',
  props: {
    Table: Object,
    containerHeight: Number,
  },
  data() {
    return {
      isMounted: false,
      tableSettings: {
        perPage: 13,
        currentPage: 1,
        baseHeight: 200,
      },
      pageContent: [],
    };
  },
  mounted() {
    this.isMounted = true;
  },
  filters: {
    thousandsComma(value) {
      const n = Number(value);

      const res = n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

      return res === '0' ? '' : res;
    },
    thousandsCommaOrHyphen(value) {
      const n = Number(value);

      if (n === 0) return '-';

      return n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    },
  },
  watch: {
    Table: {
      handler() {
        // 資料改變時，重置當前頁面、重組資料
        this.tableSettings.currentPage = 1;
        this.PageContent();
      },
      deep: true,
    },
  },
  computed: {
    tableHeight() {
      if (!this.isMounted) return this.tableSettings.baseHeight;

      const Pagination = this.$refs.tablePagination.clientHeight;

      const res = this.containerHeight - Pagination - 90;

      return res > this.tableSettings.baseHeight
        ? res
        : this.tableSettings.baseHeight;
    },
    pageAmount() {
      return this.pageContent.length || 1;
    },
    pageTable() {
      return this.pageContent[this.tableSettings.currentPage - 1] || [];
    },
  },
  methods: {
    PageContent() {
      const data = JSON.parse(JSON.stringify(this.Table.items));

      if (!data) {
        this.pageContent = [];
        return;
      }

      // 以此部門陣列 ['遊覽車', '班車', '契約'] 為順序分組資料
      // 存放分頁完成的表格資料
      const result = [];

      // 處理遊覽車
      // 須以 '尤耀宗', '章金龍', '黃秋欽', '蔡崇正' 的順序排列，為處理例外重新給seq為 -4 ~ -1;
      const tour = data.filter(item => item.dept === '遊覽車');

      tour.forEach((item) => {
        const temp = item;
        if (temp.姓名 === '尤耀宗') temp.seq = -4;
        if (temp.姓名 === '章金龍') temp.seq = -3;
        if (temp.姓名 === '黃秋欽') temp.seq = -2;
        if (temp.姓名 === '蔡崇正') temp.seq = -1;
      });

      tour.sort((a, b) => {
        const res = a.seq - b.seq;
        return res || 0;
      });

      // 一頁表格最多顯示13行
      for (let i = 0, len = tour.length; i < len; i += 13) {
        result.push(tour.slice(i, i + 13));
      }

      // 處理班車
      const shuttle = data.filter(item => item.dept === '班車')
        .sort((a, b) => {
          const res = a.seq - b.seq;
          return res || 0;
        });

      for (let i = 0, len = shuttle.length; i < len; i += 13) {
        result.push(shuttle.slice(i, i + 13));
      }

      // 處理契約
      const contract = data.filter(item => item.dept === '契約')
        .sort((a, b) => {
          const res = a.seq - b.seq;
          return res || 0;
        });

      for (let i = 0, len = contract.length; i < len; i += 13) {
        result.push(contract.slice(i, i + 13));
      }

      this.pageContent = result;

      // return result[this.tableSettings.currentPage - 1];
    },
    linkGen() {
      return { path: '/salary-management/salary-statement' };
    },
  },
};
</script>

<style lang="scss" scoped>
.fix-sm-height {
  height: 26px;
}

.no-border {
  border: none;
}

.column-sticky-right {
  position: sticky;
  top: 0;
  z-index: 2;
}

.adjust-sticky-tr > th {
  top: 51px !important;
}
</style>
