<template>
  <div>
    <b-button variant="primary" size="sm" class="mx-1" @click="init" :disabled="isDisabled || !writable">
      <font-awesome-icon :icon="['far', 'edit']" />
    </b-button>

    <b-modal
      ref="modal"
      title="仕業班次編輯"
      centered
      scrollable
      size="lg"
      header-class="modal-head-footer-color"
      footer-class="modal-head-footer-color"
      body-class="modal-body-color"
    >
      <b-row>
        <b-col cols="6">
          <!-- 路線編號 -->
          <!-- <b-form-group label="路線編號">
            <b-form-input type="text" placeholder="路線編號" trim v-model="editable.SubRouteUID"/>
          </b-form-group> -->
          <b-form-group label="路線(編號/方向)">
            <div class="option-area">
              <b-input-group>
                <b-form-input
                  type="text"
                  autocomplete="off"
                  trim
                  v-model="displayInput"
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
              <div class="option-panel" v-if="routeSelecting && displayInput">
                <ul class="option-list">
                  <li class="option-list-item" v-for="(item, key) in filterRoute" :key="key" @click="setRoute(item)">{{ item.DisplayRouteID }} / {{ item.Direction === 'true' ? '返程' : '去程' }} / {{ item.SubRouteName }} </li>
                </ul>
              </div>
            </div>
          </b-form-group>

          <!-- 駕駛編號 -->
          <b-form-group label="駕駛編號">
            <b-form-select
              class="form-control"
              v-model="editable.emp_ID"
              :options="driverList"
              value-field="value"
              text-field="text"
            ></b-form-select>
          </b-form-group>

          <!-- 預估發車時間 -->
          <b-form-group label="預估發車時間">
            <b-form-input type="time" v-model="editable.departure"></b-form-input>
          </b-form-group>

          <!-- 備註 -->
          <b-form-group label="備註">
            <b-form-input type="text" placeholder="備註" trim v-model="editable.remark"></b-form-input>
          </b-form-group>

          <!-- 周二行駛 -->
          <b-form-group label="周二行駛">
            <b-form-select v-model="editable.is_tue">
              <option :value="null">請選擇</option>
              <option value="false">不行駛</option>
              <option value="true">行駛</option>
            </b-form-select>
          </b-form-group>

          <!-- 周四行駛 -->
          <b-form-group label="周四行駛">
            <b-form-select v-model="editable.is_thu">
              <option :value="null">請選擇</option>
              <option value="false">不行駛</option>
              <option value="true">行駛</option>
            </b-form-select>
          </b-form-group>

          <!-- 周六行駛 -->
          <b-form-group label="周六行駛">
            <b-form-select v-model="editable.is_sat">
              <option :value="null">請選擇</option>
              <option value="false">不行駛</option>
              <option value="true">行駛</option>
            </b-form-select>
          </b-form-group>

          <!-- 生效日期 -->
          <b-form-group label="生效日期">
            <b-form-input type="date" v-model="editable.active_date"></b-form-input>
          </b-form-group>

          <!-- 中間站 -->
          <ShiftIntermediateStations
            :value="editable"
            @updateIntermediateStations="updateIntermediateStations"
          ></ShiftIntermediateStations>
        </b-col>
        <b-col cols="6">
          <!-- 仕業名稱 -->
          <!-- <b-form-group label="仕業名稱">
            <b-form-input type="text" placeholder="仕業名稱" trim v-model="editable.shift_name" />
          </b-form-group> -->

          <!-- 路線方向 -->
          <b-form-group label="路線方向">
            <b-form-select class="form-control" v-model="editable.direction" disabled>
              <option :value="null">請選擇</option>
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
                  v-model="editable.bus_no"
                  placeholder="車輛號碼"
                  @input="startSelectVehicle"/>
                <b-input-group-append>
                  <b-btn variant="primary" @click="vehicleSelecting = !vehicleSelecting">
                    <font-awesome-icon :icon="['fas', 'angle-down']" size="xs" />
                  </b-btn>
                </b-input-group-append>
              </b-input-group>
              <div class="option-panel" v-if="vehicleSelecting && editable.bus_no">
                <ul class="option-list">
                  <li class="option-list-item" v-for="(item, key) in filterVehicle" :key="key" @click="setVehicle(item)">{{ item }}</li>
                </ul>
              </div>
            </div>
          </b-form-group>

          <!-- 預估到終點站時間 -->
          <b-form-group label="預估到終點站時間">
            <b-form-input type="time" placeholder="預估到終點站時間" v-model="editable.arrival"></b-form-input>
          </b-form-group>

          <!-- 周一行駛 -->
          <b-form-group label="周一行駛">
            <b-form-select v-model="editable.is_mon">
              <option :value="null">請選擇</option>
              <option value="false">不行駛</option>
              <option value="true">行駛</option>
            </b-form-select>
          </b-form-group>

          <!-- 周三行駛 -->
          <b-form-group label="周三行駛">
            <b-form-select v-model="editable.is_wed">
              <option :value="null">請選擇</option>
              <option value="false">不行駛</option>
              <option value="true">行駛</option>
            </b-form-select>
          </b-form-group>

          <!-- 周五行駛 -->
          <b-form-group label="周五行駛">
            <b-form-select v-model="editable.is_fri">
              <option :value="null">請選擇</option>
              <option value="false">不行駛</option>
              <option value="true">行駛</option>
            </b-form-select>
          </b-form-group>

          <!-- 周日行駛 -->
          <b-form-group label="周日行駛">
            <b-form-select v-model="editable.is_sun">
              <option :value="null">請選擇</option>
              <option value="false">不行駛</option>
              <option value="true">行駛</option>
            </b-form-select>
          </b-form-group>

          <!-- 失效日期 -->
          <b-form-group label="失效日期">
            <b-form-input type="date" v-model="editable.expire_date"></b-form-input>
          </b-form-group>
        </b-col>
      </b-row>

      <template v-slot:modal-footer>
        <b-button
          size="sm"
          block
          variant="primary"
          @click="handleEdit();"
        >修改</b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
import ShiftIntermediateStations from '@/components/InputTool/Extend/ShiftIntermediateStations.vue';

export default {
  name: 'ShiftEdit',
  components: {
    ShiftIntermediateStations,
  },
  props: {
    data: Object,
    DriverList: Array,
    writable: Boolean,
  },
  data() {
    return {
      // editable: null,

      routeSelecting: false,
      routeList: null,

      vehicleSelecting: false,
      vehicleList: null,

      displayInput: null,
      editable: [
        { DisplayRouteID: null },
      ],
    };
  },
  watch: {
  },
  created() {
    if (this.data) {
      // this.editable = Object.assign({}, this.data);
      // this.editable = this.data;
      this.editable = JSON.parse(JSON.stringify(this.data));
    }
  },
  mounted() {
  },
  computed: {
    isDisabled() {
      if (this.data.in_deleted) {
        return true;
      }

      return false;
    },
    driverList() {
      return this.$store.getters['DriverList/drivers'];
    },
    filterRoute() {
      return this.routeList.filter(item => item.DisplayRouteID.indexOf(this.displayInput) !== -1);
    },
    filterVehicle() {
      return this.vehicleList.filter(item => item.indexOf(this.editable.bus_no) !== -1);
    },
  },
  methods: {
    init() {
      this.$refs.modal.show();
      this.getRoute();
      this.getVehicle();
      this.displayInput = `${this.data.DisplayRouteID} / ${this.data.Direction === 'true' ? '返程' : '去程'} / ${this.data.SubRouteName}`;
    },
    getRoute() {
      this.$http.post(`${process.env.VUE_APP_BASE_API}/api/route/GetList`, { RouteID: null, DisplayRouteID: null, Direction: null })
        .then((response) => {
          const result = response.data.Resource;
          const list = result.map((item) => {
            const obj = {};
            obj.DisplayRouteID = item.DisplayRouteID;
            obj.SubRouteUID = item.SubRouteUID;
            obj.SubRouteName = item.SubRouteName;
            obj.Direction = item.Direction;
            return obj;
          });
          this.routeList = [...new Set(list)];
        })
        .catch(e => console.log(e));
    },
    getVehicle() {
      this.$http.post(`${process.env.VUE_APP_BASE_API}/api/vehicle/GetList`, { bus_no: null, bus_mark: null, manufacturing_year: null })
        .then((response) => {
          // console.log(response);
          const result = response.data.Resource;
          this.vehicleList = [...new Set(result.map(item => item.bus_no))];
        })
        .catch(e => console.log(e));
    },
    startSelectRoute() {
      this.routeSelecting = true;
    },
    setRoute(item) {
      this.editable.SubRouteUID = item.SubRouteUID;
      this.editable.DisplayRouteID = item.DisplayRouteID;
      this.editable.direction = item.Direction;
      this.routeSelecting = false;
      this.displayInput = `${item.DisplayRouteID} / ${item.Direction === 'true' ? '返程' : '去程'} / ${item.SubRouteName}`;
    },
    startSelectVehicle() {
      this.vehicleSelecting = true;
    },
    setVehicle(vehicle) {
      this.editable.bus_no = vehicle;
      this.vehicleSelecting = false;
    },
    updateIntermediateStations(value) {
      this.editable.intermediate_stations = JSON.stringify(value);
    },
    handleEdit() {
      const temp = JSON.parse(JSON.stringify(this.editable));
      this.$set(temp, 'in_edited', true);
      this.$emit('updateEdited', temp);
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
