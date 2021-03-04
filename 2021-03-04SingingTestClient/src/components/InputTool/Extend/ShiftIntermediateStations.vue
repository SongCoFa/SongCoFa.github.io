<template>
  <div>
    <label>中間站</label>
    <b-button variant="primary" size="sm" class="float-right"  @click="openEdit">
      <font-awesome-icon :icon="['fas', 'pencil-alt']" size="xs" />
    </b-button>
    <b-list-group class="mt-2" v-if="displayStationsList.length > 0 && displayStationsList[0].station_fullname !== ''">
      <b-list-group-item class="p-2" v-for="(item, key) in displayStationsList" :key="key">
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
      title="中間站資料編輯"
      header-class="modal-head-footer-color"
      footer-class="modal-head-footer-color"
      body-class="modal-body-color"
      size="xl"
    >
      <div class="container-fluid list-area">
        <div class="row mb-2" v-for="(item, key) in stationsList" :key="key">
          <b-input-group class="col-6 p-0">
            <b-form-input v-model="stationsList[key].station_fullname"></b-form-input>
            <template v-slot:append>
              <b-dropdown
                right
                menu-class="select-panel"
              >
                <template v-if="selectableStationsList && selectableStationsList.length > 0">
                  <b-dropdown-item
                    class="select-drops"
                    v-for="(item, index) in selectableStationsList"
                    :key="index"
                    @click="selectAsValue(item, key)"
                  >
                    {{ item.station_fullname }}
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
            <b-form-input type="time" v-model="stationsList[key].ETA"></b-form-input>
          </b-input-group>
          <div class="col-2 p-0 pl-2">
            <b-button-group>
              <b-button variant="success" @click.prevent="addStation(key)" :disabled="stationsList.length > 11">+</b-button>
              <b-button variant="danger" @click.prevent="removeStation(key)" :disabled="stationsList.length < 1">-</b-button>
            </b-button-group>
          </div>
        </div>
      </div>

      <template v-slot:modal-footer>
        <b-button
          size="sm"
          block
          variant="primary"
          @click="handleOK"
          :disabled="!isChangable"
        >變更</b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'ShiftIntermediateStations',
  props: {
    value: Object,
  },
  data() {
    return {
      data: null,
      displayStationsList: null,
      stationsList: null,
    };
  },
  watch: {
  },
  computed: {
    selectableStationsList() {
      return this.$store.getters['IntermediateStations/intermediateStations'];
    },
    isChangable() {
      if (this.stationsList.length === 1) return true;
      return this.stationsList.every(element => element.station_fullname !== '' && element.ETA !== '');
    },
  },
  created() {
    this.init();

    // if (this.value) {
    //   this.data = this.value;
    //   const istations = JSON.parse(this.data.intermediate_stations);
    //   istations.map((item) => {
    //     const temp = item;
    //     temp.ETA = this.$moment(temp.ETA, 'HH:mm').format('HH:mm');
    //     return temp;
    //   });
    //   this.displayStationsList = JSON.parse(JSON.stringify(istations));
    //   this.stationsList = JSON.parse(JSON.stringify(istations));
    // }

    // if (this.stationsList == null || this.stationsList.length === 0) {
    //   this.stationsList = [{
    //     station: '',
    //     station_fullname: '',
    //     ETA: '',
    //   }];
    // }
  },
  methods: {
    async init() {
      // 中間站值初始化
      if (this.value) {
        this.data = this.value;
        // console.log('prop data', this.data);
      }

      if (JSON.parse(this.data.intermediate_stations) && JSON.parse(this.data.intermediate_stations).length > 0) {
        // 有中間站資料時自動帶入資料值
        const temp = JSON.parse(this.data.intermediate_stations);
        temp.map((station) => {
          const obj = {
            station: station.station ? station.station : '',
            ETA: station.ETA ? this.$moment(station.ETA, 'HH:mm').format('HH:mm') : '',
            station_fullname: station.station_fullname ? station.station_fullname : '',
          };

          return obj;
        });

        this.displayStationsList = JSON.parse(JSON.stringify(temp));
        this.stationsList = JSON.parse(JSON.stringify(temp));
      } else {
        const intermediateStations = [
          {
            station: '',
            station_fullname: '',
            ETA: '',
          },
        ];

        this.displayStationsList = JSON.parse(JSON.stringify(intermediateStations));
        this.stationsList = JSON.parse(JSON.stringify(intermediateStations));
      }
    },
    async openEdit() {
      this.$refs.modal.show();

      let intermediateStations = [];

      // 沒有中間站資料時自動帶入路線時預設中間站 displayStationsList 代表編輯後的中間站
      if (this.displayStationsList[0].station_fullname === '') {
        // 有路線資料時查找，否則自動生成一筆
        if (this.data.SubRouteUID && this.data.direction) {
          const defaultRoute = await this.lookupRoute();
          const defaultRouteIntermediateStations = JSON.parse(defaultRoute[0].intermediate_stations) || [];
          console.log('defaultRouteIntermediateStations', defaultRouteIntermediateStations);

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
            intermediateStations = [
              {
                station: '',
                station_fullname: '',
                ETA: '',
              },
            ];
          }

          console.log(intermediateStations);

          this.stationsList = JSON.parse(JSON.stringify(intermediateStations));
        } else {
          this.stationsList = [
            {
              station: '',
              station_fullname: '',
              ETA: '',
            },
          ];
        }
      }

      // 重新查詢輸入的路線編號+方向
      this.retrieveStations();
    },
    async lookupRoute() {
      const res = await this.$http.post(`${process.env.VUE_APP_BASE_API}/api/route/GetList`, { RouteID: this.data.SubRouteUID, Direction: this.data.direction })
        .then(response => response.data.Resource)
        .catch(e => console.log(e));

      return res;
    },
    retrieveStations() {
      // 取得條件下中間站的選項
      const condition = {
        id: this.data.SubRouteUID,
        direction: this.data.direction,
      };

      this.$store.dispatch('IntermediateStations/getStations', condition);
    },
    addStation(key) {
      // 增加一站
      const seqValue = key + 1;

      this.stationsList.splice(seqValue, 0, {
        station: '',
        ETA: '',
        station_fullname: '',
      });
    },
    removeStation(key) {
      // 移除一站 最少保留一筆 空值為空字串
      if (this.stationsList.length < 2) {
        this.stationsList[0].station = '';
        this.stationsList[0].station_fullname = '';
        this.stationsList[0].ETA = '';
        return;
      }

      this.stationsList.splice(key, 1);
    },
    selectAsValue(item, key) {
      // 選取資料
      this.stationsList[key].station = item.StopUID;
      this.stationsList[key].station_fullname = item.station_fullname;
    },
    handleOK() {
      // 變更資料
      this.displayStationsList = JSON.parse(JSON.stringify(this.stationsList));

      // 第一筆的 station_fullname 為空字串時表示為沒有中間站，回寫時需轉成空陣列
      let result = null;

      if (this.displayStationsList[0].station_fullname === '') {
        result = [];
      } else {
        result = this.displayStationsList;
      }

      this.$emit('updateIntermediateStations', result);
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
