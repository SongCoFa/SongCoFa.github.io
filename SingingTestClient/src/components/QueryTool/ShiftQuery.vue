<template>
  <div ref="QueryToolArea">
    <b-row class="m-0">
      <b-col class="p-0">
        <b-nav align="left">
          <div class="btn btn-primary container-border rounded-0" @click="setQueryAreaCollapse">
            查詢
            <font-awesome-icon :icon="['fas', 'plus-circle']" v-if="isQueryAreaCollapsed" />
            <font-awesome-icon :icon="['fas', 'minus-circle']" v-else />
          </div>
        </b-nav>
      </b-col>
      <b-col class="p-0">
        <b-nav align="right">
          <ShiftMasterAdd @refreshData="refreshData" :writable="writable"></ShiftMasterAdd>
          <ImportShift @resetAllData="resetAllData" :writable="writable"></ImportShift>
        </b-nav>
      </b-col>
    </b-row>
    <div class="bg-light container-border p-3" :hidden="isQueryAreaCollapsed">
      <div class="row">
        <div class="col-12 col-sm">
          <b-form-group label="駕駛編號">
            <b-form-select
              class="form-control"
              v-model="querySet.EmpID"
              :options="driverList"
              value-field="value"
              text-field="text"
            >
            </b-form-select>
          </b-form-group>
        </div>
        <div class="col-12 col-sm">
          <b-form-group label="仕業名稱">
            <b-form-input type="text" v-model="querySet.ShiftName" placeholder="請輸入仕業名稱" trim />
          </b-form-group>
        </div>
        <div class="col-12 col-sm">
          <b-form-group label="車輛">
            <b-form-input type="text" v-model="querySet.BusNumber" placeholder="請輸入車輛號碼" trim />
          </b-form-group>
        </div>
      </div>
      <b-row>
        <b-button block variant="primary" class="mt-3 mx-3" @click="GetResult">查詢</b-button>
      </b-row>
    </div>
  </div>
</template>

<script>
import ShiftMasterAdd from '@/components/table/Modals/ShiftMasterAdd.vue';
import ImportShift from '@/components/table/Modals/ImportShift.vue';

export default {
  name: 'ShiftQuery',
  components: {
    ShiftMasterAdd,
    ImportShift,
  },
  props: {
    ImportListFormat: Array,
    writable: Boolean,
  },
  data() {
    return {
      isQueryAreaCollapsed: false,
      querySet: {
        EmpID: null,
        ShiftName: null,
        BusNumber: null,
      },
      driverList: [
        {
          text: '請選擇駕駛',
          value: null,
        },
      ],
    };
  },
  created() {
    this.getDriver();
  },
  methods: {
    getDriver() {
      const api = `${process.env.VUE_APP_BASE_API}/api/driver/GetList`;
      const condition = {
        emp_ID: null,
        emp_name: null,
        dept: null,
        expired:1,
      };

      this.$http.post(api, condition)
        .then((response) => {
          const filterResult = response.data.Resource.filter(item => item.title === '駕駛長');

          const list = filterResult.map((item) => {
            const obj = {};
            obj.text = `${item.emp_ID} / ${item.emp_name}`;
            obj.value = item.emp_ID;
            return obj;
          });

          this.driverList.push(...list);
        })
        .catch(error => console.log(error));
    },
    setQueryAreaCollapse() {
      this.isQueryAreaCollapsed = !this.isQueryAreaCollapsed;
      this.UpdateContentSize();
    },
    UpdateContentSize() {
      this.$nextTick(() => {
        this.$emit('UpdateContentSize');
      });
    },
    async GetResult() {
      const api = `${process.env.VUE_APP_BASE_API}/api/shift/GetMasterList`;

      const send = {
        shift_name: this.querySet.ShiftName === '' ? null : this.querySet.ShiftName,
        bus_no: this.querySet.BusNumber === '' ? null : this.querySet.BusNumber,
        emp_id: this.querySet.EmpID === '' ? null : this.querySet.EmpID,
      };

      const result = await this.$http.post(api, send)
        .then(response => response.data.Resource)
        // .then(response => console.log(response))
        .catch(e => console.log(e));

      this.$emit('UpdateResult', result);
    },
    refreshData() {
      this.$emit('refreshData');
    },
    resetAllData() {
      this.$emit('resetAllData');
    },
  },
};
</script>

<style lang="scss" scoped>
.container-border {
  border: 1px solid #aaaaaa;
}
</style>
