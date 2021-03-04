<template>
  <div>
    <b-button
      squared
      class="container-border"
      variant="primary"
      :disabled="!writable"
      @click="init();removeFile();"
    >
      {{componentName}}
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
        {{modalTitle}}
        <b-button size="sm" variant="outline-primary" @click="DownloadTemplate()">模板下載</b-button>
      </template>

      <div>
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
  name: 'Import',
  props: {
    ImportListFormat: Array,
    ImportApi: String,
    writable: Boolean,
  },
  data() {
    return {
      componentName: '匯入',

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
    init() {
      let msg = '';
      let hasCheck = false;

      if (this.$route.name === '總班表管理') {
        msg = '現有資料將會被刪除，是否要匯入資料';
        hasCheck = true;
      }

      if (this.$route.name === '駕駛長休假資料管理') {
        msg = '匯入駕駛長的原休假資料將會被移除並重新匯入，是否要繼續執行';
        hasCheck = true;
      }

      if (hasCheck) {
        this.$bvModal.msgBoxConfirm(msg, {
          title: '訊息',
          size: 'sm',
          buttonSize: 'sm',
          okVariant: 'danger',
          okTitle: '繼續',
          cancelTitle: '離開',
          footerClass: 'p-2',
          hideHeaderClose: false,
          centered: true,
        })
        .then((value) => {
          if (value) {
            this.$refs.modal.show();
          }
        })
        .catch(e => console.log(e));
      } else {
        this.$refs.modal.show();
      }
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

    DownloadTemplate() {
      const fileTitle = `${this.$route.name}-匯入參考模板`;

      const items = this.ImportListFormat.reduce((a, c) => {
        const temp = a;

        if (c.name === 'intermediate_stations') {
          JSON.parse(c.displayName).forEach((i, n) => {
            const ex = JSON.parse(c.exampleValue)[n];
            if (ex === undefined) {
              temp[i] = '';
            } else {
              temp[i] = ex;
            }
          });
          return temp;
        }

        temp[c.displayName] = c.exampleValue;
        return temp;
      }, {});

      ExportCSVFile(fileTitle, [items]);
    },

    async excuteFileParse() {
      const fileData = await new Promise((resolve) => {
        const fr = new FileReader();
        fr.onload = () => resolve(fr.result);
        fr.readAsText(this.importFile, 'big5');
      });

      const fileFields = fileData.split(/\r|\n/)[0].split(',');

      const neededFields = [];

      this.ImportListFormat.forEach((item) => {
        if (item.key === 'intermediate_stations') {
          JSON.parse(item.displayName).forEach((i) => {
            neededFields.push(i);
          });
        } else {
          neededFields.push(item.displayName);
        }
      });

      const missedFields = neededFields.filter(
        item => !fileFields.includes(item),
      );

      if (missedFields.length) {
        alert(`${missedFields} 欄位未設定`);
        return;
      }

      this.loadFileInner = await csvtojsonV2({
        // checkType: true,
        nullObject: true,
        headers: this.ImportListFormat.map(item => item.key),
      }).fromString(fileData);
    },

    excuteDataUpdate() {
      const send = JSON.parse(JSON.stringify(this.loadFileInner));

      const importArray = [];

      // 匯入資料轉值
      send.map((item) => {
        const temp = item;

        // 方向轉值 往 = 0; 反 = 1; 其餘狀態 = 0;
        if (temp.Direction === '往' || temp.Direction === '0') {
          temp.Direction = '0';
        } else if (temp.Direction === '返' || temp.Direction === '1') {
          temp.Direction = '1';
        } else {
          temp.Direction = '0';
        }

        // 開班 轉 boolean
        const daySet = ['is_mon', 'is_tue', 'is_wed', 'is_thu', 'is_fri', 'is_sat', 'is_sun'];
        Object.keys(temp).forEach((i) => {
          if (daySet.includes(i)) {
            if (temp[`${i}`] === '0') {
              temp[`${i}`] = 'false';
            } else if (temp[`${i}`] === '1') {
              temp[`${i}`] = 'true';
            } else {
              temp[`${i}`] = null;
            }
          }
        });

        // 生效失效空白預設日
        temp.active_date = temp.active_date && temp.active_date === '' ? '2019-01-01' : temp.active_date;
        temp.expire_date = temp.expire_date && temp.expire_date === '' ? '2199-12-31' : temp.expire_date;

        return temp;
      });

      // 合併中間站值
      send.forEach((el) => {
        const temp = Object.keys(el).reduce((a, b) => {
          const value = a;

          if (b === 'intermediate_stations') {
            if (el[b]) {
              value[b] = [el[b]];
            } else {
              value[b] = [];
            }

            return value;
          }

          if (b.startsWith('field')) {
            if (el[b] !== '') {
              value.intermediate_stations.push(el[b]);
            }
            return value;
          }

          value[b] = el[b];
          return value;
        }, {});

        if (temp.intermediate_stations) {
          const g = [];

          temp.intermediate_stations.forEach((item, i) => {
            const seqValue = ((i + 1) < 10) ? `0${i + 1}` : `${i + 1}`;
            const g2 = {};
            g2.StopUID = `${temp.RouteID}${seqValue}`;
            g2.station_fullname = item;
            g2.seq = i + 1;

            g.push(g2);
          });

          temp.intermediate_stations = g;

          temp.intermediate_stations = JSON.stringify(temp.intermediate_stations);
        }
        importArray.push(temp);
      });

      const abnormalList = this.checkData(importArray);

      if (abnormalList.length > 0) return;
      const member = window.sessionStorage.getItem('member');
      if (member === 'visitor') {
        alert('使用者權限不足');
        return;
      }

      this.$http
        .post(this.ImportApi, importArray)
        .then((response) => {
          // console.log(response.data);

          this.$refs.modal.hide();

          this.$bvModal
            .msgBoxOk(response.data.Resource.ReturnMessage, {
              size: 'sm',
              okTitle: '確定',
              centered: true,
            })
            .then((value) => {
              console.log(value);
              this.$emit('refreshData');
            })
            .catch(e => console.log(e));
        })
        .catch(error => console.log(error));
    },
    checkData(importArray) {
      // console.log(importArray);

      const routeName = this.$route.name;

      const abnormalDataIndex = [];

      // 特殊日期匯入日期檢查
      if (routeName === '特殊日期資料管理') {
        importArray.forEach((row, i) => {
          const start = new Date(row.special_start_date);
          const end = new Date(row.special_end_date);

          if (start > end) {
            abnormalDataIndex.push(i + 1);
          }
        });

        if (abnormalDataIndex.length) {
          alert(`第 ${abnormalDataIndex} 列資料 起始日必須小於結束日`);
        }
      }

      // 國定假日匯入日期檢查
      if (routeName === '國定假日資料管理') {
        importArray.forEach((row, i) => {
          const start = new Date(row.start_date);
          const end = new Date(row.end_date);

          if (start > end) {
            abnormalDataIndex.push(i + 1);
          }
        });

        if (abnormalDataIndex.length) {
          alert(`第 ${abnormalDataIndex} 列資料 起始日必須小於結束日`);
        }
      }

      // 駕駛長休假資料匯入日期檢查
      if (routeName === '駕駛長休假資料管理') {
        importArray.forEach((row, i) => {
          const start = new Date(row.leave_start_date);
          const end = new Date(row.leave_end_date);
          const times = end.getTime() - start.getTime();
          const timesToDates = times / (1000 * 3600 * 24);
          const days = parseInt(row.leave_days, 10);
          const check = days <= timesToDates + 1 && days >= timesToDates;

          if (!check) {
            abnormalDataIndex.push(i + 1);
          }
        });

        if (abnormalDataIndex.length) {
          alert(`第 ${abnormalDataIndex} 列資料 日數請在起始日期和結束日期有效區間內`);
        }
      }

      // 總班表匯入日期檢查
      if (routeName === '總班表管理') {
        importArray.forEach((row, i) => {
          const start = new Date(row.active_date);
          const end = new Date(row.expire_date);

          if (start > end) {
            abnormalDataIndex.push(i + 1);
          }
        });

        if (abnormalDataIndex.length) {
          alert(`第 ${abnormalDataIndex} 列資料 日數請在起始日期和結束日期有效區間內`);
        }
      }

      return abnormalDataIndex;
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
