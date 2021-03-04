<template>
  <div class="d-inline-block">
    <b-button
      squared
      class="container-border"
      variant="primary"
      @click="DownloadCsv"
    >匯出</b-button>
  </div>
</template>

<script>
import ExportCSVFile from '@/components/table/_tool/ExportCSVFile';

export default {
  name: 'TabExport',
  props: {
    tabItems: Array,
    tabIndex: Number,
    Table: Object,
    ImportListFormat: Object,
  },
  data() {
    return {

    };
  },
  methods: {
    DownloadCsv() {
      if (!this.Table.items || !this.Table.items.length) return;

      const fileTitle = `${this.tabItems[this.tabIndex].display}_${this.$moment().format(
        'YYYY-MM-DD HH:mm:ss',
      )}`;

      const fieldSetName = this.tabItems[this.tabIndex].name;

      const items = JSON.parse(JSON.stringify(this.Table.items));

      const header = this.ImportListFormat[`${fieldSetName}`].reduce((a, c) => {
        const temp = a;
        temp[c.key] = c.displayName;
        return temp;
      }, {});

      ExportCSVFile(fileTitle, items, header);
    },
  },
};
</script>

<style lang="scss" scoped>
</style>
