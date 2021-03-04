<template>
  <div>
    <label for="">{{ descript }}</label>
    <b-button variant="primary" size="sm" class="float-right" @click="openEdit">
      <font-awesome-icon :icon="['fas', 'pencil-alt']" size="xs" />
    </b-button>
    <b-list-group class="mt-2" v-if="inputLength !== 0">
      <b-list-group-item class="p-2" v-for="(item, key) in displayContent" :key="key">
        {{ item.station_fullname }} / {{ item.ETA }}
      </b-list-group-item>
    </b-list-group>
    <b-list-group class="mt-2" v-else>
      <b-list-group-item>
        {{ `尚無站點資料` }}
      </b-list-group-item>
    </b-list-group>

    <b-modal
      ref="modal"
      centered
      scrollable
      :title="modalTitle"
      header-class="modal-head-footer-color"
      footer-class="modal-head-footer-color"
      body-class="modal-body-color"
    >
      <div class="container-fluid list-area">
        <div class="row mb-2" v-for="(item, key) in content" :key="key">
          <b-input-group class="col-6 p-0">
            <b-form-input v-model="content[key].station_fullname"></b-form-input>
            <template v-slot:append>
              <b-dropdown
                right
                menu-class="select-panel"
              >
                <template v-if="stopSelections && stopSelections.length > 0">
                  <b-dropdown-item
                    class="select-drops"
                    v-for="(stop, index) in stopSelections"
                    :key="index"
                    @click="selectAsValue(stop, key)"
                  >
                    {{ stop.station_fullname }}
                  </b-dropdown-item>
                </template>
                <template v-else>
                  <b-dropdown-item>
                    {{ `查無選擇項` }}
                  </b-dropdown-item>
                </template>
              </b-dropdown>
            </template>
          </b-input-group>
          <b-input-group class="col-4 p-0 pl-2">
            <b-form-input type="time" v-model="content[key].ETA"></b-form-input>
          </b-input-group>
          <div class="col-2 p-0 pl-2">
            <b-button-group>
              <b-button variant="success" @click.prevent="add(key)" :disabled="content.length > 11">+</b-button>
              <b-button variant="danger" @click.prevent="remove(key)" :disabled="content.length < 1">-</b-button>
            </b-button-group>
          </div>
        </div>
      </div>

      <template v-slot:modal-footer>
        <b-button
          size="sm"
          block
          variant="primary"
          @click="set"
          :disabled="!isChangable"
        >變更</b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'VoucherIntermediateStations',
  components: {
  },
  props: {
    defaultInput: String,
    required: Boolean,
  },
  data() {
    return {
      input: this.defaultInput || '[]',
      backendFieldName: 'intermediate_stations',
      descript: '中間站',
      type: '',
      displayContent: [],
      content: [],

      rowData: this.$parent.$parent.$parent.$parent.item || [],
      stopSelections: [],
    };
  },
  created() {
    this.init();
  },
  watch: {
    input(value) {
      const send = {
        componentName: this.$options.name,
        backendFieldName: this.backendFieldName,
        value,
        state: this.state,
      };
      this.$emit('updateInput', send);
    },
  },
  computed: {
    state() {
      return this.required ? !!this.input : null;
    },
    modalTitle() {
      return `${this.descript}-編輯`;
    },
    inputLength() {
      return JSON.parse(this.input).length;
    },
    isChangable() {
      if (this.content.length === 1) return true;
      return this.content.every(element => element.station_fullname !== '');
    },
  },
  methods: {
    async init() {
      // 根據初始資料查找站點
      this.stopSelections = await this.getStops(this.rowData.SubRouteUID, this.rowData.Direction);

      let originData = JSON.parse(this.input);

      // 格式化時間類型資料(格式錯誤顯示有問題)
      originData.forEach((item) => {
        const $el = item;
        let time = null;

        if ($el.ETA) {
          time = $el.ETA;
          $el.ETA = this.$moment(time, 'HH:mm').format('HH:mm');
        } else {
          time = null;
        }
      });

      // 如果初始資料為空建立第一筆資料
      if (originData == null || originData.length === 0) {
        // 有中間站選項時 station 帶空值，否則用 SubRouteUID 自動生成
        originData = [{
          station: '',
          station_fullname: '',
          seq: 1,
        }];
      }

      // 帶入初始中間站資料
      this.content = JSON.parse(JSON.stringify(originData)); // 編輯中的陣列
      this.displayContent = JSON.parse(JSON.stringify(originData)); // 編輯完成的陣列
    },
    async openEdit() {
      // 開啟編輯窗
      this.$refs.modal.show();

      /*
        查詢當前輸入路線的中間站，利用 edit.vue 的 selectedInput，如果沒有 SubRouteUID 就使用rowData的 SubRouteUID

        沒有中間站資料時自動帶入路線時預設中間站
      */

      const editSelectedInput = this.$parent.$parent.$parent.$parent.selectedInput;

      // 沒有中間站資料時自動帶入路線時預設中間站 displayContent 代表編輯後的中間站
      if (this.displayContent[0].station_fullname === '') {
        // 有路線資料時查找，否則自動生成一筆
        if (editSelectedInput.SubRouteUID && editSelectedInput.Direction) {
          const defaultRoute = await this.lookupRoute(editSelectedInput.SubRouteUID, editSelectedInput.Direction);
          const defaultRouteIntermediateStations = JSON.parse(defaultRoute[0].intermediate_stations) || [];
          let intermediateStations = [];

          // 查詢到的路線若沒有中間站自動生成一筆
          if (defaultRouteIntermediateStations.length > 0) {
            defaultRouteIntermediateStations.forEach((station) => {
              const temp = {
                station: station.StopUID ? station.StopUID : '',
                ETA: this.$moment().format('HH:mm'),
                station_fullname: station.station_fullname,
              };

              intermediateStations.push(temp);
            });
          } else {
            intermediateStations = [];
          }

          this.content = JSON.parse(JSON.stringify(intermediateStations));
        }
      }

      // 有中間站選項時 station 帶空值，否則用 SubRouteUID 自動生成
      if (this.content == null || this.content.length === 0) {
        this.content = [{
          station: '',
          station_fullname: '',
          seq: 1,
        }];
      }
    },
    async getStops(SubRouteUID, Direction) {
      return this.$http
        .post(`${process.env.VUE_APP_BASE_API}/api/route/GetStopList`, { SubRouteUID, Direction })
        .then(response => response.data.Resource)
        .catch(e => console.log(e));
    },
    async lookupRoute(SubRouteUID, Direction) {
      const res = await this.$http.post(`${process.env.VUE_APP_BASE_API}/api/route/GetList`, { RouteID: SubRouteUID, Direction })
        .then(response => response.data.Resource)
        .catch(e => console.log(e));

      return res;
    },
    add(key) {
      const seqValue = key + 1;
      const generateSeq = ((seqValue + 1) < 10) ? `0${seqValue + 1}` : `${seqValue + 1}`;

        // station: `${this.rowData.SubRouteUID}${generateSeq}`,
      this.content.splice(seqValue, 0, {
        station: `${generateSeq}`,
        station_fullname: '',
        seq: seqValue + 1,
      });

      this.content = this.content.map((element, index) => {
        if (index > seqValue) {
          const el = element;
          el.seq += 1;
          return el;
        }

        return element;
      });
    },
    remove(key) {
      if (this.content.length < 2) {
        this.content[0].station_fullname = '';
        this.content[0].station = '';
        this.content[0].ETA = '';
        return;
      }

      this.content = this.content.map((element, index) => {
        if (index > key) {
          const el = element;
          el.seq -= 1;
          return el;
        }

        return element;
      });

      this.content.splice(key, 1);
    },
    selectAsValue(item, index) {
      this.content[index].station_fullname = item.station_fullname;
      this.content[index].station = item.StopUID;
    },
    set() {
      this.displayContent = JSON.parse(JSON.stringify(this.content));

      // content 長度1且沒有 station_fullname 等同於空值，空值須給空陣列
      if (this.displayContent[0].station_fullname === '') {
        this.input = '[]';
      } else {
        this.input = JSON.stringify(this.displayContent);
      }
      console.log(this.input);

      this.$refs.modal.hide();
    },
  },
};
</script>

<style lang="scss" scoped>
.list-area {
  height: 500px;
}

.add-remove {
  display: inline-block;
  cursor: pointer;
}
</style>

<style lang="scss">
.select-panel {
  max-height: 300px;
  overflow-y: scroll;
}
</style>
