<template>
  <div>
    <b-button
      squared
      class="container-border"
      variant="primary"
      @click="$refs.modal.show();removeFile();"
      :disabled="!writable"
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
        {{ '班次匯入' }}
        <b-button size="sm" variant="outline-primary" @click="DownloadTemplate">模板下載</b-button>
      </template>

      <div>
        <div v-if="!importShiftFile">
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
            <input type="file" accept=".csv" @change="onChange">
          </div>
        </div>

        <div v-else class="dropZone-uploaded">
          <div class="dropZone-uploaded-info">
            <span class="dropZone-title">已上傳</span>
            <button type="button" class="btn btn-primary removeFile" @click="removeFile">移除檔案</button>
          </div>
        </div>

        <div class="uploadedFile-info" v-if="importShiftFile">
          <div>檔案名稱 : {{ importShiftFile.name }}</div>
          <div>檔案大小(字節) : {{ importShiftFile.size }}</div>
          <div>檔案格式 : {{ extension }}</div>
          <b-button variant="outline-primary" @click="excuteFileParse">檔案解析</b-button>
          <b-button v-if="loadShiftFileInner" variant="outline-primary ml-2" @click="excuteDataUpdate">匯入</b-button>
        </div>
        <div v-if="loadShiftFileInner" class="file-preview">
          <pre>{{ loadShiftFileInner }}</pre>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import ExportShiftCSVFile from '@/components/table/_tool/ExportShiftCSVFile';

const csvtojsonV2 = require('csvtojson');

export default {
  name: 'ImportShift',
  props: {
    // ImportApi: String,
    writable: Boolean,
  },
  data() {
    return {
      ImportListFormat: [
        {
          key: 'shift_name',
          displayName: '仕業名稱',
          exampleValue: '仕業範例',
        },
        {
          key: 'emp_name',
          displayName: '駕駛',
          exampleValue: '陳繼發',
        },
        {
          key: 'bus_no',
          displayName: '車輛',
          exampleValue: '501-U9',
        },
        {
          key: 'DisplayRouteID',
          displayName: '路線編號',
          exampleValue: '13002',
        },
        {
          key: 'Direction',
          displayName: '路線方向',
          exampleValue: '1',
        },
        {
          key: 'departure',
          displayName: '開車時刻',
          exampleValue: '07:00',
        },
        {
          key: 'arrival',
          displayName: '到站時刻',
          exampleValue: '08:00',
        },
        {
          key: 'remark',
          displayName: '備註',
          exampleValue: '測試用',
        },
        {
          key: '中間站_1',
          displayName: '中間站 1',
          exampleValue: '鹽水',
        },
        {
          key: '到站時間_1',
          displayName: '到站時間 1',
          exampleValue: '7:10',
        },
        {
          key: '中間站_2',
          displayName: '中間站 2',
          exampleValue: '學甲',
        },
        {
          key: '到站時間_2',
          displayName: '到站時間 2',
          exampleValue: '7:20',
        },
        {
          key: '中間站_3',
          displayName: '中間站 3',
          exampleValue: '',
        },
        {
          key: '到站時間_3',
          displayName: '到站時間 3',
          exampleValue: '',
        },
        {
          key: '中間站_4',
          displayName: '中間站 4',
          exampleValue: '',
        },
        {
          key: '到站時間_4',
          displayName: '到站時間 4',
          exampleValue: '',
        },
        {
          key: '中間站_5',
          displayName: '中間站 5',
          exampleValue: '',
        },
        {
          key: '到站時間_5',
          displayName: '到站時間 5',
          exampleValue: '',
        },
        {
          key: '中間站_6',
          displayName: '中間站 6',
          exampleValue: '',
        },
        {
          key: '到站時間_6',
          displayName: '到站時間 6',
          exampleValue: '',
        },
        {
          key: '中間站_7',
          displayName: '中間站 7',
          exampleValue: '',
        },
        {
          key: '到站時間_7',
          displayName: '到站時間 7',
          exampleValue: '',
        },
        {
          key: '中間站_8',
          displayName: '中間站 8',
          exampleValue: '',
        },
        {
          key: '到站時間_8',
          displayName: '到站時間 8',
          exampleValue: '',
        },
        {
          key: '中間站_9',
          displayName: '中間站 9',
          exampleValue: '',
        },
        {
          key: '到站時間_9',
          displayName: '到站時間 9',
          exampleValue: '',
        },
        {
          key: '中間站_10',
          displayName: '中間站 10',
          exampleValue: '',
        },
        {
          key: '到站時間_10',
          displayName: '到站時間 10',
          exampleValue: '',
        },
        {
          key: '中間站_11',
          displayName: '中間站 11',
          exampleValue: '',
        },
        {
          key: '到站時間_11',
          displayName: '到站時間 11',
          exampleValue: '',
        },
        {
          key: '中間站_12',
          displayName: '中間站 12',
          exampleValue: '',
        },
        {
          key: '到站時間_12',
          displayName: '到站時間 12',
          exampleValue: '',
        },
        {
          key: 'is_mon',
          displayName: '週一行駛',
          exampleValue: '1',
        },
        {
          key: 'is_tue',
          displayName: '週二行駛',
          exampleValue: '1',
        },
        {
          key: 'is_wed',
          displayName: '週三行駛',
          exampleValue: '1',
        },
        {
          key: 'is_thu',
          displayName: '週四行駛',
          exampleValue: '1',
        },
        {
          key: 'is_fri',
          displayName: '週五行駛',
          exampleValue: '1',
        },
        {
          key: 'is_sat',
          displayName: '週六行駛',
          exampleValue: '0',
        },
        {
          key: 'is_sun',
          displayName: '週日行駛',
          exampleValue: '0',
        },
      ],

      dragging: false,

      importShiftFile: null,
      loadShiftFileInner: null,

      format: null,
    };
  },
  created() {
  },
  computed: {
    extension() {
      return this.importShiftFile ? this.importShiftFile.name.split('.').pop() : '';
    },
  },
  methods: {
    removeFile() {
      this.importShiftFile = null;
      this.loadShiftFileInner = null;
    },
    DownloadTemplate() {
      const fileTitle = `${this.$route.name}-匯入參考模板`;

      const items = this.ImportListFormat.reduce((a, c) => {
        const temp = a;
        temp[c.displayName] = c.exampleValue;
        return temp;
      }, {});

      ExportShiftCSVFile(fileTitle, [items]);
    },
    onChange(e) {
      const files = e.target.files || e.dataTransfer.files;

      if (!files.length) {
        this.dragging = false;
        return;
      }

      this.createFile(files[0]);
    },
    getRoute() {
      this.$http.post(`${process.env.VUE_APP_BASE_API}/api/route/GetList`, { RouteID: null, Direction: null })
        .then((response) => {
          this.routeList = response.data.Resource;
        })
        .catch(e => console.log(e));
    },
    createFile(file) {
      if (!file.type.match('application/vnd.ms-excel')) {
        console.log('please select csv file');
        this.dragging = false;
        return;
      }

      this.importShiftFile = file;
      this.dragging = false;
    },
    async excuteFileParse() {
      this.getRoute();

      const fileData = await new Promise((resolve) => {
        const fr = new FileReader();
        fr.onload = () => resolve(fr.result);
        fr.readAsText(this.importShiftFile, 'big5');
      });

      const fileFields = fileData.split(/\r|\n/)[0].split(',');

      const neededFields = this.ImportListFormat.map(item => item.displayName);

      const missedFields = neededFields.filter(
        item => !fileFields.includes(item),
      );

      if (missedFields.length) {
        alert(`${missedFields} 欄位未設定`);
        return;
      }

      this.loadShiftFileInner = await csvtojsonV2({
        // checkType: true,
        nullObject: true,
        headers: this.ImportListFormat.map(item => item.key),
      }).fromString(fileData);
    },

    async excuteDataUpdate() {
      // intermediate_stations: [{\"station\":\"THB300680\",\"ETA\":\"06:30\",\"station_fullname\":\"南新國中\"}]
      // const empList = this.$store.getters['DriverList/driversRawData'];

      const send = this.loadShiftFileInner;

      send.forEach((row) => {
        const $el = row;

        // emp_Name 轉 emp_ID
        // if ($el.emp_Name && $el.emp_Name !== '') {
        //   const employee = empList.filter(e => e.emp_name === $el.emp_Name);
        //   $el.emp_ID = employee[0].emp_ID;
        // } else {
        //   $el.emp_ID = '';
        // }

        // 方向轉值 往 = 0; 反 = 1; 其餘狀態 = 0;
        if ($el.Direction === '往' || $el.Direction === '0') {
          $el.Direction = '0';
        } else if ($el.Direction === '返' || $el.Direction === '1') {
          $el.Direction = '1';
        } else {
          $el.Direction = '0';
        }

        // 開班 轉 boolean
        const daySet = ['is_mon', 'is_tue', 'is_wed', 'is_thu', 'is_fri', 'is_sat', 'is_sun'];
        Object.keys($el).forEach((i) => {
          if (daySet.includes(i)) {
            if ($el[`${i}`] === '0') {
              $el[`${i}`] = 'false';
            } else if ($el[`${i}`] === '1') {
              $el[`${i}`] = 'true';
            } else {
              $el[`${i}`] = null;
            }
          }
        });

        // reformat 中間站和到站時間值 為 intermediate_stations
        const stationsList = Object.keys($el)
          .filter(key => (key.startsWith('中間站') || key.startsWith('到站時間')) && $el[`${key}`] !== '')
          .reduce((obj, key) => {
            const temp = obj;
            temp[key] = $el[key];
            return temp;
          }, {});

        const res = Object.keys(stationsList).reduce((a, b) => {
          const temp = a;

          const def = {
            中間站: { name: '中間站', propertyName: 'station_fullname' },
            到站時間: { name: '到站時間', propertyName: 'ETA' },
          };

          let whichProperty = null;
          if (b.includes(def.中間站.name)) whichProperty = def.中間站;
          else whichProperty = def.到站時間;

          if (b.includes(whichProperty.name)) {
            const order = +b.slice(whichProperty.name.length + 1);
            temp[order - 1] = temp[order - 1] || {};
            temp[order - 1][whichProperty.propertyName] = stationsList[b];
          }

          return temp;
        }, []);

        $el.intermediate_stations = res.filter((item => item));
      });

      const result = await this.setStationsID(send);

      this.updated(result);
    },

    setStationsID(send) {
      return Promise.all(send.map(item => this.$http.post(`${process.env.VUE_APP_BASE_API}/api/route/GetStopList`, { SubRouteUID: item.DisplayRouteID, direction: item.Direction })
          .then(response => response.data.Resource)
          .catch(e => console.log(e))))
        .then((value) => {
          send.map((row, i) => {
            const $el = row;

            console.log(value[i]);
            $el.intermediate_stations.map((station) => {
              const temp = station;
              // value[i].forEach((a) => {
              //   if (a.station_fullname === temp.station_fullname) {
              //     temp.station = a.StopUID;
              //     console.log(temp);
              //   } else {
              //     temp.station = '';
              //   }
              // });

              const searchResult = value[i].find(a => a.station_fullname === temp.station_fullname);

              if (searchResult) {
                temp.station = searchResult.StopUID;
              } else {
                temp.station = '';
              }

              return temp;
            });

            $el.intermediate_stations = JSON.stringify($el.intermediate_stations);

            return $el;
          });

          return send;
        })
        .catch(e => console.log(e));
    },

    updated(result) {
      const send = result;

      console.log(send);

      this.$http.post(`${process.env.VUE_APP_BASE_API}/api/shift/ImportList`, send)
        .then((response) => {
          console.log(response);
          this.$emit('resetAllData');
          this.$refs.modal.hide();
        })
        .catch(e => console.log(e));
    },
  },
};
</script>

<style lang="scss" scoped>
.container-border {
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
