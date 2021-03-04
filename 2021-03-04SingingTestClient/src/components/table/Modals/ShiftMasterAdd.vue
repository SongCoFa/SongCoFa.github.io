<template>
  <div>
    <b-button
      squared
      class="container-border"
      variant="primary"
      @click="init"
      :disabled="!writable"
    >
      新增
    </b-button>

    <b-modal
      ref="modal"
      centered
      scrollable
      title="新增仕業"
      header-class="modal-head-footer-color"
      footer-class="modal-head-footer-color"
      body-class="modal-body-color"
    >
      <b-row>
        <b-col cols="6">
          <!-- 仕業名稱 -->
          <b-form-group label="仕業名稱">
            <b-form-input type="text" placeholder="仕業名稱" trim v-model="Master.shift_name" :state="required" />
          </b-form-group>

          <!-- 車輛號碼 -->
          <b-form-group label="車輛號碼">
            <!-- TODO: move to component -->
            <div class="option-area">
              <b-input-group>
                <b-form-input
                  type="text"
                  autocomplete="off"
                  trim
                  v-model="Master.bus_no"
                  placeholder="車輛號碼"
                  @input="startSelectVehicle"/>
                <b-input-group-append>
                  <b-btn variant="primary" @click="vehicleSelecting = !vehicleSelecting">
                    <font-awesome-icon :icon="['fas', 'angle-down']" size="xs" />
                  </b-btn>
                </b-input-group-append>
              </b-input-group>
              <div class="option-panel" v-if="vehicleSelecting && Master.bus_no">
                <ul class="option-list">
                  <li class="option-list-item" v-for="(item, key) in filterVehicle" :key="key" @click="setVehicle(item)">{{ item }}</li>
                </ul>
              </div>
            </div>
          </b-form-group>

          <!-- 失效日期 -->
          <b-form-group label="失效日期">
            <b-form-input type="date" v-model="Master.expire_date" />
          </b-form-group>
        </b-col>
        <b-col cols="6">
          <!-- 駕駛編號 -->
          <b-form-group label="駕駛編號">
            <b-form-select
              class="form-control"
              :options="driverList"
              value-field="value"
              text-field="text"
              v-model="Master.emp_ID"
            >
            </b-form-select>
          </b-form-group>

          <!-- 生效日期 -->
          <b-form-group label="生效日期">
            <b-form-input type="date" v-model="Master.active_date" />
          </b-form-group>

          <!-- 備註 -->
          <b-form-group label="備註">
            <b-form-input type="text" v-model="Master.remark" />
          </b-form-group>
        </b-col>
      </b-row>
      <template v-slot:modal-footer>
        <b-button
          size="sm"
          block
          variant="primary"
          :disabled="!required"
          @click="handleOK"
        >新增</b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'ShiftMasterAdd',
  props: {
    writable: Boolean,
  },
  data() {
    return {
      Master: {
        shift_name: null,
        shift_name_new: null,
        emp_ID: null,
        bus_no: null,
        active_date: '2019-01-01',
        expire_date: '2199-12-31',
        remark: null,
      },
      cleanMaster: {
        shift_name: null,
        shift_name_new: null,
        emp_ID: null,
        bus_no: null,
        active_date: '2019-01-01',
        expire_date: '2199-12-31',
        remark: null,
      },

      vehicleSelecting: false,
      vehicleList: null,
    };
  },
  created() {
  },
  mounted() {
  },
  computed: {
    driverList() {
      const first = {
        text: '無',
        value: null,
      };

      if (this.$store.getters['DriverList/drivers']) {
        return [first, ...this.$store.getters['DriverList/drivers']];
      }

      return [first];
    },
    filterVehicle() {
      return this.vehicleList.filter(item => item.indexOf(this.Master.bus_no) !== -1);
    },
    required() {
      // check input state
      return this.Master.shift_name !== null && this.Master.shift_name !== '';
    },
  },
  methods: {
    init() {
      this.$refs.modal.show();
      this.$store.dispatch('DriverList/getDrivers');
      this.getVehicle();
    },
    getVehicle() {
      this.$http.post(`${process.env.VUE_APP_BASE_API}/api/vehicle/GetList`, { bus_no: null, bus_mark: null, manufacturing_year: null })
        .then((response) => {
          const result = response.data.Resource;
          this.vehicleList = [...new Set(result.map(item => item.bus_no))];
        })
        .catch(e => console.log(e));
    },
    startSelectVehicle() {
      this.vehicleSelecting = true;
    },
    setVehicle(vehicle) {
      this.Master.bus_no = vehicle;
      this.vehicleSelecting = false;
    },
    handleOK() {
      const api = `${process.env.VUE_APP_BASE_API}/api/shift/UpsertMasterList`;

      if (this.Master.bus_no === '') {
        this.Master.bus_no = null;
      }

      const send = [this.Master];
      const member = window.sessionStorage.getItem('member');
      if (member === 'visitor') {
        alert('使用者權限不足');
        return;
      }

      this.$http.post(api, send)
        .then((response) => {
          console.log(response.data);
          this.$emit('refreshData');
          this.$refs.modal.hide();
        })
        .catch(e => console.log(e));
      this.Master = this.cleanMaster;
    },
  },
};
</script>

<style lang="scss" scoped>
.container-border {
  border: 1px solid #aaaaaa;
}
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
