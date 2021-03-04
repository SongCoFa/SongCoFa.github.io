<template>
  <div class="d-inline-block">
    <b-button
      squared
      class="container-border"
      variant="primary"
      @click="init();"
      :disabled="!writable"
    >匯入</b-button>

    <b-modal
      ref="modal"
      centered
      scrollable
      hide-footer
      header-class="modal-head-footer-color"
      footer-class="modal-head-footer-color"
      body-class="modal-body-color"
    >
      <template v-slot:modal-title>
        {{ modalTitle }}
      </template>

      <div class="template-collection">
        <b-button
          size="sm"
          variant="outline-primary"
          class="mx-1"
          v-for="(item, key) in tabItems" :key="key"
          @click="downloadTemplate(item)"
        >
          {{ item.display }}模板
        </b-button>
      </div>

      <div class="mt-2">
        <div v-if="!importFile">
          <div
            :class="['dropZone', dragging ? 'dropZone-over' : '']"
            @dragestart="dragging = true"
            @dragenter="dragging = true"
            @dragleave="dragging = false"
          >
            <div class="dropZone-info" @drag="onChange">
              <font-awesome-icon :icon="['fas','cloud-upload-alt']" />
              <span class="dropZone-title">拖曳或點擊上傳檔案</span>
              <div>
                <div class="dropZone-upload-limit-info">支援格式： .csv</div>
              </div>
            </div>
            <input type="file" accept=".csv" @change="onChange" />
          </div>
        </div>

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
      </div>

    </b-modal>
  </div>
</template>

<script>
import ExportCSVFile from '@/components/table/_tool/ExportCSVFile';

const csvtojsonV2 = require('csvtojson');

export default {
  name: 'TabImport',
  props: {
    ImportListFormat: Object,
    ImportApi: String,
    tabItems: Array,
    writable: Boolean,
  },
  data() {
    return {
      componentName: '匯入',
      dragging: false,
      importFile: null,
      displayFileInner: null,
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
    init() {
      this.removeFile();
      this.$refs.modal.show();
    },
    removeFile() {
      this.importFile = null;
      this.loadFileInner = null;
    },
    downloadTemplate(item) {
      const fileTitle = `${item.display}-匯入參考模板`;

      const items = this.ImportListFormat[`${item.name}`].reduce((a, c) => {
        const temp = a;
        temp[c.displayName] = c.exampleValue;
        return temp;
      }, {});

      console.log(items);

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
    async excuteFileParse() {
      const fileData = await new Promise((resolve) => {
        const fr = new FileReader();
        fr.onload = () => resolve(fr.result);
        fr.readAsText(this.importFile, 'big5');
      });

      // 集合 ImportListFormat 中所有的物件 寫法一
      /*
        const temp = [];
        Object.keys(this.ImportListFormat).forEach((a) => {
          this.ImportListFormat[`${a}`].forEach((b) => {
            const check = temp.some(c => c.key === b.key);
            if (!check) {
              temp.push(b);
            }
          });
        });
      */

      // 集合 ImportListFormat 中所有的物件 寫法二
      const spreadAllTemplateObj = [].concat(...Object.keys(this.ImportListFormat).map(object => this.ImportListFormat[`${object}`]));

        // 1. set => stored the set and return actual callback
        // 2. use an IIFE to create a set and store in set
      const uniqueItems = spreadAllTemplateObj
        .filter((set => o => (set.has(o.key) ? false : set.add(o.key))
          )(new Set()));

      // 檢查是否有欄位不包含在 template 內
      const fileFields = fileData.split(/\r|\n/)[0].split(',');

      const allowedFields = uniqueItems.map(field => field.displayName);

      const invalidField = fileFields.filter(field => !allowedFields.includes(field));

      if (invalidField.length) {
        alert(`${invalidField} 項目名稱錯誤`);
        return;
      }

      // FIXME: find better way to separate display and send value
      this.loadFileInner = await csvtojsonV2({
        nullObject: true,
      }).fromString(fileData);
    },
    async excuteDataUpdate() {
      // 查駕駛資料 要替換匯入的姓名為員編
      const driverList = await this.$http
        .post(`${process.env.VUE_APP_BASE_API}/api/driver/GetList`, {
          emp_ID: null, emp_name: null, dept: null, expired: 0,
        })
        .then((response) => {
          const result = response.data.Resource.filter(item => item.title === '駕駛長');
          return result;
        })
        .catch(error => console.log(error));

      if (!driverList) {
        console.log('駕駛資料查找失敗');
        return;
      }

      const fileData = this.loadFileInner;

      // 轉換可匯入欄位名稱為資料庫欄位名稱
      const spreadAllTemplateObj = [].concat(...Object.keys(this.ImportListFormat).map(object => this.ImportListFormat[`${object}`]));

      const uniqueItems = spreadAllTemplateObj
        .filter((set => o => (set.has(o.key) ? false : set.add(o.key))
          )(new Set()));

      const sendConvert = [];

      fileData.forEach((row) => {
        const $row = row;

        const newRow = Object.keys($row).reduce((a, b) => {
          const temp = a;

          let newPorperty = uniqueItems.filter(item => item.displayName === b)[0].key;

          if (!newPorperty) {
            newPorperty = b;
          }

          temp[`${newPorperty}`] = $row[`${b}`];

          return temp;
        }, {});

        sendConvert.push(newRow);
      });

      // 查找員工姓名為ID, 找不到的另外提示且全部都不寫入
      const illegalName = [];

      sendConvert.map((row) => {
        const temp = row;
        const employee = driverList.filter(item => item.emp_name === row.emp_name);
        if (employee.length > 0) {
          temp.emp_ID = employee[0].emp_ID;
        } else {
          illegalName.push(row.emp_name);
          temp.emp_ID = '';
        }
        return temp;
      });

      if (illegalName.length > 0) {
        alert(`以下員工姓名： ${illegalName} 查找不到員編`);
        return;
      }

      // 執行寫入
      this.excuteWrite(sendConvert);
    },
    excuteWrite(send) {
      // console.log(send);
      const member = window.sessionStorage.getItem('member');
      if (member === 'visitor') {
        alert('使用者權限不足');
        return;
      }

      this.$http.post(this.ImportApi, send)
        .then((response) => {
          // console.log(response.data);

          this.$refs.modal.hide();

          this.$bvModal
            .msgBoxOk(response.data.Resource.ReturnMessage, {
              size: 'sm',
              okTitle: '確定',
              centered: true,
            })
            .then(() => {
              this.$emit('refreshData');
            })
            .catch(e => console.log(e));
        })
        .catch(error => console.log(error));
    },
    refreshData() {
      this.$emit('refreshData');
    },
  },
};
</script>

<style lang="scss" scoped>
::v-deep .container-border {
  border: 1px solid #aaaaaa;
}

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
