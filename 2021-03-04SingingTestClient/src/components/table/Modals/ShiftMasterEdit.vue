<template>
  <div class="d-inline-block">
    <b-button class="ml-2" variant="primary" size="sm" @click="init" :disabled="!shiftMasterData.shift_name || !writable">
      <font-awesome-icon :icon="['far', 'edit']" size="lg" />
    </b-button>

    <b-modal
      ref="modal"
      centered
      scrollable
      title="編輯仕業"
      header-class="modal-head-footer-color"
      footer-class="modal-head-footer-color"
      body-class="modal-body-color"
    >
      <b-row>
        <b-col cols="6">
          <b-form-group label="仕業名稱">
            <b-form-input type="text" v-model="shiftMaster.shift_name_new" :state="required"></b-form-input>
          </b-form-group>
          <b-form-group label="車輛號碼">
            <div class="option-area">
              <b-input-group>
                <b-form-input
                  type="text"
                  autocomplete="off"
                  trim
                  v-model="shiftMaster.bus_no"
                  placeholder="車輛號碼"
                  @input="startSelectVehicle"/>
                <b-input-group-append>
                  <b-btn variant="primary" @click="vehicleSelecting = !vehicleSelecting">
                    <font-awesome-icon :icon="['fas', 'angle-down']" size="xs" />
                  </b-btn>
                </b-input-group-append>
              </b-input-group>
              <div class="option-panel" v-if="vehicleSelecting && shiftMaster.bus_no">
                <ul class="option-list">
                  <li class="option-list-item" v-for="(item, key) in filterVehicle" :key="key" @click="setVehicle(item)">{{ item }}</li>
                </ul>
              </div>
            </div>
          </b-form-group>
        </b-col>
        <b-col cols="6">
          <b-form-group label="駕駛編號">
            <b-form-select
              class="form-control"
              :options="driverList"
              value-field="value"
              text-field="text"
              v-model="shiftMaster.emp_ID"
            >
            </b-form-select>
          </b-form-group>
        </b-col>
      </b-row>

      <template v-slot:modal-footer>
        <b-button
          size="sm"
          variant="danger"
          :disabled="!shiftMaster.shift_name"
          class="mx-2"
          @click="handleDelete"
        >刪除</b-button>
        <b-button
          size="sm"
          variant="primary"
          :disabled="!required"
          @click="handleOK"
        >變更</b-button>
      </template>
    </b-modal>
  </div>
</template>

<script>
export default {
  name: 'ShiftMasterEdit',
  props: {
    shiftMasterData: Object,
    writable: Boolean,
  },
  data() {
    return {
      shiftMaster: {
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
      return this.vehicleList.filter(item => item.indexOf(this.shiftMaster.bus_no) !== -1);
    },
    required() {
      // check input state
      return this.shiftMaster.shift_name !== null && this.shiftMaster.shift_name !== '';
    },
  },
  methods: {
    init() {
      this.$refs.modal.show();
      this.$store.dispatch('DriverList/getDrivers');
      this.getVehicle();
      const temp = Object.assign({}, this.shiftMasterData);
      this.shiftMaster.shift_name = temp.shift_name;
      this.shiftMaster.shift_name_new = temp.shift_name;
      this.shiftMaster.emp_ID = temp.emp_ID;
      this.shiftMaster.bus_no = temp.bus_no;
      // console.log(temp);
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
      this.shiftMaster.bus_no = vehicle;
      this.vehicleSelecting = false;
    },
    handleOK() {
      const api = `${process.env.VUE_APP_BASE_API}/api/shift/UpsertMasterList`;

      const send = [this.shiftMaster];
      const member = window.sessionStorage.getItem('member');
      if (member === 'visitor') {
        alert('使用者權限不足');
        return;
      }

      this.$http.post(api, send)
        .then((response) => {
          // console.log(response.data);
          this.$emit('refreshData');
          this.$refs.modal.hide();
        })
        .catch(e => console.log(e));
    },
    handleDelete() {
      const api = `${process.env.VUE_APP_BASE_API}/api/shift/DeleteMasterList`;
      const member = window.sessionStorage.getItem('member');
      if (member === 'visitor') {
        alert('使用者權限不足');
        return;
      }

      this.$bvModal.msgBoxConfirm('將刪除本仕業主表及詳細資料，請確認是否執行', {
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
        if (value === true) {
          const send = [this.shiftMaster];

          this.$http.post(api, send)
            .then((response) => {
              // console.log(response.data);
              this.$emit('refreshData');
              this.$refs.modal.hide();
            })
            .catch(e => console.log(e));
        }
      })
      .catch(e => console.log(e));
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
