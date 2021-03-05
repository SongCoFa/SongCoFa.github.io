<template>
  <div>
    <b-button
      squared
      class="container-border"
      variant="primary"
      :disabled="!writable"
      @click="init"
    >
      匯入
    </b-button>

    <b-modal
      ref="modal"
      centered
      scrollable
      header-class="modal-head-footer-color"
      footer-class="modal-head-footer-color"
      body-class="modal-body-color"
      hide-footer
    >
      <template v-slot:modal-title>
        {{ modalTitle }}
        <b-button size="sm" variant="outline-primary" @click="DownloadTemplate">模板下載</b-button>
      </template>

      <template v-if="!importFile">
        <div
          :class="['dropZone', dragging ? 'dropZone-over' : '']"
          @dragestart="dragging = true"
          @dragenter="dragging = true"
          @dragleave="dragging = false"
        >
          <div class="dropZone-info" @drag="onChange">
            <font-awesome-icon :icon="['fas','cloud-upload-alt']" />
            <span class="dropZone-title">拖曳或點擊上傳檔案</span>
            <div class="dropZone-upload-limit-info">支援格式： .csv</div>
          </div>
          <input type="file" accept=".csv" @change="onChange" />
        </div>
      </template>

      <div v-else class="dropZone-uploaded">
        <div class="dropZone-uploaded-info">
          <span class="dropZone-title">已上傳</span>
          <button type="button" class="btn btn-primary removeFile" @click="removeFile">移除檔案</button>
        </div>
      </div>

      <div class="uploadedFile-info" v-if="importFile">
        <div>檔案名稱 : {{ importFile.name }}</div>
        <div>檔案大小(字節) : {{ importFile.size }}</div>
        <div>檔案格式 : {{ extension }}</div>
        <b-button variant="outline-primary" @click="excuteFileParse">檔案解析</b-button>
        <b-button v-if="loadFileInner" variant="outline-primary ml-2" @click="excuteDataUpdate">匯入</b-button>
      </div>
      <div v-if="loadFileInner" class="file-preview">
        <pre>{{ loadFileInner }}</pre>
      </div>
    </b-modal>
  </div>
</template>

<script>
import ExportCSVFile from '@/components/table/_tool/ExportCSVFile';

const csvtojsonV2 = require('csvtojson');

export default {
  name: 'ImportWorkingHours',
  props: {
    ImportApi: String,
    dataNotUpdate: Boolean,
    writable: Boolean,
  },
  data() {
    return {
      componentName: '匯入',
      ImportListFormat: [],
      dragging: false,
      importFile: null,
      loadFileInner: null,
    };
  },
  computed: {
    modalTitle() {
      return `${this.$route.name}-${this.componentName}`;
    },
    extension() {
      return this.importFile ? this.importFile.name.split('.').pop() : '';
    },
  },
  methods: {
    async init() {
      const flag = await this.checkExcutable();

      if (!flag) return;

      this.removeFile();
      this.$refs.modal.show();

      // create dynamic template according to last month
      const year = this.$moment().add(-1, 'months').format('YYYY');
      const month = this.$moment().add(-1, 'months').format('MM');

      const days = new Date(year, month, 0).getDate();

      const result = [];

      for (let i = 1; i <= days; i++) {
        const obj = {};
        const day = (i < 10) ? `0${i}` : i;
        obj.key = `${year}-${month}-${day}`;
        obj.displayName = `${year}-${month}-${day}`;
        obj.exampleValue = '0';
        result.push(obj);
      }

      this.ImportListFormat = [{ key: 'emp_name', displayName: '駕駛姓名', exampleValue: '駕駛姓名' }, ...result];
    },
    DownloadTemplate() {
      const fileTitle = `${this.$route.name}-匯入參考模板`;

      const items = this.ImportListFormat.reduce((a, c) => {
        const temp = a;
        temp[c.displayName] = c.exampleValue;
        return temp;
      }, {});

      ExportCSVFile(fileTitle, [items]);
    },
    onChange(e) {
      const files = e.target.files || e.dataTransfer.files;
      if (!files.length) {
        this.dragging = false;
        return;
      }

      this.createFile(files[0]);
    },
    createFile(file) {
      if (!file.type.match('application/vnd.ms-excel')) {
        console.log('please select csv file');
        this.dragging = false;
        return;
      }

      this.importFile = file;

      this.dragging = false;
    },
    removeFile() {
      this.importFile = null;
      this.loadFileInner = null;
    },
    async excuteFileParse() {
      const fileData = await new Promise((resolve) => {
        const fr = new FileReader();
        fr.onload = () => resolve(fr.result);
        fr.readAsText(this.importFile, 'big5');
      });

      const data = await csvtojsonV2({
        // checkType: true,
        nullObject: true,
      }).fromString(fileData);

      // 去掉空白欄位自動產生的 field 欄位
      const convert = data.map((item) => {
        const row = item;
        return Object.keys(row).reduce((a, c) => {
          const temp = a;
          if (!c.startsWith('field')) {
            temp[`${c}`] = row[`${c}`];
          }
          return temp;
        }, {});
      });

      this.loadFileInner = convert;
    },
    async excuteDataUpdate() {
      // 查駕駛資料 要替換匯入的姓名為員編
      const driverList = await this.$http
        .post(`${process.env.VUE_APP_BASE_API}/api/driver/GetList`, { emp_ID: null, emp_name: null, dept: null })
        .then((response) => {
          const result = response.data.Resource.filter(item => item.title === '駕駛長');
          return result;
        })
        .catch(error => console.log(error));

      if (!driverList) {
        console.log('駕駛資料查找失敗');
        return;
      }

      const data = this.loadFileInner;

      // 查找員工姓名為ID, 找不到的另外提示且全部都不寫入
      const illegalName = [];

      data.map((row) => {
        const temp = row;
        const employee = driverList.filter(item => item.emp_name === row.駕駛姓名);
        if (employee.length > 0) {
          temp.emp_ID = employee[0].emp_ID;
        } else {
          illegalName.push(row.駕駛姓名);
          temp.emp_ID = '';
        }
        return temp;
      });

      if (illegalName.length > 0) {
        alert(`以下員工姓名： ${illegalName} 查找不到員編`);
        return;
      }

      const res = [];

      data.forEach((item) => {
        const name = item.駕駛姓名;
        const id = item.emp_ID;

        Object.keys(item).forEach((a) => {
          const obj = {};

          const dateCheck = this.$moment(a, 'YYYY/mm/dd').isValid();

          if (dateCheck) {
            obj.emp_ID = id;
            obj.emp_name = name;
            obj.date = a;
            obj.hours = item[`${a}`] === '' ? '0' : item[`${a}`];
            res.push(obj);
          }
        });
      });

      this.$http
        .post(this.ImportApi, res)
        .then((response) => {
          console.log(response.data);

          this.$refs.modal.hide();

          this.$bvModal.msgBoxOk(response.data.Resource.ReturnMessage, {
            size: 'sm',
            okTitle: '確定',
            centered: true,
          })
          .then(() => { this.$emit('refreshData'); })
          .catch(e => console.log(e));
        })
        .catch(e => console.log(e));
    },
    refreshData() {
      this.$emit('refreshData');
    },
    async checkExcutable() {
      if (this.dataNotUpdate) {
        const response = await this.$bvModal
          .msgBoxConfirm('有資料尚未更新，是否要繼續執行', {
            title: '訊息',
            size: 'sm',
            buttonSize: 'sm',
            okVariant: 'danger',
            okTitle: '繼續',
            cancelTitle: '取消',
            footerClass: 'p-2',
            hideHeaderClose: false,
            centered: true,
          })
          .then(value => value)
          .catch(e => console.log(e));

        return response;
      }

      return true;
    },
  },
};
</script>

<style lang="scss" scoped>
.file-preview {
  height: auto;
  max-height: 200px;
  overflow: auto;
  background-color: #eeeeee;
  word-break: normal !important;
  word-wrap: normal !important;
  white-space: pre !important;
}

.dropZone {
  height: 200px;
  position: relative;
  border: 2px dashed #00a199;
}

.dropZone:hover {
  border: 2px solid #2e94c4;
}

.dropZone:hover .dropZone-title {
  color: #1975a0;
}

.dropZone-info {
  color: #a8a8a8;
  position: absolute;
  top: 50%;
  width: 100%;
  transform: translate(0, -50%);
  text-align: center;
}

.dropZone-title {
  color: #787878;
}

.dropZone input {
  position: absolute;
  cursor: pointer;
  top: 0px;
  right: 0;
  bottom: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
}

.dropZone-upload-limit-info {
  display: flex;
  justify-content: flex-start;
  flex-direction: column;
}

.dropZone-over {
  background: #5c5c5c !important;
  opacity: 0.8;
  border: 2px solid #2e94c4;
}

.dropZone-uploaded {
  height: 200px;
  position: relative;
  border: 2px dashed #00a199;
}

.dropZone-uploaded-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #a8a8a8;
  position: absolute;
  top: 50%;
  width: 100%;
  transform: translate(0, -50%);
  text-align: center;
}

.removeFile {
  width: 200px;
}
</style>
