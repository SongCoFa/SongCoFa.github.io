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
          <b-th class="text-center" sticky-column>姓名</b-th>
          <b-th class="text-center">應領金額</b-th>
          <b-th class="text-center">福利費</b-th>
          <b-th class="text-center">暫借款</b-th>
          <b-th class="text-center">薪資所得稅</b-th>
          <b-th class="text-center">勞保費</b-th>
          <b-th class="text-center">健保費</b-th>
          <b-th class="text-center">勞退自提</b-th>
          <b-th class="text-center">保險費</b-th>
          <b-th class="text-center">出險保險費協議分攤</b-th>
          <b-th class="text-center">雜費</b-th>
          <b-th class="text-center">補充保費</b-th>
          <b-th class="text-center">執行命令代扣款</b-th>
          <b-th class="text-center">暫付款</b-th>
          <b-th class="text-center">車損協議分攤</b-th>
          <b-th class="text-center">肇事和解分攤</b-th>
          <b-th class="text-center">合計</b-th>
          <b-th class="text-center">實得金額</b-th>
        </b-tr>
      </b-thead>
      <b-tbody>
        <template v-for="(item, index) in pageTable">
          <b-tr :key="index">
            <b-td class="text-center" sticky-column>{{ item.姓名 }}</b-td>
            <b-td class="text-right">{{ item.應領金額 | thousandsComma }}</b-td>
            <b-td class="text-right">{{ item.福利費 | thousandsComma }}</b-td>
            <b-td class="text-right">{{ item.暫借款 | thousandsComma }}</b-td>
            <b-td class="text-right">{{ item.薪資所得稅 | thousandsComma }}</b-td>
            <b-td class="text-right">{{ item.勞保費 | thousandsComma }}</b-td>
            <b-td class="text-right">{{ item.健保費 | thousandsComma }}</b-td>
            <b-td class="text-right">{{ item.勞退自提 | thousandsComma }}</b-td>
            <b-td class="text-right">{{ item.保險費 | thousandsComma }}</b-td>
            <b-td class="text-right">{{ item.保險費協議分擔 | thousandsComma }}</b-td>
            <b-td class="text-right">{{ item.雜費 | thousandsComma }}</b-td>
            <b-td class="text-right">{{ item.補充保費 | thousandsComma }}</b-td>
            <b-td class="text-right">{{ item.執行命令代扣款 | thousandsComma }}</b-td>
            <b-td class="text-right">{{ item.獎金紅包 | thousandsComma }}</b-td>
            <b-td class="text-right">{{ item.車損協議分擔 | thousandsComma }}</b-td>
            <b-td class="text-right">{{ item.肇事和解分擔 | thousandsComma }}</b-td>
            <b-td class="text-right">{{ item.合計 | thousandsComma }}</b-td>
            <b-td class="text-right">{{ item.實領金額 | thousandsComma }}</b-td>
          </b-tr>
        </template>
      </b-tbody>
      <b-tfoot>
        <b-tr>
          <b-td variant="secondary" class="text-right" sticky-column>小計：</b-td>
          <b-td variant="secondary" class="text-right">{{ pageTable.reduce((a, b) => a + b['應領金額'], 0) | thousandsComma }}</b-td>
          <b-td variant="secondary" class="text-right">{{ pageTable.reduce((a, b) => a + b['福利費'], 0) | thousandsComma }}</b-td>
          <b-td variant="secondary" class="text-right">{{ pageTable.reduce((a, b) => a + b['暫借款'], 0) | thousandsComma }}</b-td>
          <b-td variant="secondary" class="text-right">{{ pageTable.reduce((a, b) => a + b['薪資所得稅'], 0) | thousandsComma }}</b-td>
          <b-td variant="secondary" class="text-right">{{ pageTable.reduce((a, b) => a + b['勞保費'], 0) | thousandsComma }}</b-td>
          <b-td variant="secondary" class="text-right">{{ pageTable.reduce((a, b) => a + b['健保費'], 0) | thousandsComma }}</b-td>
          <b-td variant="secondary" class="text-right">{{ pageTable.reduce((a, b) => a + b['勞退自提'], 0) | thousandsComma }}</b-td>
          <b-td variant="secondary" class="text-right">{{ pageTable.reduce((a, b) => a + b['保險費'], 0) | thousandsComma }}</b-td>
          <b-td variant="secondary" class="text-right">{{ pageTable.reduce((a, b) => a + b['保險費協議分擔'], 0) | thousandsComma }}</b-td>
          <b-td variant="secondary" class="text-right">{{ pageTable.reduce((a, b) => a + b['雜費'], 0) | thousandsComma }}</b-td>
          <b-td variant="secondary" class="text-right">{{ pageTable.reduce((a, b) => a + b['補充保費'], 0) | thousandsComma }}</b-td>
          <b-td variant="secondary" class="text-right">{{ pageTable.reduce((a, b) => a + b['執行命令代扣款'], 0) | thousandsComma }}</b-td>
          <b-td variant="secondary" class="text-right">{{ pageTable.reduce((a, b) => a + b['獎金紅包'], 0) | thousandsComma }}</b-td>
          <b-td variant="secondary" class="text-right">{{ pageTable.reduce((a, b) => a + b['車損協議分擔'], 0) | thousandsComma }}</b-td>
          <b-td variant="secondary" class="text-right">{{ pageTable.reduce((a, b) => a + b['肇事和解分擔'], 0) | thousandsComma }}</b-td>
          <b-td variant="secondary" class="text-right">{{ pageTable.reduce((a, b) => a + b['合計'], 0) | thousandsComma }}</b-td>
          <b-td variant="secondary" class="text-right">{{ pageTable.reduce((a, b) => a + b['實領金額'], 0) | thousandsComma }}</b-td>
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
  name: 'WithholdingReportTable',
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
