<template>
  <b-form-group :label="descript">
    <div class="option-area">
      <b-input-group>
        <b-form-input
          type="text"
          autocomplete="off"
          trim
          v-model="inputed"
          placeholder="路線(編號/方向)"
          @input="startSelectRoute"
          v-cloak
          :state="state"
        >
        </b-form-input>
        <b-input-group-append>
          <b-btn variant="primary" @click="routeSelecting = !routeSelecting">
            <font-awesome-icon :icon="['fas', 'angle-down']" size="xs" />
          </b-btn>
        </b-input-group-append>
      </b-input-group>
      <div class="option-panel" v-if="routeSelecting && input">
        <ul class="option-list">
          <li class="option-list-item" v-for="(item, key) in filterRoute" :key="key" @click="setRoute(item)">{{ item.DisplayRouteID }} / {{ item.Direction === 'true' ? '返程' : '去程' }} / {{ item.SubRouteName }}</li>
        </ul>
      </div>
    </div>
  </b-form-group>
</template>

<script>
export default {
  name: 'VoucherRoute',
  components: {
  },
  props: {
    defaultInput: String,
    required: Boolean,
  },
  data() {
    return {
      input: this.defaultInput,
      displayInput: null,
      backendFieldName: 'SubRouteUID',
      descript: '路線編號',
      type: 'String',
      content: null,

      routeSelecting: false,
      routeList: null,
    };
  },
  watch: {
    input(value) {
      if (value && value !== '') return;

      this.displayInput = null;

      const sendSubRouteUID = {
        componentName: this.$options.name,
        backendFieldName: this.backendFieldName,
        value: null,
        state: this.state,
      };

      const sendDisplayRoute = {
        componentName: this.$options.name,
        backendFieldName: '路線編號',
        value: null,
        state: this.state,
      };

      const sendDirection = {
        componentName: this.$options.name,
        backendFieldName: 'Direction',
        value: null,
        state: this.state,
      };

      this.$emit('updateInput', sendSubRouteUID);
      this.$emit('updateInput', sendDisplayRoute);
      this.$emit('updateInput', sendDirection);
      this.routeSelecting = false;
    },
  },
  computed: {
    inputed: {
      // eslint-disable-next-line func-names
      get() {
        return this.displayInput;
      },

      // eslint-disable-next-line func-names
      set(e) {
        this.input = e;
      },
    },
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
    filterRoute() {
      return this.routeList.filter(item => item.DisplayRouteID.indexOf(this.input) !== -1);
    },
  },
  created() {
    this.getRoute();
    this.queryRoute();
  },
  methods: {
    async getRoute() {
      // 取得路線清單，用來提供選擇清單
      const res = await this.$http.post(`${process.env.VUE_APP_BASE_API}/api/route/GetList`, { RouteID: null, Direction: null })
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

          return list;
        })
        .catch(e => console.log(e));

      this.routeList = [...new Set(res)];
    },
    async queryRoute() {
      // 確定路線 要 RouteID+Direction 才保證是唯一路線 用來顯示預設值
      const rowItem = this.$parent.$parent.$parent.$parent.item;

      console.log(rowItem);

      if (!rowItem) {
        this.displayInput = null;
      } else {
        const res = await this.$http.post(`${process.env.VUE_APP_BASE_API}/api/route/GetList`, { RouteID: rowItem.SubRouteUID, Direction: rowItem.Direction })
          .then(response => response.data.Resource)
          .catch(e => console.log(e));

        this.defaultValue(res[0]);
        this.displayInput = `${res[0].DisplayRouteID} / ${res[0].Direction === 'true' ? '返程' : '去程'} / ${res[0].SubRouteName}`;
      }
    },
    startSelectRoute() {
      this.routeSelecting = true;
    },
    setRoute(item) {
      console.log(item);
      this.displayInput = `${item.DisplayRouteID} / ${item.Direction === 'true' ? '返程' : '去程'} / ${item.SubRouteName}`;

      const sendSubRouteUID = {
        componentName: this.$options.name,
        backendFieldName: this.backendFieldName,
        value: item.SubRouteUID,
        state: this.state,
      };

      const sendDisplayRoute = {
        componentName: this.$options.name,
        backendFieldName: '路線編號',
        value: item.DisplayRouteID,
        state: this.state,
      };

      const sendDirection = {
        componentName: this.$options.name,
        backendFieldName: 'Direction',
        value: item.Direction,
        state: this.state,
      };

      this.$emit('updateInput', sendSubRouteUID);
      this.$emit('updateInput', sendDisplayRoute);
      this.$emit('updateInput', sendDirection);
      this.routeSelecting = false;
    },
    defaultValue(item) {
      console.log(item);
      const sendSubRouteUID = {
        componentName: this.$options.name,
        backendFieldName: this.backendFieldName,
        value: item.SubRouteUID,
        state: this.state,
      };

      const sendDisplayRoute = {
        componentName: this.$options.name,
        backendFieldName: '路線編號',
        value: item.DisplayRouteID,
        state: this.state,
      };

      const sendDirection = {
        componentName: this.$options.name,
        backendFieldName: 'Direction',
        value: item.Direction,
        state: this.state,
      };

      this.$emit('updateInput', sendSubRouteUID);
      this.$emit('updateInput', sendDisplayRoute);
      this.$emit('updateInput', sendDirection);
      this.routeSelecting = false;
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
