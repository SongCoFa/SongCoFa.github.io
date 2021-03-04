<template>
  <b-button variant="primary" size="sm" class="mr-1" @click="DownloadCsv">匯出</b-button>
</template>

<script>
import ExportShiftCSVFile from '@/components/table/_tool/ExportShiftCSVFile';

export default {
  props: {
    ExportColumn: Array,
    tableData: Array,
  },
  methods: {
    DownloadCsv() {
      const employeeList = this.$store.getters['DriverList/driversRawData'];

      if (!this.tableData || !this.tableData.length) return;

      const fileTitle = `仕業資料_${this.$moment().format(
        'YYYY-MM-DD HH:mm:ss',
      )}`;

      const items = JSON.parse(JSON.stringify(this.tableData));

      items.forEach((item) => {
        const $item = item;
        employeeList.forEach((employee) => {
          if ($item.emp_ID === employee.emp_ID) {
            $item.emp_Name = employee.emp_name;
          }
        });
      });

      const header = this.ExportColumn.reduce((a, c) => {
        const temp = a;
        temp[c.key] = c.label;
        return temp;
      }, {});

      ExportShiftCSVFile(fileTitle, items, header);
    },
  },
};
</script>
