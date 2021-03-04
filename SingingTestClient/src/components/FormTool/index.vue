<template>
  <b-row class="d-flex flex-row flex-grow-1 overflow-hidden" no-gutters ref="formPanel">
    <b-col cols="3" class="flex-grow-1 h-100 bg-light left-area">
      <b-list-group class="h-100 overflow-auto">
        <b-list-group-item class="rounded-0 bg-dark p-0 query-list">
          <div class="text-center query-list-check">
            <b-form-checkbox style="padding-left: 2rem" @input="checkAll"></b-form-checkbox>
          </div>
          <div class="text-center text-light query-list-display">(員工編號)姓名</div>
        </b-list-group-item>
        <b-list-group-item class="rounded-0 p-0 query-list" v-for="(item, key) in driverList" :key="key">
          <div class="text-center query-list-check">
            <b-form-checkbox style="padding-left: 2rem" v-model="checkedEmploayee" :value="item.emp_ID"></b-form-checkbox>
          </div>
          <div class="text-center query-list-display">{{ `(${item.emp_ID})${item.emp_name}` }}</div>
        </b-list-group-item>
      </b-list-group>
    </b-col>
    <b-col cols="9" class="flex-grow-1 h-100 bg-light right-area overflow-auto p-2">
      <div class="loading-layer" v-if="loading">
        <div class="loading-spinner">
          <b-spinner variant="primary" label="載入中..."></b-spinner>
        </div>
        <div style="background-color: #00a199;color: whitesmoke; text-align:center;">系統轉檔中，請稍候。</div>
      </div>
      <div class="loading-layer" v-if="!loading && !showdata">
        <div class="loading-spinner">
          <div style="background-color: #00a199;color: whitesmoke;text-align:center;">系統忙碌中轉檔失敗，請稍後再重新列印。</div>
        </div>
      </div>
      <!-- <iframe
        ref="pdfContainer"
        class="file"
        width="100%"
        :src="`http://www.fmsbolymin.com.tw:610/singing-web-client/pdfjs/web/viewer.html?file=${pdfURL}`"
        frameborder="0"
        allowfullscreen=""
        webkitallowfullscreen=""
      ></iframe> -->
      <iframe
        v-if="pdfURL === null"
        class="file"
        width="100%"
        :src="`http://www.fmsbolymin.com.tw:610/SingingTestClient/pdfjs/web/viewer.html`"
        frameborder="0"
      ></iframe>
      <iframe
        v-else-if="showdata"
        class="file"
        width="100%"
        :src="`http://www.fmsbolymin.com.tw:610/SingingTestClient/pdfjs/web/viewer.html?file=${pdfURL}`"
        frameborder="0"
      ></iframe>
    </b-col>
  </b-row>
</template>
<script>
export default {
  name: 'FormTool',
  components: {
  },
  props: {
    Table: Object,
    FormType: String,
    queriedData: Object,
    includeVocation: Boolean,
  },
  data() {
    return {
      checkedEmploayee: [],

      data: null,
      pdfURL: null,
      compensionPdfURL: '',

      loading: false,
      showdata: true,
      PDF: null,
      pageRendering: false,
      testing: true,
    };
  },
  watch: {
    queriedData: {
      handler() {
        this.checkedEmploayee = [];
      },
      deep: true,
    },
    loading(newValue) {
      this.$emit('fileProcessing', newValue);
    },
  },
  computed: {
    driverList() {
      if (this.FormType === 'VoucherListForm' || this.FormType === 'VoucherForm') {
        if (this.includeVocation === false) {
          return this.Table.items.filter(item => item.amount > 0 && item.leave_flag === '0');
        }
        return this.Table.items.filter(item => item.amount > 0);
      }

      return this.Table.items;
    },
  },
  methods: {
    uncheckAll() {
      this.checkedEmploayee = [];
    },
    checkAll(event) {
      if (!event) {
        this.checkedEmploayee = [];
      } else {
        this.checkedEmploayee = [];
        this.Table.items.forEach((item) => {
          this.checkedEmploayee.push(item.emp_ID);
        });
      }
    },
    printPDF() {
      // FIXME: 重構：當選擇不一樣的表單就請求各自的API
      const send = [];
      const list = this.checkedEmploayee;

      if (list.length === 0) {
        alert('請選擇員工');
        return;
      }

      list.forEach((i) => {
        const temp = {};
        temp.start_date = this.queriedData.input.start_date;
        temp.end_date = this.queriedData.input.end_date;
        temp.emp_ID_name = i;
        temp.include_vocation = this.includeVocation ? '1' : '0';

        send.push(temp);
      });

      const form = this.FormType;

      this.loading = true;
      this.pdfURL = null;
      this.showdata = false;

      // console.log(send);

      // const pdfjsframe = this.$refs.pdfContainer;
      // eslint-disable-next-line func-names
      // pdfjsframe.onchange = function () {
      //   const pdfData = this.base64ToUint8Array('');
      //   pdfjsframe.contentWindow.PDFViewerApplication.open(pdfData);
      // };

      if (form === 'VoucherListForm') {
        this.$http.post(`${process.env.VUE_APP_BASE_API}/api/print/PrintVoucherList`, send, { timeout: 600000 })
          .then((response) => {
            // console.log(response.data);
            const bin = response.data.Resource;
            if (response.data.IsSuccess === false || typeof bin === 'undefined') {
              this.pdfURL = null;
              alert(bin);
              this.getErrorTime();
            } else {
              // 1. way
              /*
                const file = this.base64toBlob(response.data.Resource, 'application/pdf');
                const url = window.URL.createObjectURL(file);
                this.pdfURL = url;
              */

              // 2. way
              /* create blob 但 viewer.html 不能讀 createObjectURL，所以棄用
                const file = this.base64toBlob(response.data.Resource, 'application/pdf');
                const url = window.URL.createObjectURL(file);
                const urlStr = `http://www.fmsbolymin.com.tw:610/singing-web-client/pdfjs/web/viewer.html?file=${url}`;
              */

              // 3. way
              // wont success in different domain include localhost
              // const pdfData = this.base64ToUint8Array(bin);
              // pdfjsframe.contentWindow.PDFViewerApplication.open(pdfData);

              // 4. way
              console.log(this.testing);
              if (this.testing === true && response.data.IsSuccess) {
                this.pdfURL = 'http://www.fmsbolymin.com.tw:610/SingingTestClient/pdf/Result_班車行駛路線表.pdf';
                this.showdata = true;
              } else if (response.data.IsSuccess) {
                this.pdfURL = 'http://www.fmsbolymin.com.tw:610/singing-web-client/pdf/Result_班車行駛路線表.pdf';
                this.showdata = true;
              }
              // this.pdfURL = 'http://www.fmsbolymin.com.tw:610/SingingTestClient/pdf/Result_班車行駛路線表.pdf';

              // ---正式---
              // this.pdfURL = 'http://www.fmsbolymin.com.tw:610/singing-web-client/pdf/Result_班車行駛路線表.pdf';
            }

            this.loading = false;
          })
          .catch((e) => {
            console.log(e);
            this.getErrorTime();
            this.loading = false;
          });
      } else if (form === 'VoucherForm') {
        this.$http.post(`${process.env.VUE_APP_BASE_API}/api/print/PrintVoucher`, send, { timeout: 600000 })
          .then((response) => {
            console.log(response.data);
            const bin = response.data.Resource;
            if (response.data.IsSuccess === false || typeof bin === 'undefined') {
              this.pdfURL = null;
              alert(bin);
              this.getErrorTime();
            } else {
              console.log(this.testing);
              if (this.testing === true) {
                this.pdfURL = 'http://www.fmsbolymin.com.tw:610/SingingTestClient/pdf/Result.pdf';
                this.showdata = true;
              } else {
                this.pdfURL = 'http://www.fmsbolymin.com.tw:610/singing-web-client/pdf/Result.pdf';
                this.showdata = true;
              }
              // ---測試---
              // this.pdfURL = 'http://www.fmsbolymin.com.tw:610/SingingTestClient/pdf/Result.pdf';

              // ---正式---
              // this.pdfURL = 'http://www.fmsbolymin.com.tw:610/singing-web-client/pdf/Result.pdf';
            }

            this.loading = false;
          })
          .catch((e) => {
            console.log(e);
            this.getErrorTime();
            this.loading = false;
          });
      } else {
        alert('無該種表單');
      }
    },
    async downloadWord() {
      const send = [];
      const list = this.checkedEmploayee;

      if (list.length === 0) {
        alert('請選擇員工');
        return;
      }

      list.forEach((i) => {
        const temp = {};
        temp.start_date = this.queriedData.input.start_date;
        temp.end_date = this.queriedData.input.end_date;
        temp.emp_ID_name = i;
        temp.include_vocation = this.includeVocation ? '1' : '0';

        send.push(temp);
      });

      const form = this.FormType;

      this.loading = true;

      let api = '';
      const pre = 'data:application/vnd.openxmlformats-officedocument.wordprocessingml.document;base64,';
      let file = '';
      const today = this.$moment().format('YYYY-MM-DD');
      let filetitle = '';
      const link = document.createElement('a');


      if (form === 'VoucherListForm') {
        api = `${process.env.VUE_APP_BASE_API}/api/print/VoucherListToWord`;
        filetitle = `${today}_班車行駛路程表`;
      } else if (form === 'VoucherForm') {
        api = `${process.env.VUE_APP_BASE_API}/api/print/VoucherToWord`;
        filetitle = `${today}_行車憑單`;
      } else {
        this.loading = false;

        alert('無該種表單');
      }

      const base64str = await this.$http.post(api, send, { timeout: 600000 })
        .then((response) => {
          console.log(response.data.Resource);
          return response.data.Resource;
        })
        .catch(error => console.log(error));

      this.loading = false;

      file = pre + base64str;
      link.setAttribute('href', file);
      link.setAttribute('download', `${filetitle}.docx`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    printPDFV2() {
      // FIXME: 可以傳入條件陣列

      const list = this.checkedEmploayee;

      if (list.length === 0) {
        alert('請選擇員工');
        return;
      }

      const conditions = [];

      list.forEach((i) => {
        const temp = {};
        temp.year = this.queriedData.input.year;
        temp.month = this.queriedData.input.month;
        temp.emp_ID = i;

        conditions.push(temp);
      });

      this.loading = true;
      this.pdfURL = null;
      this.showdata = false;
      // console.log(conditions);

      this.$http.post(`${process.env.VUE_APP_BASE_API}/api/Compensation/PrintPayroll`, conditions)
          .then((response) => {
            // console.log(response.data);
            const bin = response.data.Resource;
            if (response.data.IsSuccess === false || typeof bin === 'undefined') {
              this.pdfURL = null;
              alert(bin);
              this.getErrorTime();
            } else {
                console.log('test');
               if (this.testing === true) {
                this.pdfURL = 'http://www.fmsbolymin.com.tw:610/SingingTestClient/pdf/薪津表.pdf';
                this.showdata = true;
              } else {
                this.pdfURL = 'http://www.fmsbolymin.com.tw:610/singing-web-client/pdf/薪津表.pdf';
                this.showdata = true;
              }
            }

            this.loading = false;
          })
          .catch((e) => {
            console.log(e);
            this.getErrorTime();
            this.loading = false;
          });
    },
    async downloadExcel() {
      const send = [];
      const list = this.checkedEmploayee;

      if (list.length === 0) {
        alert('請選擇員工');
        return;
      }

      list.forEach((i) => {
        const temp = {};
        temp.year = this.queriedData.input.year;
        temp.month = this.queriedData.input.month;
        temp.emp_ID = i;

        send.push(temp);
      });

      // console.log(send);

      this.loading = true;

      const base64str = await this.$http.post(`${process.env.VUE_APP_BASE_API}/api/Compensation/PayrollToExcel`, send)
        .then((response) => {
          console.log(response.data.Resource);
          return response.data.Resource;
        })
        .catch(error => console.log(error));

      const pre = 'data:application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;base64,';
      let file = '';
      const filetitle = '薪津表';
      const link = document.createElement('a');

      this.loading = false;

      file = pre + base64str;
      link.setAttribute('href', file);
      link.setAttribute('download', `${filetitle}.xlsx`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    },
    convertDataURLToBinary(dataURL) {
      const BASE64_MARKER = ';base64,';
      const base64Index = dataURL.indexOf(BASE64_MARKER) + BASE64_MARKER.length;
      const base64 = dataURL.substring(base64Index);
      const raw = window.atob(base64);
      const rawLength = raw.length;
      const array = new Uint8Array(new ArrayBuffer(rawLength));

      for (let i = 0; i < rawLength; i++) {
        array[i] = raw.charCodeAt(i);
      }

      return array;
    },
    base64ToUint8Array(base64) {
      const raw = atob(base64);
      const uint8Array = new Uint8Array(raw.length);
      for (let i = 0; i < raw.length; i++) {
        uint8Array[i] = raw.charCodeAt(i);
      }
      return uint8Array;
    },
    base64toBlob(b64Data, contentType, sliceSize) {
      // eslint-disable-next-line no-param-reassign
      contentType = contentType || '';
      // eslint-disable-next-line no-param-reassign
      sliceSize = sliceSize || 512;

      const byteCharacters = atob(b64Data);
      const byteArrays = [];

      for (let offset = 0; offset < byteCharacters.length; offset += sliceSize) {
          const slice = byteCharacters.slice(offset, offset + sliceSize);

          const byteNumbers = new Array(slice.length);
          for (let i = 0; i < slice.length; i++) {
              byteNumbers[i] = slice.charCodeAt(i);
          }

          const byteArray = new Uint8Array(byteNumbers);

          byteArrays.push(byteArray);
      }
      const blob = new Blob(byteArrays, { type: contentType });
      return blob;
    },
    getErrorTime() {
      const today = new Date();
      const timer = new Date().toLocaleTimeString('it-IT');
      const errorTime = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + '(' + timer + ')';
      alert(`${errorTime}系統忙碌中轉檔失敗，請稍等5分鐘後再重新列印`);
    },
  },
};
</script>

<style lang="scss" scoped>
#output {
  width: 100%;
  height: calc(100% - 8px);
  background: rgba(193, 193, 193, 1);
}

.left-area, .right-area {
  border: 1px solid #d0d0d0;
}

.query-list {
  display: flex;

  .query-list-check {
    padding: .75rem .2rem;
    border-right: 1px solid #8e8e8e;
  }

  .query-list-display {
    width: 100%;
    padding: .75rem;
  }
}

.loading-layer {
  position: absolute;
  z-index: 9999;
  height: 100%;
  width: 100%;
  background-color: rgba(0, 0, 0, 0.2);

  .loading-spinner {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
}
</style>

<style scoped>
.file{
  display: block;
  height: 100%;
}
</style>
