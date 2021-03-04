<template>
  <div class="btn btn-primary container-border rounded-0" v-if="hasExport" v-on:click="DownloadCsv">匯出</div>
</template>

<script>
import ExportCSVFile from '@/components/table/_tool/ExportCSVFile';

export default {
  props: {
    fields: Array,
    items: Array,
  },
  computed: {
    hasExport() {
      if (this.$route.name === '班表管理') {
        return false;
      }

      return true;
    },
  },
  methods: {
    DownloadCsv() {
      if (!this.items || !this.items.length) return;

      const fileTitle = `${this.$route.name}_${this.$moment().format(
        'YYYY-MM-DD HH:mm:ss',
      )}`;

      const items = JSON.parse(JSON.stringify(this.items));

      const header = this.fields
        .filter(item => !item.customize || item.customize.exportable !== false)
        .reduce((a, c) => {
          const temp = a;
          temp[c.key] = c.label;
          return temp;
        }, {});

      ExportCSVFile(fileTitle, items, header);
    },
  },
};
</script>
