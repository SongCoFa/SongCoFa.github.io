<template>
  <b-container ref="Content" class="mb-2" fluid>
    <ShiftQuery
      ref="QueryArea"
      @UpdateContentSize="UpdateContentSize"
      @UpdateResult="UpdateResult"
      @refreshData="refreshData"
      @resetAllData="resetAllData" />
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
                @click="GetFirstShift(item)"
                :pressed="item.shift_name === firstShiftName"
              >1</b-button>
              <b-button
                class="d-inline-block button-right customize-button-click"
                squared
                @click="GetSecondShift(item, key)"
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
          @storedSelectedShift="setStoredFirstShift"
          @addNewRecord="addFirstShift"
          @removeRecords="removeFirstShift"
          @updateShift="updateFirstShift"
          @refreshData="refreshFirstShiftData"
          @updateEdited="updateEditedFirstShiftData"
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
          @storedSelectedShift="setStoredSecondShift"
          @addNewRecord="addSecondShift"
          @removeRecords="removeSecondShift"
          @updateShift="updateSecondShift"
          @refreshData="refreshSecondShiftData"
          @updateEdited="updateEditedSecondShiftData"
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

      firstShift: null, // 上方面板查詢資料
      secondShift: null, // 下方面板查詢資料

      firstShiftTitle: null,
      secondShiftTitle: null,

      storedFirstShift: [], // 上方面板已選擇資料列
      storedSecondShift: [], // 下方面板已選擇資料列

      firstShiftName: null, // 上方面板選擇中的資料(仕業名稱)
      secondShiftName: null, // 下方面板選擇中的資料(仕業名稱)

      firstShiftRemoveSet: null, // 上方面板要刪除的資料組
      secondShiftRemoveSet: null, // 下方面板要刪除的資料組

      duplicate: true,
      busyState: false,

      firstShiftBusyState: false,
      secondShiftBusyState: false,
    };
  },
  created() {
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
    resetAllData() {
      this.refreshFirstShiftData();
      this.refreshSecondShiftData();
    },

    refreshFirstShiftData() {
      // TODO: refresh firstShiftMaster when edit instead of reset all data
      this.$refs.QueryArea.GetResult();
      this.firstShift = null;
      this.firstShiftMaster = {
        shift_name: null,
        emp_ID: null,
        bus_no: null,
      };
      this.firstShiftName = null;
      this.firstShiftRemoveSet = null;
      this.firstShiftTitle = null;
    },
    refreshSecondShiftData() {
      this.$refs.QueryArea.GetResult();
      this.secondShift = null;
      this.secondShiftMaster = {
        shift_name: null,
        emp_ID: null,
        bus_no: null,
      };
      this.secondShiftName = null;
      this.secondShiftRemoveSet = null;
      this.secondShiftTitle = null;
    },

    GetFirstShift(item) {
      // 取得第一組仕業資料
      if (this.firstShift) {
        if (this.firstShift.some(a => a.in_deleted || a.in_added || a.in_edited)) {
          this.$bvModal.msgBoxConfirm('資料尚未更新是否離開', {
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
             this.confirmGetFirstShift(item);
            }
          })
          .catch(e => console.log(e));
        } else {
          this.confirmGetFirstShift(item);
        }
      } else {
        this.confirmGetFirstShift(item);
      }
    },
    confirmGetFirstShift(item) {
      // 1. 設定當前物件status為true, 其他物件status為false
      if (item.shift_name === this.secondShiftName || item.shift_name === this.firstShiftName) return;
      this.firstShiftName = item.shift_name;

      // 1-1. 設定 master 資訊
      this.firstShiftMaster = item;

      // 2. 根據name取資料, 1為first shift, 2為second shift
      this.GetShiftDetail(item, 1);

      // 3. 離開後要清空暫存列
      if (this.firstShift && this.firstShift.length > 0) {
        this.firstShift.length = 0;
      }
      this.storedFirstShift.length = 0;
    },
    GetSecondShift(item) {
      // 取得第二組仕業資料

      // TODO: 0. 未更新資料點選要跳提示
      if (this.secondShift) {
        if (this.secondShift.some(a => a.in_deleted || a.in_added || a.in_edited)) {
          this.$bvModal.msgBoxConfirm('資料尚未更新是否離開', {
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
             this.confirmGetSecondShift(item);
            }
          })
          .catch(e => console.log(e));
        } else {
          this.confirmGetSecondShift(item);
        }
      } else {
        this.confirmGetSecondShift(item);
      }
    },
    confirmGetSecondShift(item) {
      // 1. 設定當前物件status為true, 其他物件status為false
      if (item.shift_name === this.firstShiftName || item.shift_name === this.secondShiftName) return;
      this.secondShiftName = item.shift_name;

      // 1-1. 設定 master 資訊
      this.secondShiftMaster = item;

      // 2. 根據name取資料, 1為first shift, 2為second shift
      this.GetShiftDetail(item, 2);

      // 3. 離開後要清空暫存列
      this.storedSecondShift.length = 0;
    },

    async GetShiftDetail(send, index) {
      // 取得仕業詳細資料, send:條件, index:組別
      const api = `${process.env.VUE_APP_BASE_API}/api/shift/GetList`;

      // this.busyState = true;
      if (index === 1) {
        this.firstShiftBusyState = true;
      } else if (index === 2) {
        this.secondShiftBusyState = true;
      } else {
        this.firstShiftBusyState = false;
        this.secondShiftBusyState = false;
      }

      const result = await this.$http.post(api, send)
        .then((response) => {
          console.log(response);
          this.firstShiftBusyState = false;
          this.secondShiftBusyState = false;
          return response.data.Resource;
        })
        .catch(e => console.log(e));

      if (index === 1) {
        this.firstShift = result;
      }

      if (index === 2) {
        this.secondShift = result;
      }
    },

    setStoredFirstShift(item, method) {
      // 存放第一組已勾選資料
      if (method === 'add') {
        this.storedFirstShift.push(item);
      }

      if (method === 'remove') {
        this.storedFirstShift.forEach((data, i) => {
          if (data.seq === item.seq) {
            this.storedFirstShift.splice(i, 1);
          }
        });
      }
    },
    setStoredSecondShift(item, method) {
      // 存放第二組已勾選資料
      if (method === 'add') {
        this.storedSecondShift.push(item);
      }

      if (method === 'remove') {
        this.storedSecondShift.forEach((data, i) => {
          if (data.seq === item.seq) {
            this.storedSecondShift.splice(i, 1);
          }
        });
      }
    },

    toUp() {
      if (this.firstShift == null || this.secondShift == null) return;

      // 複製或移動模式
      if (this.duplicate) {
        // 複製
        const sameItems = [];
        this.storedSecondShift.forEach((item) => {
          this.$set(item, 'selected', false);

          if (!this.firstShift.some(e => e.seq === item.seq)) {
            let movingItem = JSON.parse(JSON.stringify(item));

            movingItem.shift_name = this.firstShiftMaster.shift_name;
            movingItem.bus_no = this.firstShiftMaster.bus_no ? this.firstShiftMaster.bus_no : null;
            movingItem = this.lookupDriver(movingItem, this.firstShiftMaster.emp_ID);

            this.$set(movingItem, 'in_added', true);

            this.firstShift.push(movingItem);
          } else {
            sameItems.push(item.seq);
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

          if (!this.firstShift.some(e => e.seq === item.seq)) {
            let movingItem = JSON.parse(JSON.stringify(item));

            movingItem.shift_name = this.firstShiftMaster.shift_name;
            movingItem.bus_no = this.firstShiftMaster.bus_no ? this.firstShiftMaster.bus_no : null;
            movingItem = this.lookupDriver(movingItem, this.firstShiftMaster.emp_ID);

            this.$set(movingItem, 'in_added', true);

            this.firstShift.push(movingItem);
            this.secondShift.forEach((b) => {
              if (item.seq === b.seq) {
                // this.secondShift.splice(i, 1);
                this.$set(b, 'in_deleted', true);
              }
            });
          } else {
            sameItems.push(item.seq);
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

          if (!this.secondShift.some(e => e.seq === item.seq)) {
            let movingItem = JSON.parse(JSON.stringify(item));

            movingItem.shift_name = this.secondShiftMaster.shift_name;
            movingItem.bus_no = this.secondShiftMaster.bus_no ? this.secondShiftMaster.bus_no : null;
            movingItem = this.lookupDriver(movingItem, this.secondShiftMaster.emp_ID);

            this.$set(movingItem, 'in_added', true);

            this.secondShift.push(movingItem);
          } else {
            sameItems.push(item.seq);
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

          if (!this.secondShift.some(e => e.seq === item.seq)) {
            let movingItem = JSON.parse(JSON.stringify(item));

            movingItem.shift_name = this.secondShiftMaster.shift_name;
            movingItem.bus_no = this.secondShiftMaster.bus_no ? this.secondShiftMaster.bus_no : null;
            movingItem = this.lookupDriver(movingItem, this.secondShiftMaster.emp_ID);

            this.$set(movingItem, 'in_added', true);

            this.secondShift.push(movingItem);
            this.firstShift.forEach((b) => {
              if (item.seq === b.seq) {
                // this.secondShift.splice(i, 1);
                this.$set(b, 'in_deleted', true);
              }
            });
          } else {
            sameItems.push(item.seq);
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

    addFirstShift(record) {
      // 新增班次

      // TODO: record要多串master資料進去
      if (this.firstShift == null) {
        alert('請先選擇資料');
      } else {
                console.log(record);
        // eslint-disable-next-line no-param-reassign
        record = this.lookupDriver(record, record.emp_ID);
                console.log(record);
        this.$set(record, 'in_added', true);
        this.firstShift.push(record);

                console.log(this.firstShift);
      }
    },
    addSecondShift(record) {
      // 新增班次

      // TODO: record要多串master資料進去
      if (this.secondShift == null) {
        alert('請先選擇資料');
      } else {
        // eslint-disable-next-line no-param-reassign
        record = this.lookupDriver(record, record.emp_ID);
        this.$set(record, 'in_added', true);
        this.secondShift.push(record);
      }
    },

    removeFirstShift() {
      // 移除選擇列
      this.firstShift.forEach((item) => {
        this.storedFirstShift.forEach((a) => {
          if (item.seq === a.seq) {
            this.$set(item, 'in_deleted', true);
            this.$set(item, 'selected', false);
          }
        });
      });

      this.storedFirstShift.length = 0;
    },
    removeSecondShift() {
      // 移除選擇列
      this.secondShift.forEach((item) => {
        this.storedSecondShift.forEach((a) => {
          if (item.seq === a.seq) {
            this.$set(item, 'in_deleted', true);
            this.$set(item, 'selected', false);
          }
        });
      });

      this.storedSecondShift.length = 0;
    },

    updateFirstShift() {
      // 更新整組資料
      const api = `${process.env.VUE_APP_BASE_API}/api/shift/UpsertDelList`;

      // 檢查shift_name
      const nameCheck = this.firstShift.some(row => row.shift_name !== this.firstShiftName);
      if (nameCheck) {
        this.$bvModal.msgBoxConfirm('請檢查班次仕業名稱是否不符合仕業', {
          title: '訊息',
          size: 'sm',
          buttonSize: 'sm',
          okVariant: 'danger',
          okTitle: '離開',
          cancelTitle: '取消',
          headerClass: 'p-2',
          footerClass: 'p-2',
          hideHeaderClose: false,
          centered: true,
        })
        .then((value) => {
          console.log(value);
        })
        .catch(e => console.log(e));

        return;
      }

      // 去除要刪除的
      const send = this.firstShift.filter(a => a.in_deleted !== true);

      // 清空班次 需要回傳 shift_name
      if (send.length === 0) {
        send.push({ shift_name: this.firstShiftName });
      }

      // 變更key值 為 回傳key值
      send.forEach((row) => {
        const temp = row;
        temp.Direction = temp.direction;
      });

      console.log(send);

      this.$http.post(api, send)
        .then((response) => {
          console.log(response.data);
          const item = {
            shift_name: this.firstShiftName,
          };

          this.GetShiftDetail(item, 1);
        })
        .catch(e => console.log(e));
    },
    updateSecondShift() {
      const api = `${process.env.VUE_APP_BASE_API}/api/shift/UpsertDelList`;

      const nameCheck = this.secondShift.some(row => row.shift_name !== this.secondShiftName);
      if (nameCheck) {
        this.$bvModal.msgBoxConfirm('請檢查班次仕業名稱是否不符合仕業', {
          title: '訊息',
          size: 'sm',
          buttonSize: 'sm',
          okVariant: 'danger',
          okTitle: '離開',
          cancelTitle: '取消',
          headerClass: 'p-2',
          footerClass: 'p-2',
          hideHeaderClose: false,
          centered: true,
        })
        .then((value) => {
          console.log(value);
        })
        .catch(e => console.log(e));

        return;
      }

      const send = this.secondShift.filter(a => a.in_deleted !== true);

      // 清空班次 需要回傳 shift_name
      if (send.length === 0) {
        send.push({ shift_name: this.secondShiftName });
      }

      // 變更key值 為 回傳key值
      send.forEach((row) => {
        const temp = row;
        temp.Direction = temp.direction;
      });

      this.$http.post(api, send)
        .then((response) => {
          console.log(response.data);
          const item = {
            shift_name: this.secondShiftName,
          };

          this.GetShiftDetail(item, 2);
        })
        .catch(e => console.log(e));
    },

    updateEditedFirstShiftData(record) {
      this.firstShift.forEach((item, i) => {
        if (item.seq === record.seq) {
          // this.firstShift[i] = record;
          this.$set(this.firstShift, i, record);
        }
      });
    },
    updateEditedSecondShiftData(record) {
      this.secondShift.forEach((item, i) => {
        if (item.seq === record.seq) {
          // this.firstShift[i] = record;
          this.$set(this.secondShift, i, record);
        }
      });
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
