<template>
  <div>
    <b-button variant="primary" size="sm" @click="initValue" :disabled="!shiftMaster.shift_name || !writable">
      <font-awesome-icon :icon="['fas', 'plus']" size="lg" />
    </b-button>

    <b-modal
      ref="modal"
      centered
      scrollable
      title="仕業班次新增"
      size="lg"
      header-class="modal-head-footer-color"
      footer-class="modal-head-footer-color"
      body-class="modal-body-color"
    >
      <b-row>
        <b-col cols="6">
          <!-- 路線編號 -->
          <b-form-group label="路線(編號/方向)">
            <div class="option-area">
              <b-input-group>
                <b-form-input
                  type="text"
                  autocomplete="off"
                  trim
                  v-model="record.DisplayRouteID"
                  placeholder="路線(編號/方向)"
                  @input="startSelectRoute"
                >
                </b-form-input>
                <b-input-group-append>
                  <b-btn variant="primary" @click="routeSelecting = !routeSelecting">
                    <font-awesome-icon :icon="['fas', 'angle-down']" size="xs" />
                  </b-btn>
                </b-input-group-append>
              </b-input-group>
              <div class="option-panel" v-if="routeSelecting && record.DisplayRouteID">
                <ul class="option-list">
                  <li class="option-list-item" v-for="(item, key) in filterRoute" :key="key" @click="setRoute(item)">{{ item.DisplayRouteID }} / {{ item.Direction === 'true' ? '返程' : '去程' }}</li>
                </ul>
              </div>
            </div>
          </b-form-group>

          <!-- 駕駛編號 -->
          <b-form-group label="駕駛編號">
            <b-form-select
              class="form-control"
              v-model="record.emp_ID"
              :options="driverList"
              value-field="value"
              text-field="text"
            >
            </b-form-select>
          </b-form-group>

          <!-- 預估發車時間 -->
          <b-form-group label="預估發車時間">
            <b-form-input type="time" v-model="record.departure"></b-form-input>
          </b-form-group>

          <!-- 備註 -->
          <b-form-group label="備註">
            <b-form-input type="text" placeholder="備註" trim v-model="record.remark"></b-form-input>
          </b-form-group>

          <!-- 周二是否行駛 -->
          <b-form-group label="周二是否行駛">
            <b-form-select v-model="record.is_tue">
              <option :value="null">請選擇</option>
              <option value="false">不行駛</option>
              <option value="true">行駛</option>
            </b-form-select>
          </b-form-group>

          <!-- 周四是否行駛 -->
          <b-form-group label="周四是否行駛">
            <b-form-select v-model="record.is_thu">
              <option :value="null">請選擇</option>
              <option value="false">不行駛</option>
              <option value="true">行駛</option>
            </b-form-select>
          </b-form-group>

          <!-- 周六是否行駛 -->
          <b-form-group label="周六是否行駛">
            <b-form-select v-model="record.is_sat">
              <option :value="null">請選擇</option>
              <option value="false">不行駛</option>
              <option value="true">行駛</option>
            </b-form-select>
          </b-form-group>

          <!-- 生效日期 -->
          <b-form-group label="生效日期">
            <b-form-input type="date" v-model="record.active_date"></b-form-input>
          </b-form-group>

          <!-- 中間站 -->
          <ShiftIntermediateStations
            :value="record"
            @updateIntermediateStations="updateIntermediateStations"
          ></ShiftIntermediateStations>
        </b-col>
        <b-col cols="6">
          <!-- 路線方向 -->
          <b-form-group label="路線方向">
            <b-form-select class="form-control" v-model="record.direction" disabled>
              <option :value="null">請選擇路線變更</option>
              <option value="false">去程</option>
              <option value="true">返程</option>
            </b-form-select>
          </b-form-group>

          <!-- 車輛號碼 -->
          <b-form-group label="車輛號碼">
            <div class="option-area">
              <b-input-group>
                <b-form-input
                  type="text"
                  autocomplete="off"
                  trim
                  v-model="record.bus_no"
                  placeholder="車輛號碼"
                  @input="startSelectVehicle"/>
                <b-input-group-append>
                  <b-btn variant="primary" @click="vehicleSelecting = !vehicleSelecting">
                    <font-awesome-icon :icon="['fas', 'angle-down']" size="xs" />
                  </b-btn>
                </b-input-group-append>
              </b-input-group>
              <div class="option-panel" v-if="vehicleSelecting && record.bus_no">
                <ul class="option-list">
                  <li class="option-list-item" v-for="(item, key) in filterVehicle" :key="key" @click="setVehicle(item)">{{ item }}</li>
                </ul>
              </div>
            </div>
          </b-form-group>

          <!-- 預估到終點站時間 -->
          <b-form-group label="預估到終點站時間">
            <b-form-input type="time" v-model="record.arrival"></b-form-input>
          </b-form-group>

          <!-- 周一是否行駛 -->
          <b-form-group label="周一是否行駛">
            <b-form-select v-model="record.is_mon">
              <option :value="null">請選擇</option>
              <option value="false">不行駛</option>
              <option value="true">行駛</option>
            </b-form-select>
          </b-form-group>

          <!-- 周三是否行駛 -->
          <b-form-group label="周三是否行駛">
            <b-form-select v-model="record.is_wed">
              <option :value="null">請選擇</option>
              <option value="false">不行駛</option>
              <option value="true">行駛</option>
            </b-form-select>
          </b-form-group>

          <!-- 周五是否行駛 -->
          <b-form-group label="周五是否行駛">
            <b-form-select v-model="record.is_fri">
              <option :value="null">請選擇</option>
              <option value="false">不行駛</option>
              <option value="true">行駛</option>
            </b-form-select>
          </b-form-group>

          <!-- 周日是否行駛 -->
          <b-form-group label="周日是否行駛">
            <b-form-select v-model="record.is_sun">
              <option :value="null">請選擇</option>
              <option value="false">不行駛</option>
              <option value="true">行駛</option>
            </b-form-select>
          </b-form-group>

          <!-- 失效日期 -->
          <b-form-group label="失效日期">
            <b-form-input type="date" v-model="record.expire_date"></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>

      <template v-slot:modal-footer>
        <b-button
          size="sm"
          block
          variant="primary"
          @click="handleAdd();"
        >新增</b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import ShiftIntermediateStations from '@/components/InputTool/Extend/ShiftIntermediateStations.vue';

export default {
  name: 'ShiftAdd',
  components: {
    ShiftIntermediateStations,
  },
  props: {
    shiftMaster: Object,
    shiftName: String,
    writable: Boolean,
  },
  data() {
    return {
      record: {
        SubRouteUID: '',
        DisplayRouteID: '',
        direction: null,
        emp_ID: '',
        bus_no: '',
        departure: this.$moment().format('HH:mm'),
        arrival: this.$moment().add(1, 'hours').format('HH:mm'),
        distance: '',
        remark: '',
        is_mon: 'true',
        is_tue: 'true',
        is_wed: 'true',
        is_thu: 'true',
        is_fri: 'true',
        is_sat: 'true',
        is_sun: 'true',
        active_date: this.$moment().format('YYYY-MM-DD'),
        expire_date: '2199-12-31',
        intermediate_stations: '[]',
      },

      routeSelecting: false,
      routeList: null,

      getDriverList: null,

      vehicleSelecting: false,
      vehicleList: null,
    };
  },
  created() {
  },
  mounted() {
  },
  computed: {
    required() {
      // check input state
      return this.record.SubRouteUID !== null;
    },
    state() {
     return this.required ? !!this.input : null;
    },
    driverList() {
      return this.$store.getters['DriverList/drivers'];
    },
    filterRoute() {
      return this.routeList.filter(item => item.DisplayRouteID.indexOf(this.record.DisplayRouteID) !== -1);
    },
    filterVehicle() {
      return this.vehicleList.filter(item => item.indexOf(this.record.bus_no) !== -1);
    },
  },
  methods: {
    initValue() {
      this.$refs.modal.show();

      this.resetDefaultValue();
      this.record.emp_ID = this.shiftMaster.emp_ID;
      this.record.bus_no = this.shiftMaster.bus_no;

      this.getRoute();
      this.getVehicle();
    },
    resetDefaultValue() {
      this.record = {
        SubRouteUID: '',
        DisplayRouteID: '',
        direction: null,
        emp_ID: '',
        bus_no: '',
        departure: this.$moment().format('HH:mm'),
        arrival: this.$moment().add(1, 'hours').format('HH:mm'),
        distance: '',
        remark: '',
        is_mon: 'true',
        is_tue: 'true',
        is_wed: 'true',
        is_thu: 'true',
        is_fri: 'true',
        is_sat: 'true',
        is_sun: 'true',
        active_date: this.$moment().format('YYYY-MM-DD'),
        expire_date: '2199-12-31',
        intermediate_stations: '[]',
      };
    },
    getRoute() {
      this.$http.post(`${process.env.VUE_APP_BASE_API}/api/route/GetList`, { RouteID: null, DisplayRouteID: null, Direction: null })
        .then((response) => {
          const result = response.data.Resource;
          const list = result.map((item) => {
            const obj = {};
            obj.DisplayRouteID = item.DisplayRouteID;
            obj.SubRouteUID = item.SubRouteUID;
            obj.Direction = item.Direction;
            return obj;
          });
          this.routeList = [...new Set(list)];

          console.log(this.routeList);
        })
        .catch(e => console.log(e));
    },
    getVehicle() {
      this.$http.post(`${process.env.VUE_APP_BASE_API}/api/vehicle/GetList`, { bus_no: null, bus_mark: null, manufacturing_year: null })
        .then((response) => {
          const result = response.data.Resource;
          this.vehicleList = [...new Set(result.map(item => item.bus_no))];
        })
        .catch(e => console.log(e));
    },
    startSelectRoute() {
      this.routeSelecting = true;
    },
    setRoute(item) {
      console.log(item);
      this.record.SubRouteUID = item.SubRouteUID;
      this.record.DisplayRouteID = item.DisplayRouteID;
      this.record.direction = item.Direction;
      this.routeSelecting = false;
    },
    startSelectVehicle() {
      this.vehicleSelecting = true;
    },
    setVehicle(vehicle) {
      this.record.bus_no = vehicle;
      this.vehicleSelecting = false;
    },
    updateIntermediateStations(value) {
      this.record.intermediate_stations = JSON.stringify(value);
    },
    handleAdd() {
      this.record.shift_name = this.shiftName;

      const newRecord = Object.assign({}, this.record);

      this.$emit('addNewRecord', newRecord);

      this.$refs.modal.hide();
    },
  },
};
</script>

<style lang="scss" scoped>
.option-area {
  position: relative;

  .option-panel {
    width: 100%;
    height: 200px;
    position: absolute;
    overflow: auto;
    background-color: #ffffff;
    border: 1px solid #c7c7c7;
    border-radius: .2rem;
    z-index: 99;

    .option-list {
      list-style-type: none;
      padding: 0;
      margin: 0;

      .option-list-item {
        padding: .2rem 1rem;
        border-bottom: 1px solid #7a7a7a;
        cursor: pointer;
      }
    }
  }
}
</style>
