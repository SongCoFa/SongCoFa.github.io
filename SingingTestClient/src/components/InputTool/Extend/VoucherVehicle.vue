<template>
  <b-form-group label="車輛號碼">
    <div class="option-area">
      <b-input-group>
        <b-form-input
          type="text"
          autocomplete="off"
          trim
          v-model="input"
          placeholder="車輛號碼"
          @input="startSelectVehicle"
          :state="state"
          v-cloak
        />
        <b-input-group-append>
          <b-btn variant="primary" @click="vehicleSelecting = !vehicleSelecting">
            <font-awesome-icon :icon="['fas', 'angle-down']" size="xs" />
          </b-btn>
        </b-input-group-append>
      </b-input-group>
      <div class="option-panel" v-if="vehicleSelecting && input">
        <ul class="option-list">
          <li class="option-list-item" v-for="(item, key) in filterVehicle" :key="key" @click="setVehicle(item)">{{ item }}</li>
        </ul>
      </div>
    </div>
  </b-form-group>
</template>

<script>
export default {
  name: 'VoucherVehicle',
  components: {
  },
  props: {
    defaultInput: String,
    required: Boolean,
  },
  data() {
    return {
      input: this.defaultInput,
      backendFieldName: 'bus_no',
      descript: '車輛號碼',
      type: 'String',
      content: null,

      vehicleSelecting: false,
      vehicleList: null,
    };
  },
  watch: {
    input(value) {
      // eslint-disable-next-line no-param-reassign
      if (!value) value = null;
      const send = {
        componentName: this.$options.name,
        backendFieldName: this.backendFieldName,
        value,
        state: this.state,
      };
      console.log(send);
      this.$emit('updateInput', send);
    },
  },
  computed: {
    state() {
      return this.required ? !!this.input : null;
    },
    api() {
      return {
        descript: this.descript,
        type: this.type,
        content: this.content,
      };
    },
    filterVehicle() {
      return this.vehicleList.filter(item => item.indexOf(this.input) !== -1);
    },
  },
  created() {
    this.getVehicle();
    this.defaultValue();
  },
  methods: {
    getVehicle() {
      this.$http.post(`${process.env.VUE_APP_BASE_API}/api/vehicle/GetList`, { bus_no: null, bus_mark: null, manufacturing_year: null })
        .then((response) => {
          const result = response.data.Resource;
          this.vehicleList = [...new Set(result.map(item => item.bus_no))];
          console.log(this.vehicleList);
        })
        .catch(e => console.log(e));
    },
    startSelectVehicle() {
      this.vehicleSelecting = true;
    },
    setVehicle(vehicle) {
      this.input = vehicle;
      this.vehicleSelecting = false;
    },
    defaultValue() {
      const send = {
        componentName: this.$options.name,
        backendFieldName: this.backendFieldName,
        value: this.input,
        state: this.state,
      };

      this.$emit('updateInput', send);
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
