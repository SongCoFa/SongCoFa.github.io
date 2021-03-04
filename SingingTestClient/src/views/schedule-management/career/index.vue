<template>
  <b-container ref="Content" class="mb-2" fluid>
    <ShiftQuery
      ref="QueryArea"
      :writable="writable"
      @UpdateContentSize="UpdateContentSize"
      @UpdateResult="UpdateResult"
      @refreshData="refreshData"
      @resetAllData="resetAllData"
    />
    <b-row class="operate-panel" no-gutters :style="containerHeight">
      <b-col cols="2" class="left-panel">
        <div class="left-panel-head text-center">仕業</div>
        <div class="left-panel-content">
          <b-list-group>
            <b-list-group-item class="row-item rounded-0 p-0" v-for="(item, key) in masterList" :key="key">
              <span class="d-inline-block name pl-2 py-2">{{ item.shift_name }}</span>
              <b-button
                class="d-inline-block button-left customize-button-click"
                squared
                @click="GetShift(item, 'first')"
                :pressed="item.shift_name === firstShiftName"
              >1</b-button>
              <b-button
                class="d-inline-block button-right customize-button-click"
                squared
                @click="GetShift(item, 'second')"
                :pressed="item.shift_name === secondShiftName"
              >2</b-button>
            </b-list-group-item>
          </b-list-group>
        </div>
      </b-col>
      <b-col cols="10" class="view-panel">
        <ShiftTable
          :shiftMaster="firstShiftMaster"
          :table="firstShift"
          :shiftName="firstShiftName"
          :busyState="firstShiftBusyState"
          :writable="writable"
          @storedSelectedShift="storedSelectedShift($event, 'first')"
          @updateEdited="updateEdited($event, 'first')"
          @addNewRecord="addNewRecord($event, 'first')"
          @removeRecords="removeRecords('first')"
          @executeUpdateShift="executeUpdateShift('first')"
          @refreshData="refreshMasterData('first')"
          class="top" />
        <div class="action-bar px-2">
          <b-form-checkbox class="ml-4" v-model="duplicate">複製</b-form-checkbox>
          <b-button size="sm" class="move-button ml-5 mr-1" @click="toUp"><font-awesome-icon :icon="['fas', 'arrow-up']" size="2x" /></b-button>
          <b-button size="sm" class="move-button" @click="toDown"><font-awesome-icon :icon="['fas', 'arrow-down']" size="2x" /></b-button>
        </div>
        <ShiftTable
          :shiftMaster="secondShiftMaster"
          :table="secondShift"
          :shiftName="secondShiftName"
          :busyState="secondShiftBusyState"
          :writable="writable"
          @storedSelectedShift="storedSelectedShift($event, 'second')"
          @updateEdited="updateEdited($event, 'second')"
          @addNewRecord="addNewRecord($event, 'second')"
          @removeRecords="removeRecords('second')"
          @executeUpdateShift="executeUpdateShift('second')"
          @refreshData="refreshMasterData('second')"
          class="bottom"
        ></ShiftTable>
      </b-col>
    </b-row>
  </b-container>
</template>

<script>
import ShiftQuery from '@/components/QueryTool/ShiftQuery.vue';
import ShiftTable from '@/components/table/ShiftTable.vue';

export default {
  name: 'Career',
  components: {
    ShiftQuery,
    ShiftTable,
  },
  data() {
    return {
      containerHeight: '',
      masterList: null,
      duplicate: true,

      // 上方面板Master資料
      firstShiftMaster: {
        shift_name: null,
        emp_ID: null,
        bus_no: null,
      },
      // 下方面板Master資料
      secondShiftMaster: {
        shift_name: null,
        emp_ID: null,
        bus_no: null,
      },

      firstDriverName: null, // 上方面板選擇中的資料(駕駛名稱)
      secondDriverName: null, // 下方面板選擇中的資料(駕駛名稱)

      firstShiftName: null, // 上方面板選擇中的資料(仕業名稱)
      secondShiftName: null, // 下方面板選擇中的資料(仕業名稱)

      firstShift: null, // 上方面板查詢資料
      secondShift: null, // 下方面板查詢資料

      firstShiftBusyState: false,
      secondShiftBusyState: false,

      storedFirstShift: [], // 上方面板已選擇資料列
      storedSecondShift: [], // 下方面板已選擇資料列

      firstShiftRemoveSet: null, // 上方面板要刪除的資料組
      secondShiftRemoveSet: null, // 下方面板要刪除的資料組
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.UpdateContentSize();
      window.addEventListener('resize', this.UpdateContentSize);
    });
  },
  computed: {
    driverList() {
      return this.$store.getters['DriverList/driversRawData'];
    },
    writable() {
      return this.$store.getters.permissions.schedule_permission === 'W';
    },
  },
  methods: {
    UpdateContentSize() {
      // 計算內容高度樣式
      const totalHeight = this.$refs.Content.clientHeight;

      const queryAreaHeight = this.$refs.QueryArea.$refs.QueryToolArea.clientHeight;

      this.containerHeight = `height: ${totalHeight - queryAreaHeight}px`;
    },
    UpdateResult(result) {
      // 更新仕業一覽查詢結果
      this.masterList = result;
    },
    refreshData() {
      this.$refs.QueryArea.GetResult();
    },
    refreshMasterData(position) {
      this.$refs.QueryArea.GetResult();

      if (position === 'first') {
        this.clearFirstData();
      } else if (position === 'second') {
        this.clearSecondData();
      } else {
        console.log('主表更新失敗');
      }
    },
    resetAllData() {
      this.clearFirstData();
      this.clearSecondData();
    },

    clearData() {
      this.firstShift = null;
      this.secondShift = null;

      this.storedFirstShift = [];
      this.storedSecondShift = [];
    },
    clearFirstData() {
      this.firstShift = null;
      this.firstShiftName = null;
      this.firstDriverName = null;
      this.storedFirstShift = [];
      this.firstShiftMaster = {
        shift_name: null,
        emp_ID: null,
        bus_no: null,
      };
    },
    clearSecondData() {
      this.secondShift = null;
      this.secondShiftName = null;
      this.secondDriverName = null;
      this.storedSecondShift = [];
      this.secondShiftMaster = {
        shift_name: null,
        emp_ID: null,
        bus_no: null,
      };
    },

    GetShift(item, position, msg = '') {
      let boxMsg = '';

      if (msg === '') {
        boxMsg = '資料尚未更新是否離開';
      } else {
        boxMsg = msg;
      }

      // 相同仕業主表不能同時選擇
      if (item.shift_name === this.secondShiftName || item.shift_name === this.firstShiftName) return;

      if (position === 'first') {
        // 檢查是否有未更新資料
        if (this.firstShift) {
          if (this.firstShift.some(a => a.in_deleted || a.in_added || a.in_edited)) {
            this.$bvModal.msgBoxConfirm(boxMsg, {
              title: '訊息',
              size: 'sm',
              buttonSize: 'sm',
              okVariant: 'danger',
              okTitle: '離開',
              cancelTitle: '取消',
              footerClass: 'p-2',
              hideHeaderClose: false,
              centered: true,
            })
            .then((value) => {
              if (value) {
                this.clearFirstData();
                this.GetShiftDetail(item, position);
              }
            })
            .catch(e => console.log(e));
          } else {
            this.clearFirstData();
            this.GetShiftDetail(item, position);
          }
        } else {
          // 清空查詢和編輯暫存
          this.clearFirstData();

          // 根據 item 條件取得詳細資料
          this.GetShiftDetail(item, position);
        }
      } else if (position === 'second') {
        // 檢查是否有未更新資料
        if (this.secondShift) {
          if (this.secondShift.some(a => a.in_deleted || a.in_added || a.in_edited)) {
            this.$bvModal.msgBoxConfirm(boxMsg, {
              title: '訊息',
              size: 'sm',
              buttonSize: 'sm',
              okVariant: 'danger',
              okTitle: '離開',
              cancelTitle: '取消',
              footerClass: 'p-2',
              hideHeaderClose: false,
              centered: true,
            })
            .then((value) => {
              if (value) {
                this.clearSecondData();
                this.GetShiftDetail(item, position);
              }
            })
            .catch(e => console.log(e));
          } else {
            this.clearSecondData();
            this.GetShiftDetail(item, position);
          }
        } else {
          // 清空查詢和編輯暫存
          this.clearSecondData();

          // 根據 item 條件取得詳細資料
          this.GetShiftDetail(item, position);
        }
      } else {
        console.log('error');
      }
    },
    async GetShiftDetail(item, position) {
      // 設定已選擇條件
      if (position === 'first') {
        this.firstShiftName = item.shift_name;
        this.firstShiftMaster = item;
        this.firstShiftBusyState = true;
      } else if (position === 'second') {
        this.secondShiftName = item.shift_name;
        this.secondShiftMaster = item;
        this.secondShiftBusyState = true;
      } else {
        this.firstShiftBusyState = false;
        this.secondShiftBusyState = false;
      }

      const result = await this.$http.post(`${process.env.VUE_APP_BASE_API}/api/shift/GetList`, item)
        .then((response) => {
          // console.log(response, item);
          if (position === 'first') {
            const emp = this.driverList.filter(employee => employee.emp_ID === item.emp_ID);
            this.firstDriverName = emp[0].emp_name;
          } else if (position === 'second') {
            const emp = this.driverList.filter(employee => employee.emp_ID === item.emp_ID);
            this.secondDriverName = emp[0].emp_name;
          }
          this.firstShiftBusyState = false;
          this.secondShiftBusyState = false;
          return response.data.Resource;
        })
        .catch(e => console.log(e));

      result.map((a) => {
        const temp = a;
        temp.PK = this.uuid();
        return temp;
      });

      if (position === 'first') {
        this.firstShift = result;
      } else if (position === 'second') {
        this.secondShift = result;
      } else {
        console.log('取得資料失敗');
      }
    },
    uuid() {
      let d = Date.now();
      if (
        typeof performance !== 'undefined'
        && typeof performance.now === 'function'
      ) {
        d += performance.now(); // use high-precision timer if available
      }

      return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, (c) => {
        // eslint-disable-next-line no-bitwise
        const r = (d + Math.random() * 16) % 16 | 0;
        d = Math.floor(d / 16);
        // eslint-disable-next-line no-bitwise
        return (c === 'x' ? r : (r & 0x3) | 0x8).toString(16);
      });
    },

    storedSelectedShift(item, position) {
      let selectedStored = [];

      if (position === 'first') {
        selectedStored = this.storedFirstShift;
      } else if (position === 'second') {
        selectedStored = this.storedSecondShift;
      } else {
        selectedStored = [];
      }

      const checkSameItem = selectedStored.some(data => data.PK === item.PK);

      if (!checkSameItem) {
        selectedStored.push(item);
      } else {
        selectedStored.forEach((data, i) => {
          if (data.PK === item.PK) {
            // eslint-disable-next-line prefer-destructuring
            selectedStored.splice(i, 1);
          }
        });
      }
    },

    addNewRecord(item, position) {
      if (position === 'first') {
        if (this.firstShift == null) {
          alert('請先選擇資料');
        } else {
          // 查 員工ID 同時寫入員工姓名
          // eslint-disable-next-line no-param-reassign
          item = this.lookupDriver(item, item.emp_ID);

          // 賦予新的 row ID
          // eslint-disable-next-line no-param-reassign
          item.PK = this.uuid();

          this.$set(item, 'in_added', true);
          this.firstShift.push(item);
        }
      } else if (position === 'second') {
        if (this.secondShift == null) {
          alert('請先選擇資料');
        } else {
          // eslint-disable-next-line no-param-reassign
          item = this.lookupDriver(item, item.emp_ID);
          this.$set(item, 'in_added', true);
          this.secondShift.push(item);
        }
      } else {
        console.log('新增失敗');
      }
    },

    removeRecords(position) {
      // 移除選擇列
      if (position === 'first') {
        this.firstShift.forEach((item) => {
          this.storedFirstShift.forEach((a) => {
            if (item.PK === a.PK) {
              this.$set(item, 'in_deleted', true);
              this.$set(item, 'selected', false);
            }
          });
        });

        this.storedFirstShift.length = 0;
      } else if (position === 'second') {
        this.secondShift.forEach((item) => {
          this.storedSecondShift.forEach((a) => {
            if (item.PK === a.PK) {
              this.$set(item, 'in_deleted', true);
              this.$set(item, 'selected', false);
            }
          });
        });

        this.storedSecondShift.length = 0;
      } else {
        console.log('移除失敗');
      }
    },

    updateEdited(record, position) {
      // eslint-disable-next-line no-param-reassign
      record = this.lookupDriver(record, record.emp_ID);

      console.log(record);

      // 編輯後更新視圖顯示資料
      if (position === 'first') {
        this.firstShift.forEach((item, i) => {
          if (item.PK === record.PK) {
            this.$set(this.firstShift, i, record);
          }
        });
      } else if (position === 'second') {
        this.secondShift.forEach((item, i) => {
          if (item.PK === record.PK) {
            this.$set(this.secondShift, i, record);
          }
        });
      } else {
        console.log('更新失敗');
      }
    },

    async executeUpdateShift(position) {
      // 仕業更新時必須傳入整組的資料
      const api = `${process.env.VUE_APP_BASE_API}/api/shift/UpsertDelList`;

      let send = null;

      if (position === 'first') {
        // 去除要刪除的
        send = this.firstShift.filter(a => a.in_deleted !== true);

        // 清空班次 需要回傳 shift_name
        if (send.length === 0) {
          send.push({ shift_name: this.firstShiftName });
        }
      } else if (position === 'second') {
        // 去除要刪除的
        send = this.secondShift.filter(a => a.in_deleted !== true);

        // 清空班次 需要回傳 shift_name
        if (send.length === 0) {
          send.push({ shift_name: this.secondShiftName });
        }
      } else {
        console.log('更新失敗');
      }

      // 變更key值 為 回傳key值
      send.forEach((row) => {
        const temp = row;
        temp.Direction = temp.direction;
      });

      console.log(send);

      this.$http.post(api, send)
        .then((response) => {
          // console.log(response.data);

          this.$bvModal.msgBoxOk(response.data.Resource.ReturnMessage, {
            title: '訊息',
            size: 'sm',
            buttonSize: 'sm',
            okVariant: 'info',
            headerClass: 'p-2 border-bottom-0',
            footerClass: 'p-2 border-top-0',
            centered: true,
          })
          .then(() => {
            // 更新後自動查詢
            let oldSelected = null;

            if (position === 'first') {
              oldSelected = this.firstShiftMaster;
              this.GetShiftDetail(oldSelected, 'first');
            } else if (position === 'second') {
              oldSelected = this.secondShiftMaster;
              this.GetShiftDetail(oldSelected, 'second');
            } else {
              console.log('error');
            }
          })
          .catch(e => console.log(e));
        })
        .catch(e => console.log(e));
    },

    toUp() {
      if (this.firstShift == null || this.secondShift == null) return;

      // 複製或移動模式
      if (this.duplicate) {
        // 複製
        const sameItems = [];
        this.storedSecondShift.forEach((item) => {
          this.$set(item, 'selected', false);

          if (!this.firstShift.some(e => e.PK === item.PK)) {
            let movingItem = JSON.parse(JSON.stringify(item));

            movingItem.shift_name = this.firstShiftMaster.shift_name;
            movingItem.bus_no = this.firstShiftMaster.bus_no ? this.firstShiftMaster.bus_no : null;
            movingItem = this.lookupDriver(movingItem, this.firstShiftMaster.emp_ID);
            movingItem.emp_ID = this.firstShiftMaster.emp_ID;
            // movingItem.emp_name = this.firstShiftMaster.shift_name;
            movingItem.emp_name = this.firstDriverName;

            this.$set(movingItem, 'in_added', true);
            // console.log(movingItem);

            this.firstShift.push(movingItem);
          } else {
            sameItems.push(item.PK);
          }
        });

        if (sameItems.length > 0) {
          this.$bvModal.msgBoxOk('已存在相同資料', {
            title: '訊息',
            size: 'sm',
            buttonSize: 'sm',
            okVariant: 'info',
            headerClass: 'p-2 border-bottom-0',
            footerClass: 'p-2 border-top-0',
            centered: true,
          })
          .then((value) => {
            console.log(value);
          })
          .catch(e => console.log(e));
        }
      } else {
        // 移動
        const sameItems = [];
        this.storedSecondShift.forEach((item) => {
          this.$set(item, 'selected', false);

          if (!this.firstShift.some(e => e.PK === item.PK)) {
            let movingItem = JSON.parse(JSON.stringify(item));

            movingItem.shift_name = this.firstShiftMaster.shift_name;
            movingItem.bus_no = this.firstShiftMaster.bus_no ? this.firstShiftMaster.bus_no : null;
            movingItem = this.lookupDriver(movingItem, this.firstShiftMaster.emp_ID);
            movingItem.emp_ID = this.firstShiftMaster.emp_ID;
            movingItem.emp_name = this.firstShiftMaster.shift_name;

            this.$set(movingItem, 'in_added', true);

            this.firstShift.push(movingItem);
            this.secondShift.forEach((b) => {
              if (item.PK === b.PK) {
                // this.secondShift.splice(i, 1);
                this.$set(b, 'in_deleted', true);
              }
            });
          } else {
            sameItems.push(item.PK);
          }
        });

        if (sameItems.length > 0) {
          this.$bvModal.msgBoxOk('已存在相同資料', {
            title: '訊息',
            size: 'sm',
            buttonSize: 'sm',
            okVariant: 'info',
            headerClass: 'p-2 border-bottom-0',
            footerClass: 'p-2 border-top-0',
            centered: true,
          })
          .then(() => {})
          .catch(e => console.log(e));
        }
      }

      this.storedSecondShift.length = 0;
    },
    toDown() {
      if (this.firstShift == null || this.secondShift == null) return;

      if (this.duplicate) {
        const sameItems = [];
        this.storedFirstShift.forEach((item) => {
          this.$set(item, 'selected', false);

          if (!this.secondShift.some(e => e.PK === item.PK)) {
            let movingItem = JSON.parse(JSON.stringify(item));

            movingItem.shift_name = this.secondShiftMaster.shift_name;
            movingItem.bus_no = this.secondShiftMaster.bus_no ? this.secondShiftMaster.bus_no : null;
            movingItem = this.lookupDriver(movingItem, this.secondShiftMaster.emp_ID);
            movingItem.emp_ID = this.secondShiftMaster.emp_ID;
            // movingItem.emp_name = this.secondShiftMaster.shift_name;
            movingItem.emp_name = this.secondDriverName;

            this.$set(movingItem, 'in_added', true);

            this.secondShift.push(movingItem);
          } else {
            sameItems.push(item.PK);
          }
        });

        if (sameItems.length > 0) {
          this.$bvModal.msgBoxOk('已存在相同資料', {
            title: '訊息',
            size: 'sm',
            buttonSize: 'sm',
            okVariant: 'info',
            headerClass: 'p-2 border-bottom-0',
            footerClass: 'p-2 border-top-0',
            centered: true,
          })
          .then(() => {})
          .catch(e => console.log(e));
        }
      } else {
        const sameItems = [];
        this.storedFirstShift.forEach((item) => {
          this.$set(item, 'selected', false);

          if (!this.secondShift.some(e => e.PK === item.PK)) {
            let movingItem = JSON.parse(JSON.stringify(item));

            movingItem.shift_name = this.secondShiftMaster.shift_name;
            movingItem.bus_no = this.secondShiftMaster.bus_no ? this.secondShiftMaster.bus_no : null;
            movingItem = this.lookupDriver(movingItem, this.secondShiftMaster.emp_ID);
            movingItem.emp_ID = this.secondShiftMaster.emp_ID;
            movingItem.emp_name = this.secondShiftMaster.shift_name;

            this.$set(movingItem, 'in_added', true);
            // console.log(movingItem);

            this.secondShift.push(movingItem);
            this.firstShift.forEach((b) => {
              if (item.PK === b.PK) {
                // this.secondShift.splice(i, 1);
                this.$set(b, 'in_deleted', true);
              }
            });
          } else {
            sameItems.push(item.PK);
          }
        });

        if (sameItems.length > 0) {
          this.$bvModal.msgBoxOk('已存在相同資料', {
            title: '訊息',
            size: 'sm',
            buttonSize: 'sm',
            okVariant: 'info',
            headerClass: 'p-2 border-bottom-0',
            footerClass: 'p-2 border-top-0',
            centered: true,
          })
          .then((value) => {
            console.log(value);
          })
          .catch(e => console.log(e));
        }
      }

      this.storedFirstShift.length = 0;
    },

    lookupDriver(data, id = null) {
      const emp = this.driverList.filter(employee => employee.emp_ID === id);

      // eslint-disable-next-line no-param-reassign
      data.emp_name = emp.length > 0 ? emp[0].emp_name : null;
      // eslint-disable-next-line no-param-reassign
      data.emp_ID = emp.length > 0 ? emp[0].emp_ID : null;

      return data;
    },
  },
  beforeRouteLeave(to, from, next) {
    window.removeEventListener('resize', this.UpdateContentSize);
    next();
  },
};
</script>

<style lang="scss" scoped>
.customize-button-click:focus, .customize-button-click.focus {
  outline: 0;
  -webkit-box-shadow: none !important;
  box-shadow: none !important;
}

.operate-panel {
  flex: 1 1 auto;
  display: flex;
  overflow: hidden;
  flex-wrap: nowrap;

  > * {
    flex: 0 0 auto;
  }

  .left-panel {
    display: flex;
    flex-direction: column;

    .left-panel-head {
      color: #ffffff;
      background: #3e3a39;
      width: 100%;
      height: 40px;
      line-height: 40px;
      z-index: 99;
    }

    .left-panel-content {
      height: 100%;
      position: relative;
      overflow: auto;
      border: 1px solid #cfcfcf;

      .row-item {
        display: flex;
        flex-direction: row;

        .name {
          cursor: default;
          flex: 1;
        }

        .button-left {
          color: #000;
          width: 40px;
          line-height: 1em;
          text-align: center;
          background-color: #fff697;
          border: 1px solid #cfcfcf;
        }

        .button-right {
          color: #000;
          width: 40px;
          line-height: 1em;
          text-align: center;
          background-color: #b6d88e;
          border: 1px solid #cfcfcf;
        }

        .button-left:not(:disabled):not(.disabled):active,
        .button-left:not(:disabled):not(.disabled).active,
        .button-right:not(:disabled):not(.disabled):active,
        .button-right:not(:disabled):not(.disabled).active {
          background-color: rgba($color: #000000, $alpha: 0.3) !important;
        }

        .button-left.isactive,
        .button-right.isactive {
          background-color: rgba($color: #000000, $alpha: 0.3) !important;
        }
      }
    }
  }
}

.view-panel {
  display: flex;
  flex-direction: column;
  border: 1px solid #cfcfcf;

  .top {
    background-color: #fff697;
  }

  .bottom {
    background-color: #b6d88e;
  }

  .action-bar {
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    height: 50px;

    .move-button {
      width: 36%;
      border: 2px solid #ffffff;
      background-color: #cfcfcf;
      box-shadow: 2px 2px 5px #cfcfcf;
    }
  }
}
</style>
