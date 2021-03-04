<template>
  <div>
    <label for="">{{ descript }}</label>
    <b-button variant="primary" size="sm" class="float-right" @click="$refs.IntermediateStationsModal.show()">
      <font-awesome-icon :icon="['fas', 'pencil-alt']" size="xs" />
    </b-button>
    <b-list-group class="mt-2" v-if="inputLength !== 0">
      <b-list-group-item class="p-2" v-for="(item, key) in content" :key="key">
        {{ item.station_fullname }}
      </b-list-group-item>
    </b-list-group>
    <b-list-group class="mt-2" v-else>
      <b-list-group-item>
        {{ `尚無站點資料` }}
      </b-list-group-item>
    </b-list-group>

    <b-modal
      ref="IntermediateStationsModal"
      centered
      scrollable
      :title="modalTitle"
      header-class="modal-head-footer-color"
      footer-class="modal-head-footer-color"
      body-class="modal-body-color"
    >
      <div class="container-fluid list-area">
        <div class="row mb-2" v-for="(item, key) in content" :key="key">
          <b-input-group class="col-10 p-0">
            <b-form-input v-model="content[key].station_fullname" :value="item.station_fullname"></b-form-input>
            <template v-slot:append>
              <b-dropdown
                right
                menu-class="select-panel"
              >
                <template v-if="stopSelections && stopSelections.length > 0">
                  <b-dropdown-item
                    class="select-drops"
                    v-for="(item, index) in stopSelections"
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
  name: 'IntermediateStations',
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
      type: 'TextList',
      content: [],

      rowData: this.$parent.$parent.$parent.$options.parent.item || [],
      stopSelections: [],
    };
  },
  created() {
    this.content = JSON.parse(this.input);

    let name = '';

    if (this.rowData.SubRouteUID) {
      name = this.rowData.SubRouteUID;
    } else {
      name = '';
    }

    if (this.content == null || this.content.length === 0) {
      this.content = [{
        StopUID: `${name}01`,
        station_fullname: '',
        seq: 1,
      }];
    }

    this.$http
      .post(`${process.env.VUE_APP_BASE_API}/api/route/GetStopList`, { SubRouteUID: this.rowData.SubRouteUID, Direction: this.rowData.Direction })
      .then((response) => {
        console.log(response.data.Resource);
        this.stopSelections = response.data.Resource;
      })
      .catch(e => console.log(e));
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
    api() {
      return {
        descript: this.descript,
        type: this.type,
        content: this.content,
      };
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
    add(key) {
      const seqValue = key + 1;
      const generateSeq = ((seqValue + 1) < 10) ? `0${seqValue + 1}` : `${seqValue + 1}`;

      let name = '';

      if (this.rowData.SubRouteUID) {
        name = this.rowData.SubRouteUID;
      } else {
        name = '';
      }

      // FIXME: 新增資料會沒有 SubRouteUID, 因此 StopUID 會有undefiend
      this.content.splice(seqValue, 0, {
        StopUID: `${name}${generateSeq}`,
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
      if (this.content.length < 2) return;

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
      this.content[index].StopUID = item.StopUID;
    },
    set() {
      if (this.content[0].station_fullname === '') {
        this.input = '[]';
      } else {
        this.input = JSON.stringify(this.content);
      }

      this.$refs.IntermediateStationsModal.hide();
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
