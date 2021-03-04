<template>
  <b-container ref="Content" fluid class="pb-3">
    <ScheduleQuery
      v-bind="QueryToolApi"
      :AddListFormat="AddListFormat"
      :writable="writable"
      @updateResult="updateResult"
      @checkValidData="checkValidData"
      @refreshData="refreshAndRetrieveData"
      @clearSelectedEmployee="clearSelectedEmployee"
      ref="QueryTool"
    ></ScheduleQuery>
    <div class="d-flex flex-row flex-grow-1 overflow-hidden" style="position: relative">
      <div v-if="checking" class="check-spinner">
        <div class="text-center text-light my-2 spinner">
          <b-spinner class="align-middle mr-1"></b-spinner>
          <strong>檢查中...</strong>
        </div>
      </div>
      <div class="h-100 bg-light list-panel" ref="listPanel" :class="{ 'collapse-panel': toggle }">
        <template v-if="!toggle">
          <div class="d-flex bg-dark p-0 list-panel-title-bar">
            <b-button squared @click="sideBarCollapse" class="collapse-btn">-</b-button>
            <div class="d-flex justify-content-center align-items-center text-light w-100">(員工編號)姓名</div>
          </div>
          <div class="query-list overflow-auto">
            <div class="query-list-display" v-for="(item, key) in driverAndCondition" :key="key">
              <div class="text-area" :class="{ 'condition-danger': item.leave_flag === '1', 'condition-warning': item.leave_flag === '2' }" v-if="item.emp_ID === 'condition'">
                {{ item.emp_name }}
                <b-badge pill variant="primary" class="mx-2">{{ item.amount }}</b-badge>
              </div>
              <div class="text-area" :class="{ 'condition-info': item.leave_flag === '1' }" v-else>
                ({{ item.emp_ID }}){{ item.emp_name }}
                <b-badge pill variant="primary" class="mx-2">{{ item.amount }}</b-badge>
              </div>
              <b-button
                class="query-btn top-btn border-0 text-dark customize-button-click"
                squared
                :pressed="item.emp_name === firstVoucherEmployee.emp_name"
                @click="GetDetail(item.emp_ID, item.emp_name, 'first');"
              >1</b-button>
              <b-button
                class="query-btn bottom-btn border-0 text-dark customize-button-click"
                squared
                :pressed="item.emp_name === secondVoucherEmployee.emp_name"
                @click="GetDetail(item.emp_ID, item.emp_name, 'second')"
              >2</b-button>
            </div>
          </div>
        </template>
        <template v-else>
          <b-button squared @click="sideBarCollapse" class="collapse-btn">+</b-button>
        </template>
      </div>
      <div class="h-100 bg-light view-panel">
        <ScheduleTable
          class="top"
          :table="firstVoucher"
          :busyState="firstVoucherBusyState"
          :place="'first'"
          :writable="writable"
          :isGroupEditable="isFirstGroupEditable"
          @storedEdit="storedEdit($event, 'first')"
          @storedSelected="storedSelected($event, 'first')"
          @selectAll="selectAll('first')"
          @getDuplicated="getDuplicated($event, 'first')"
          @excuteWrite="excuteWrite"
          @groupEdit="groupEdit($event, 'first')"
          @deleteRecords="deleteRecords('first')"
          @toDown="toDown"
          @redo="redo('first')"
        ></ScheduleTable>
        <ScheduleTable
          class="bottom"
          :table="secondVoucher"
          :busyState="secondVoucherBusyState"
          :place="'second'"
          :writable="writable"
          :isGroupEditable="isSecondGroupEditable"
          @storedEdit="storedEdit($event, 'second')"
          @storedSelected="storedSelected($event, 'second')"
          @selectAll="selectAll('second')"
          @getDuplicated="getDuplicated($event, 'second')"
          @excuteWrite="excuteWrite"
          @groupEdit="groupEdit($event, 'second')"
          @deleteRecords="deleteRecords('second')"
          @toUp="toUp"
          @redo="redo('second')"
        ></ScheduleTable>
      </div>
    </div>
  </b-container>
</template>

<script>
import ScheduleQuery from '@/components/QueryTool/ScheduleQuery.vue';
import ScheduleTable from '@/components/table/ScheduleTable.vue';

export default {
  name: 'Schedule',
  components: {
    ScheduleQuery,
    ScheduleTable,
  },
  data() {
    return {
      driverItems: [],
      AddListFormat: [
        { name: 'VoucherVehicle', defaultInput: '', isRequired: true },
        { name: 'EmployeeIDSelection', defaultInput: '', isRequired: true },
        { name: 'VoucherRoute', defaultInput: '', isRequired: true },
        { name: 'VoucherDeparture', defaultInput: '', isRequired: true },
        { name: 'VoucherArrival', defaultInput: '', isRequired: true },
        { name: 'Distance', defaultInput: '', isRequired: false },
        { name: 'VoucherRemark', defaultInput: '', isRequired: false },
        { name: 'VoucherIntermediateStations', defaultInput: '', isRequired: false },
      ],

      checking: false,

      toggle: false, // 側欄伸縮

      driverAndCondition: null, // 側欄清單 司機名、漏排班等
      queriedData: {
        input: null,
        time: null,
      },

      firstVoucherEmployee: {
        emp_ID: null,
        emp_name: null,
      },
      secondVoucherEmployee: {
        emp_ID: null,
        emp_name: null,
      },

      firstVoucher: null,
      secondVoucher: null,

      firstVoucherBusyState: false,
      secondVoucherBusyState: false,

      firstVoucherEditedStored: [], // 編輯過的資料都要存入此陣列
      secondVoucherEditedStored: [],

      firstVoucherSelectedStored: [], // 選取中的資料
      secondVoucherSelectedStored: [],
    };
  },
  computed: {
    QueryToolApi() {
      return {
        GetResultApi: `${process.env.VUE_APP_BASE_API}/api/voucher/GetDriverList`, // 取得所有員工資料
        AddApi: `${process.env.VUE_APP_BASE_API}/api/voucher/UpsertList`,
      };
    },
    writable() {
      return this.$store.getters.permissions.schedule_permission === 'W';
    },
    isFirstGroupEditable() {
      return this.firstVoucherSelectedStored.length > 0;
    },
    isSecondGroupEditable() {
      return this.secondVoucherSelectedStored.length > 0;
    },
  },
  methods: {
    sideBarCollapse() {
      this.toggle = !this.toggle;
    },
    updateResult(result, queriedInput, time) {
      // 查詢重置所有資料
      this.clearData();

      this.driverItems = result;
      this.queriedData.input = queriedInput;
      this.queriedData.time = time;

      this.countConditionAmount();
    },
    async countConditionAmount() {
      const defaultCondition = [
        {
          emp_ID: 'condition',
          emp_name: '駕駛連續工作超過7天',
          leave_flag: '1',
          amount: 0,
        },
        {
          emp_ID: 'condition',
          emp_name: '駕駛工時不得超過10小時',
          leave_flag: '1',
          amount: 0,
        },
        {
          emp_ID: 'condition',
          emp_name: '同一駕駛所開趟次之行駛時間重疊',
          leave_flag: '1',
          amount: 0,
        },
        {
          emp_ID: 'condition',
          emp_name: '同一車輛所行駛趟次之行駛時間重疊',
          leave_flag: '1',
          amount: 0,
        },
        {
          emp_ID: 'condition',
          emp_name: '重複排班',
          leave_flag: '1',
          amount: 0,
        },
        {
          emp_ID: 'condition',
          emp_name: '駕駛休假之班次',
          leave_flag: '1',
          amount: 0,
        },
        {
          emp_ID: 'condition',
          emp_name: '漏排班',
          leave_flag: '2',
          amount: 0,
        },
      ];

      const api = `${process.env.VUE_APP_BASE_API}/api/voucher/GetList`;
      let date = null;

      if (this.queriedData.input.voucher_date) {
        date = this.queriedData.input.voucher_date;
      } else {
        date = this.$moment().format('YYYY-MM-DD');
      }

      const result = await this.$http.post(api, { voucher_date: date })
        .then((response) => {
          this.firstVoucherBusyState = false;
          this.secondVoucherBusyState = false;
          return response.data.Resource;
        })
        .catch(e => console.log(e));

      defaultCondition.forEach((item) => {
        result.forEach((res) => {
          const temp = res;
          let checkArray = [];

          if (temp.labor_standards_check) {
            checkArray = temp.labor_standards_check.trim().split(',');
          } else {
            checkArray = [];
          }

          if (checkArray.includes(item.emp_name)) {
            // eslint-disable-next-line no-param-reassign
            item.amount += 1;
          } else {
            // eslint-disable-next-line no-param-reassign
            item.amount += 0;
          }
        });
      });

      if (this.driverItems && this.driverItems.length) {
        this.driverAndCondition = [...defaultCondition, ...this.driverItems];
      } else {
        this.driverAndCondition = [];
      }
    },
    async checkValidData() {
      this.checking = true;

      const api = `${process.env.VUE_APP_BASE_API}/api/voucher/PrincipleVerify`;

      let checkDate = '';

      if (this.queriedData.input) {
        if (this.queriedData.input.voucher_date) {
          checkDate = this.queriedData.input.voucher_date;
        } else {
          checkDate = this.$moment().format('YYYY-MM-DD');
        }
      } else {
        checkDate = this.$moment().format('YYYY-MM-DD');
      }

      const status = await this.$http.post(api, { voucher_date: checkDate })
        .then((response) => {
          const msg = response.data.Message;
          return this.$bvModal.msgBoxOk(`檢查${msg}`, {
            title: '訊息',
            size: 'sm',
            buttonSize: 'sm',
            okVariant: 'info',
            headerClass: 'p-2 border-bottom-0',
            footerClass: 'p-2 border-top-0',
            centered: true,
          })
          .then(value => value)
          .catch(e => console.log(e));
        })
        .catch(e => console.log(e));

      this.checking = false;

      return status;
    },
    async retrieveExistDetail() {
      // 更新後 根據上一次查詢
      this.firstVoucherEditedStored.length = 0;
      this.secondVoucherEditedStored.length = 0;
      this.firstVoucherSelectedStored.length = 0;
      this.secondVoucherSelectedStored.length = 0;

      await this.countConditionAmount();

      if (this.firstVoucherEmployee.emp_ID && this.firstVoucherEmployee.emp_name) {
        this.GetDetail(this.firstVoucherEmployee.emp_ID, this.firstVoucherEmployee.emp_name, 'first');
      }

      if (this.secondVoucherEmployee.emp_ID && this.secondVoucherEmployee.emp_name) {
        this.GetDetail(this.secondVoucherEmployee.emp_ID, this.secondVoucherEmployee.emp_name, 'second');
      }
    },
    async refreshData() {
      await this.checkValidData();
      this.$refs.QueryTool.GetResult(this.queriedData.input);
    },
    async refreshAndRetrieveData() {
      await this.checkValidData();
      this.$refs.QueryTool.GetResult(this.queriedData.input);
      this.retrieveExistDetail();
    },
    clearSelectedEmployee() {
      // 自動查詢時必須保留已選擇員工資料，更新資料後需要已相同條件查詢
      this.firstVoucherEmployee = { emp_ID: null, emp_name: null };
      this.secondVoucherEmployee = { emp_ID: null, emp_name: null };
    },
    clearData() {
      this.firstVoucher = null;
      this.secondVoucher = null;

      this.firstVoucherEditedStored = [];
      this.secondVoucherEditedStored = [];

      this.firstVoucherSelectedStored = [];
      this.secondVoucherSelectedStored = [];
    },

    GetDetail(id, name, s, msg = '') {
      const $id = id;
      const $name = name;

      // 已選擇的不能再選
      // if ($name === this.firstVoucherEmployee.emp_name || $name === this.secondVoucherEmployee.emp_name) return;

      let leaveMsg = '';
      if (msg === '') {
        leaveMsg = '資料尚未更新是否離開';
      } else {
        leaveMsg = msg;
      }

      if (s === 'first') {
        if ($name === this.secondVoucherEmployee.emp_name) return;

        let deleteCheck = false;

        if (this.firstVoucher) {
          deleteCheck = this.firstVoucher.some(item => item.in_deleted === true);
        }

        if (this.firstVoucherEditedStored.length > 0 || deleteCheck) {
          this.$bvModal.msgBoxConfirm(leaveMsg, {
            title: '訊息',
            size: 'sm',
            buttonSize: 'sm',
            okVariant: 'danger',
            okTitle: '是',
            cancelTitle: '否',
            footerClass: 'p-2',
            hideHeaderClose: false,
            centered: true,
          })
          .then((value) => {
            if (value) {
              this.firstVoucherEditedStored = [];
              this.firstVoucherSelectedStored = [];
              this.GetVoucherDetail({ $id, $name }, s);
            }
          })
          .catch(e => console.log(e));
        } else {
          this.firstVoucherSelectedStored = [];
          this.GetVoucherDetail({ $id, $name }, s);
        }
      } else if (s === 'second') {
        if ($name === this.firstVoucherEmployee.emp_name) return;

        let deleteCheck = false;

        if (this.secondVoucher) {
          deleteCheck = this.secondVoucher.some(item => item.in_deleted === true);
        }

        if (this.secondVoucherEditedStored.length > 0 || deleteCheck) {
          this.$bvModal.msgBoxConfirm(leaveMsg, {
            title: '訊息',
            size: 'sm',
            buttonSize: 'sm',
            okVariant: 'danger',
            okTitle: '是',
            cancelTitle: '否',
            footerClass: 'p-2',
            hideHeaderClose: false,
            centered: true,
          })
          .then((value) => {
            if (value) {
              this.secondVoucherEditedStored = [];
              this.secondVoucherSelectedStored = [];
              this.GetVoucherDetail({ $id, $name }, s);
            }
          })
          .catch(e => console.log(e));
        } else {
          this.secondVoucherSelectedStored = [];
          this.GetVoucherDetail({ $id, $name }, s);
        }
      } else {
        console.log('error');
      }
    },
    async GetVoucherDetail({ $id = null, $name = null }, place) {
      // eslint-disable-next-line camelcase
      const emp_ID = $id;
      // eslint-disable-next-line camelcase
      const emp_name = $name;

      if (place === 'first') {
        this.firstVoucherEmployee = { emp_ID, emp_name };
        this.firstVoucherBusyState = true;
      } else if (place === 'second') {
        this.secondVoucherEmployee = { emp_ID, emp_name };
        this.secondVoucherBusyState = true;
      } else {
        this.firstVoucherBusyState = false;
        this.secondVoucherBusyState = false;
      }

      // id null 需要以 name(條件) 篩選
      const api = `${process.env.VUE_APP_BASE_API}/api/voucher/GetList`;

      let date = null;
      if (this.queriedData.input.voucher_date) {
        date = this.queriedData.input.voucher_date;
      } else {
        date = this.$moment().format('YYYY-MM-DD');
      }

      const searchObj = {
        voucher_date: date,
        emp_ID_name: null,
      };

      if ($id === 'condition') {
        searchObj.emp_ID_name = null;
      } else {
        searchObj.emp_ID_name = $name;
      }
      const result = await this.$http.post(api, searchObj)
        .then((response) => {
          this.firstVoucherBusyState = false;
          this.secondVoucherBusyState = false;
          return response.data.Resource;
        })
        .catch(e => console.log(e));

      if ($id === 'condition') {
        const resultWithCondition = result.filter((item) => {
          let checkArray = [];

          if (item.labor_standards_check) {
            checkArray = item.labor_standards_check.trim().split(',');
          } else {
            checkArray = [];
          }

          return checkArray.includes($name);
        });

        // 因為漏排班vpk為null需產生新的ID做辨認
        resultWithCondition.forEach((item, i) => {
          // eslint-disable-next-line no-param-reassign
          item.id = i;
        });

        if (place === 'first') {
          this.firstVoucher = resultWithCondition;
        } else {
          this.secondVoucher = resultWithCondition;
        }
      } else if (place === 'first') {
        const filterResult = result.filter(item => item.labor_standards_check !== '漏排班');
        filterResult.forEach((item, i) => {
          // eslint-disable-next-line no-param-reassign
          item.id = i;
        });
        this.firstVoucher = filterResult;
      } else {
        const filterResult = result.filter(item => item.labor_standards_check !== '漏排班');
        filterResult.forEach((item, i) => {
          // eslint-disable-next-line no-param-reassign
          item.id = i;
        });
        this.secondVoucher = filterResult;
      }
    },

    async getDuplicated(send, s) {
      const { vpk } = { ...send };
      const api = `${process.env.VUE_APP_BASE_API}/api/voucher/GetDuplicated`;
      console.log(vpk, s);
      const result = await this.$http
        .post(api, { vpk })
        .then(response => response.data.Resource)
        .catch(e => console.log(e));

      console.log(result);

      if (s === 'first') {
        // 檢查未更新資料
        let checkUnUpdated = false;
        if (this.secondVoucher) {
          checkUnUpdated = this.secondVoucher.some(item => item.in_edited || item.in_deleted);
        }
        console.log(checkUnUpdated);


        // 重置 secondVoucher
        this.secondVoucherEmployee = { emp_ID: null, emp_name: null };
        this.secondVoucherEditedStored.length = 0;
        this.secondVoucherSelectedStored.length = 0;

        this.secondVoucher = result.map((item, i) => {
          const $el = item;
          $el.id = i;
          return $el;
        });
      } else {
        // 檢查未更新資料
        let checkUnUpdated = false;
        if (this.firstVoucher) {
          checkUnUpdated = this.firstVoucher.some(item => item.in_edited || item.in_deleted);
        }
        console.log(checkUnUpdated);

        // 重置 firstVoucher
        this.firstVoucherEmployee = { emp_ID: null, emp_name: null };
        this.firstVoucherEditedStored.length = 0;
        this.firstVoucherSelectedStored.length = 0;

        this.firstVoucher = result.map((item, i) => {
          const $el = item;
          $el.id = i;
          return $el;
        });
      }
    },

    storedEdit(send, s) {
      let changeVoucher = [];
      let editedStored = [];

      console.log(send);

      if (s === 'first') {
        changeVoucher = this.firstVoucher;
        editedStored = this.firstVoucherEditedStored;
      } else if (s === 'second') {
        changeVoucher = this.secondVoucher;
        editedStored = this.secondVoucherEditedStored;
      } else {
        changeVoucher = [];
      }

      // 變更First/Second Voucher編輯後的顯示
      changeVoucher.forEach((data, i) => {
        if (data.id === send[0].id) {
          // eslint-disable-next-line prefer-destructuring
          changeVoucher[i] = send[0];
          this.$set(changeVoucher, i, send[0]);
        }
      });

      // 2. 存到 editedStored
      const result = editedStored.some(item => item.id === send[0].id);

      if (!result) {
        editedStored.push(send[0]);
      } else {
        editedStored.forEach((item, i) => {
          if (item.id === send[0].id) {
            // eslint-disable-next-line prefer-destructuring
            editedStored[i] = send[0];
          }
        });
      }
    },

    selectAll(s) {
      let selected;
      let voucher;
      let originVoucher;

      if (s === 'first') {
        selected = JSON.parse(JSON.stringify(this.firstVoucherSelectedStored));
        voucher = this.firstVoucher;
        originVoucher = JSON.parse(JSON.stringify(this.firstVoucher));
      } else {
        selected = JSON.parse(JSON.stringify(this.secondVoucherSelectedStored));
        voucher = this.secondVoucher;
        originVoucher = JSON.parse(JSON.stringify(this.secondVoucher));
      }

      if (!originVoucher) return;

      originVoucher.forEach((data) => {
        const temp = data;

        if (selected.length === 0) {
          temp.selected = true;
        } else {
          temp.selected = false;
        }

        // 變更First/Second Voucher編輯後的顯示
        voucher.forEach((item, i) => {
          if (item.id === temp.id) {
            // eslint-disable-next-line prefer-destructuring
            voucher[i] = temp;
            this.$set(voucher, i, temp);
          }
        });
      });

      selected = originVoucher.filter(item => item.selected === true);

      if (s === 'first') {
        this.firstVoucherSelectedStored = selected;
      } else {
        this.secondVoucherSelectedStored = selected;
      }
    },

    storedSelected(data, s) {
      let selectedStored = [];

      if (s === 'first') {
        selectedStored = this.firstVoucherSelectedStored;
      } else if (s === 'second') {
        selectedStored = this.secondVoucherSelectedStored;
      } else {
        selectedStored = [];
      }

      console.log(selectedStored);

      const result = selectedStored.some(item => item.id === data.id);

      if (!result) {
        selectedStored.push(data);
      } else {
        selectedStored.forEach((item, i) => {
          if (item.id === data.id) {
            // eslint-disable-next-line prefer-destructuring
            selectedStored.splice(i, 1);
          }
        });
      }
    },

    async excuteWrite() {
      // 按更新鍵時一併更
      const EditApi = `${process.env.VUE_APP_BASE_API}/api/voucher/UpsertList`;
      const DeleteApi = `${process.env.VUE_APP_BASE_API}/api/voucher/DeleteList`;

      let editResult = null;
      let deleteResult = null;

      let firstDelete = [];
      let secondDelete = [];

      // 刪除
      if (this.firstVoucher) {
        firstDelete = this.firstVoucher
          .filter(item => item.in_deleted === true && item.vpk !== null)
          .map((item) => {
            const temp = {};
            temp.vpk = item.vpk;
            return temp;
          });
      }

      if (this.secondVoucher) {
        secondDelete = this.secondVoucher
          .filter(item => item.in_deleted === true && item.vpk !== null)
          .map((item) => {
            const temp = {};
            temp.vpk = item.vpk;
            return temp;
          });
      }

      deleteResult = [...firstDelete, ...secondDelete];

      if (deleteResult.length > 0) {
        await this.$http
          .post(DeleteApi, deleteResult)
          .then((response) => {
            console.log(response.data);
          })
          .catch(e => console.log(e));
      }

      // 編輯
      editResult = [...this.firstVoucherEditedStored.filter(item => item.in_deleted !== true), ...this.secondVoucherEditedStored.filter(item => item.in_deleted !== true)];

      // vpk非null但相同的編輯只會留一筆
      const finalEditResult = editResult.filter((item, index, self) => index === self.findIndex(t => t.vpk === item.vpk) || item.vpk == null);
      console.log(finalEditResult);
      if (finalEditResult.length > 0) {
        await this.$http
          .post(EditApi, finalEditResult)
          .then((response) => {
            console.log(response.data);
          })
          .catch(e => console.log(e));
      }

      // 重置狀態
      this.firstVoucher = null;
      this.secondVoucher = null;

      this.firstVoucherEditedStored = [];
      this.secondVoucherEditedStored = [];

      this.firstVoucherSelectedStored = [];
      this.secondVoucherSelectedStored = [];

      // 檢查並重新查詢已存在資料
      this.refreshAndRetrieveData();
      // this.refreshData();
      // this.retrieveExistDetail();
    },

    groupEdit(send, s) {
      // console.log(send, s);
      let selected;
      let editedStored;
      let originVoucher;

      if (s === 'first') {
        selected = JSON.parse(JSON.stringify(this.firstVoucherSelectedStored));
        editedStored = JSON.parse(JSON.stringify(this.firstVoucherEditedStored));
        originVoucher = this.firstVoucher;
      } else {
        selected = JSON.parse(JSON.stringify(this.secondVoucherSelectedStored));
        editedStored = JSON.parse(JSON.stringify(this.secondVoucherEditedStored));
        originVoucher = this.secondVoucher;
      }

      selected.forEach((selectedItem) => {
        const temp = selectedItem;
        Object.keys(send).forEach((editItem) => {
          temp[editItem] = send[editItem];
          temp.selected = false;
          temp.in_edited = true;
        });

        // 變更First/Second Voucher編輯後的顯示
        originVoucher.forEach((data, i) => {
          if (data.id === temp.id) {
            // eslint-disable-next-line prefer-destructuring
            originVoucher[i] = temp;
            this.$set(originVoucher, i, temp);
          }
        });

        // 變更資料放進 editedStored
        const existed = editedStored.find(editedStoredItem => editedStoredItem.id === temp.id);

        if (!existed) {
          editedStored.push(temp);
        } else {
          editedStored.forEach((editedStoredItem, i) => {
            if (editedStoredItem.id === temp.id) {
              editedStored[i] = temp;
            }
          });
        }
      });


      // 清空選取資料的陣列及從新給編輯暫存陣列值
      if (s === 'first') {
        this.firstVoucherSelectedStored.length = 0;
        this.firstVoucherEditedStored = editedStored;
      } else {
        this.secondVoucherSelectedStored.length = 0;
        this.secondVoucherEditedStored = editedStored;
      }
    },

    deleteRecords(s) {
      // 刪除多筆
      let seletedStored = [];

      if (s === 'first') {
        seletedStored = this.firstVoucherSelectedStored;
      } else if (s === 'second') {
        seletedStored = this.secondVoucherSelectedStored;
      } else {
        seletedStored = [];
      }

      if (s === 'first') {
        this.firstVoucher.forEach((item) => {
          seletedStored.forEach((a) => {
            if (item.id === a.id) {
              this.$set(item, 'in_deleted', true);
              this.$set(item, 'selected', false);
            }
          });
        });
        this.firstVoucherSelectedStored.length = 0;
      } else {
        this.secondVoucher.forEach((item) => {
          seletedStored.forEach((a) => {
            if (item.id === a.id) {
              this.$set(item, 'in_deleted', true);
              this.$set(item, 'selected', false);
            }
          });
        });

        this.secondVoucherSelectedStored.length = 0;
      }
    },

    toUp() {
      const blockList = ['駕駛連續工作超過7天', '同一駕駛所開趟次之行駛時間重疊', '同一車輛所行駛趟次之行駛時間重疊', '駕駛工時不得超過10小時', '重複排班', '駕駛休假之班次', '漏排班'];
      if (blockList.includes(this.firstVoucherEmployee.emp_name) || !this.firstVoucher || !this.secondVoucher) return;

      // 1. 從 secondvoucher 把 secondVoucherSelect 的 item 刪除
      this.secondVoucherSelectedStored.forEach((item) => {
        const pos = this.secondVoucher.map(voucher => voucher.id).indexOf(item.id);

        if (pos > -1) {
          this.secondVoucher.splice(pos, 1);
        }
      });

      // 2. 把 secondVoucherSelect 的 item 新增進 firstvoucher 和 firstEditStored
      const employee = this.firstVoucherEmployee;
      // eslint-disable-next-line camelcase
      const { emp_ID, emp_name } = { ...employee };

      this.secondVoucherSelectedStored.forEach((item) => {
        // vpk null(漏排班) 無條件移動，vpk 相同不移動
        const $el = item;

        let pos = -1;
        let storedPos = -1;

        if ($el.vpk !== null) {
          pos = this.firstVoucher.map(voucher => voucher.vpk).indexOf($el.vpk);
          storedPos = this.firstVoucherEditedStored.map(voucher => voucher.vpk).indexOf($el.vpk);
        }

        // 新增要同時變更id
        if (pos < 0) {
          $el.selected = false;
          $el.in_edited = true;
          // eslint-disable-next-line camelcase
          $el.emp_ID = emp_ID;
          // eslint-disable-next-line camelcase
          $el.emp_name = emp_name;
          $el.id = this.firstVoucher.length;

          this.firstVoucher.push($el);
        }

        if (storedPos < 0) {
          $el.selected = false;
          $el.in_edited = true;
          // eslint-disable-next-line camelcase
          $el.emp_ID = emp_ID;
          // eslint-disable-next-line camelcase
          $el.emp_name = emp_name;

          this.firstVoucherEditedStored.push($el);
        }
      });

      // 3. clear firstVoucherSelect
      this.secondVoucherSelectedStored = [];
    },

    toDown() {
      const blockList = ['駕駛連續工作超過7天', '同一駕駛所開趟次之行駛時間重疊', '同一車輛所行駛趟次之行駛時間重疊', '駕駛工時不得超過10小時', '重複排班', '駕駛休假之班次', '漏排班'];
      if (blockList.includes(this.secondVoucherEmployee.emp_name) || !this.firstVoucher || !this.secondVoucher) return;

      // 1. 從 firstvoucher 把 firstVoucherSelect 的 item 刪除
      this.firstVoucherSelectedStored.forEach((item) => {
        const pos = this.firstVoucher.map(voucher => voucher.id).indexOf(item.id);

        if (pos > -1) {
          this.firstVoucher.splice(pos, 1);
        }
      });

      // 2. 把 firstVoucherSelect 的 item 新增進 secondvoucher
      const employee = this.secondVoucherEmployee;
      // eslint-disable-next-line camelcase
      const { emp_ID, emp_name } = { ...employee };

      this.firstVoucherSelectedStored.forEach((item) => {
        // vpk null(漏排班) 無條件移動，vpk 相同不移動
        const $el = item;

        let pos = -1;
        let storedPos = -1;

        if ($el.vpk !== null) {
          pos = this.secondVoucher.map(voucher => voucher.vpk).indexOf($el.vpk);
          storedPos = this.secondVoucherEditedStored.map(voucher => voucher.vpk).indexOf($el.vpk);
        }

        if (pos < 0) {
          $el.selected = false;
          $el.in_edited = true;
          // eslint-disable-next-line camelcase
          $el.emp_ID = emp_ID;
          // eslint-disable-next-line camelcase
          $el.emp_name = emp_name;
          $el.id = this.secondVoucher.length;

          this.secondVoucher.push($el);
        }

        if (storedPos < 0) {
          $el.selected = false;
          $el.in_edited = true;
          // eslint-disable-next-line camelcase
          $el.emp_ID = emp_ID;
          // eslint-disable-next-line camelcase
          $el.emp_name = emp_name;

          this.secondVoucherEditedStored.push($el);
        }
      });

      // 3. clear firstVoucherSelect
      this.firstVoucherSelectedStored = [];
    },

    redo(s) {
      if (s === 'first') {
        const id = this.firstVoucherEmployee.emp_ID;
        const name = this.firstVoucherEmployee.emp_name;

        this.GetDetail(id, name, s, '是否回復為未修改資料');
      } else {
        const id = this.secondVoucherEmployee.emp_ID;
        const name = this.secondVoucherEmployee.emp_name;

        this.GetDetail(id, name, s, '是否回復為未修改資料');
      }
    },
  },
};
</script>

<style lang="scss">
.condition-danger {
  background-color: #cc6471;

  > th, > td {
    background-color: #cc6471 !important;
  }
}

.condition-warning {
  background-color: #ff9f1c;

  > th, > td {
    background-color: #ff9f1c !important;
  }
}

.condition-info {
  background-color: #17a2b8;

  > th, > td {
    background-color: #17a2b8 !important;
  }
}
</style>

<style lang="scss" scoped>
.check-spinner {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 10;
  background-color: rgba($color: #000000, $alpha: 0.4);

  .spinner {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
  }
}

.customize-button-click:focus, .customize-button-click.focus {
  outline: 0;
  -webkit-box-shadow: none !important;
  box-shadow: none !important;
}

::v-deep .list-panel {
  display: flex;
  flex-direction: column;
  width: 300px;
  overflow: hidden;
  border-left: 1px solid #8e8e8e;
  border-right: 1px solid #8e8e8e;
  border-bottom: 1px solid #8e8e8e;

  .list-panel-title-bar {
    height: 40px;
  }

  &.collapse-panel {
    width: 50px;
  }

  .collapse-btn {
    width: 50px;
    height: 100%;
  }

  .query-list {
    display: flex;
    flex-direction: column;

    .query-list-display {
      display: flex;
      flex-direction: row;
      justify-content: space-between;
      width: 100%;
      height: 100%;
      border-bottom: 1px solid #cfcfcf;

      .text-area {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: flex-start;
        line-height: 1.2;
        padding: .75rem .75rem;
      }

      .query-btn {
        width: 40px;
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
      }

      .query-btn:not(:disabled):not(.disabled):active,
      .query-btn:not(:disabled):not(.disabled).active {
        background-color: rgba($color: #ffffff, $alpha: 0.3) !important;
      }

      .query-btn.isactive {
        background-color: rgba($color: #ffffff, $alpha: 0.3) !important;
      }

      .top-btn {
        background-color: #fff697;
      }

      .bottom-btn {
        background-color: #b6d88e;
      }
    }
  }
}

.view-panel {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: auto;
  // border: 1px solid #cfcfcf;

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
    justify-content: space-around;
    height: 50px;
    border-right: 1px solid #8e8e8e;

    .move-button {
      width: 36%;
      border: 2px solid #ffffff;
      background-color: #cfcfcf;
      box-shadow: 2px 2px 5px #cfcfcf;
    }
  }
}
</style>
