<template>
  <q-page>
    <Breadcrumb :nowat="PageNowAt" />
    <div class="title">
      <img src="~/assets/ICON/search.png" @click="querytoolcontrol" />
      <img src="~/assets/ICON/Add.png" @click="goAdd" />
    </div>
    <QueryTool v-if="QueryToolOn" :query="PageNowAt" :querytoolon="QueryToolOn" class="querytool" @querytool="GetResult"  @setStatus="getStatus" />
    <div class="dataTable" v-if="this.maindata !== null">
      <div class="q-pa-md">
        <div class="text_big">{{TimeNow}}</div>
        <q-table
        :title="PageNowAt"
        :data="maindata"
        :columns="columns"
        row-key="name"
        selection="single"
        :selected.sync="selected"
        :pagination.sync="pagination"
        :rows-per-page-options="rowsPerPageOptions"
        >

        <template v-slot:header="props">
        <q-tr :props="props">
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            class="text_sm"
          >
            {{ col.label }}
          </q-th>
          <q-th class="text_sm summarylabel" style="text-align: right; position:relative;">編輯/明細/回覆</q-th>
          <q-th class="text_sm summarylabel" style="background-color: #38302C">
            <div class="colum-shadow"></div>
            編輯/明細/回覆
          </q-th>
          <!-- <q-th auto-width /> -->
        </q-tr>
        </template>

        <template v-slot:body="props">
        <q-tr :props="props">
          <q-td
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            class="text_sm"
          >
            {{ col.value }}
          </q-td>
          <q-td class="summarylabel iconlabel">
            <div class="colum-shadow"></div>
            <q-btn class="editIcon ListIcon" @click.native="props.selected = !props.selected; goEdit()" />
            <q-btn class="detailIcon ListIcon" @click.native="props.selected = !props.selected; getrowData()" />
            <q-btn class="RenewIcon ListIcon" v-if="props.cols[6].value === '處理中' || props.cols[6].value === '新案件'" @click.native="props.selected = !props.selected; goReport()" />
            <q-btn class="RenewIcon ListIcon" v-if="props.cols[6].value === '待確認' || props.cols[6].value === '結案'" @click.native="props.selected = !props.selected; goCheck()" />
            <div class="ListIcon btncover" v-if="props.cols[6].value === '結案'"></div>
            <div class="ListIcon btncover" v-else-if="props.cols[6].value === '新案件' && User.OperatorCode !== 'Bolymin'"></div>
            <div class="ListIcon btncover" v-else-if="props.cols[6].value === '處理中' && User.OperatorCode !== 'Bolymin'"></div>
          </q-td>
        </q-tr>
        </template>

        </q-table>
      </div>
    </div>
    <Add ref="add" />
    <Edit ref="edit" @getResult="ReResult" />
    <Report ref="report" @Report="ReResult" />
    <Check ref="check" @Report="ReResult"/>
  </q-page>
</template>

<script>
import QueryTool from 'components/QueryTool/Index.vue'
import Breadcrumb from 'layouts/components/Breadcrumb.vue'
import Add from 'components/Modals/AddRepairList.vue'
import Edit from 'components/Modals/EditRepairList.vue'
import Report from 'components/Modals/ReportRepairList.vue'
import Check from 'components/Modals/CheckRepairList.vue'

export default {
  name: 'RepairSystem',
  components: {
    QueryTool,
    Breadcrumb,
    Add,
    Edit,
    Report,
    Check
  },
  data () {
    return {
      selected: [],
      PageName: '報修系統',
      PageNowAt: 'RepairSystem',
      TimeNow: '',
      QueryToolOn: true,
      pagination: {
        page: 1,
        rowsPerPage: 9,
        sortBy: '報修時間',
        descending: true
      },
      rowsPerPageOptions: [9, 13],
      columns: [
        { name: '報修時間', align: 'left', label: '報修時間', field: 'start_datetime', sortable: true },
        { name: '報修單號', align: 'left', label: '報修單號', field: 'repair_no', sortable: true },
        { name: '客運業者', align: 'left', label: '客運業者', field: 'OperatorName', sortable: true },
        { name: '車號', align: 'left', label: '車號', field: 'bus_no', sortable: true },
        { name: '報修項目', align: 'left', label: '報修項目', field: 'item_name', sortable: true },
        { name: '問題摘要', align: 'left', label: '問題摘要', field: 'summary', sortable: true },
        { name: '狀態', align: 'left', label: '狀態', field: 'status', sortable: true },
        { name: '處理時間', align: 'left', label: '處理時間', field: 'usetime', sortable: true }
      ],
      maindata: null,
      RepairList: [],
      ItemList: [],
      OperatorList: [],
      User: {
        id: null,
        name: null,
        OperatorCode: null
      },
      isBolymin: false,
      status: null
    }
  },
  mounted () {
    this.$store.commit('CleanRepairSystemSelected')
    this.User.id = window.sessionStorage.getItem('Number')
    this.User.name = window.sessionStorage.getItem('Name')
    this.User.OperatorCode = window.sessionStorage.getItem('Vender')
    // console.log(this.User)
    if (this.User.id === null) {
      this.$root.reload = this.$router.replace({ name: '登入頁' })
    } else if (this.User.OperatorCode === 'Bolymin') {
      this.isBolymin = true
    }
    this.$axios.get('/api/Repair/RepairItem')// 取得報修列表ItemList
      .then((response) => {
        // console.log(response)
        this.ItemList = response.data
        this.ItemList.map((item) => {
          item.ischoice = false
        })
      })
      .catch(function (error) {
        console.log(error)
      })
    this.$axios.get('/api/Repair/OperatorCodeList')// 取得客運業者列表OperatorList
      .then((response) => {
        this.OperatorList = response.data
      })
      .catch(function (error) {
        console.log(error)
      })
    // 取得零件列表RepairList
    this.$axios.get('/api/Repair/RepairPart')
      .then((response) => {
        // console.log(response)
        this.RepairList = response.data
        this.RepairList.map((item) => {
          item.ischoice = false
        })
      })
      .catch(function (error) {
        console.log(error)
      })
  },
  methods: {
    GetResult (result, ReSetTime) {
      this.maindata = result
      this.TimeNow = '更新時間:' + ReSetTime
      this.selected = []
    },
    getStatus (nowstatus) {
      this.status = nowstatus
    },
    ReResult () {
      const a = document.getElementById('GetResultBTN')
      a.click()
    },
    querytoolcontrol  () {
      this.QueryToolOn = !this.QueryToolOn
    },
    getrowData () {
      const nowSelect = this.selected
      this.$store.commit('SetRepairSystemSelected', nowSelect)
      this.$router.push('/repair-system/detail')
    },
    goPrint () {
      const nowSelect = this.selected
      this.$store.commit('SetRepairSystemSelected', nowSelect)
      this.$router.push('/repair-system/print')
    },
    goAdd () {
      // 設定報修人員
      this.$refs.add.selected_DrivermanagementLogParameter.initiator_id = this.User.id
      this.$refs.add.selected_DrivermanagementLogParameter.initiator_name = this.User.name
      // 設定客運業者
      this.$refs.add.selected_DrivermanagementLogParameter.OperatorCode = this.User.OperatorCode
      this.$refs.add.OperatorList = this.OperatorList
      // 設定權限
      this.$refs.add.isBolymin = this.isBolymin
      // 帶入報修項目清單
      this.$refs.add.ItemList = this.ItemList
      this.$refs.add.persistent = !this.$refs.add.persistent
    },
    goEdit () {
      this.$refs.edit.selected_DrivermanagementLogParameter = this.selected[0]
      // 設定客運業者
      const code = this.OperatorList.filter((item) => item.OperatorName === this.selected[0].OperatorName)
      this.$refs.edit.selected_DrivermanagementLogParameter.OperatorCode = code[0].OperatorCode
      this.$refs.edit.OperatorList = this.OperatorList
      // 設定報修項目清單
      const a = this.ItemList
      const b = this.selected[0].item
      b.map((num) => {
        a.map((item) => {
          if (item.item === num) {
            item.ischoice = true
          }
        })
      })
      this.$refs.edit.ItemList = a
      // 設定報修項目
      this.$refs.edit.ChoiceItemList = this.selected[0].item
      this.$refs.edit.ChoiceItemName = this.selected[0].item_name
      // 設定照片預覽
      const PicNameList = this.selected[0].picture_filename.split(',')
      const PicUrl = this.selected[0].DownloadURL
      const PicUrlList = []
      for (var i = 0; i < PicNameList.length; i++) {
        const url = PicUrl + '/' + PicNameList[i]
        PicUrlList[i] = url
      }
      this.$refs.edit.picName_list = PicNameList
      this.$refs.edit.picURL_list = PicUrlList
      this.$refs.edit.persistent = !this.$refs.edit.persistent
      this.selected = []
    },
    goReport () {
      const today = new Date()
      const timer = new Date().toLocaleTimeString('it-IT')
      this.$refs.report.persistent = !this.$refs.report.persistent
      this.$refs.report.RepairList = this.RepairList
      this.$refs.report.selected_DrivermanagementLogParameter.OperatorName = this.selected[0].OperatorName
      this.$refs.report.selected_DrivermanagementLogParameter.repair_no = this.selected[0].repair_no
      this.$refs.report.selected_DrivermanagementLogParameter.item_name = this.selected[0].item_name
      this.$refs.report.selected_DrivermanagementLogParameter.bus_no = this.selected[0].bus_no
      this.$refs.report.selected_DrivermanagementLogParameter.reply_person_name = this.User.name
      this.$refs.report.selected_DrivermanagementLogParameter.reply_person_id = this.User.id
      this.$refs.report.selected_DrivermanagementLogParameter.reply_datetime = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + ' ' + timer
      this.selected = []
    },
    goCheck () {
      const today = new Date()
      const timer = new Date().toLocaleTimeString('it-IT')
      this.$refs.check.persistent = !this.$refs.check.persistent
      this.$refs.check.selected_DrivermanagementLogParameter.OperatorCode = this.User.OperatorCode
      this.$refs.check.selected_DrivermanagementLogParameter.repair_no = this.selected[0].repair_no
      this.$refs.check.selected_DrivermanagementLogParameter.item_name = this.selected[0].item_name
      this.$refs.check.selected_DrivermanagementLogParameter.bus_no = this.selected[0].bus_no
      this.$refs.check.selected_DrivermanagementLogParameter.confirm_person_name = this.User.name
      this.$refs.check.selected_DrivermanagementLogParameter.confirm_person_id = this.User.id
      this.$refs.check.selected_DrivermanagementLogParameter.remark = null
      this.$refs.check.selected_DrivermanagementLogParameter.confirm_datetime = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + ' ' + timer
      this.selected = []
    }
  }
}
</script>

<style lang="scss" scoped>
   @media (max-width: 500px){
    .title{
      position:relative;
      top:60px;
      height:30px;
      left:105px;
      width:60px;
      margin-bottom: 50px;
      display:flex;
      flex-direction: row;
      justify-content: space-between;
    }
    .summarylabel{
      position: absolute;
      right:0;
      text-align: center;
      width: 125px;
      max-width: 125px;
      padding: 12px 16px;
    }
    .ListIcon{
      width: 20px;
      height: 20px;
    }
    .btncover{
      background-color: gray;
      opacity: 0.8;
      position: absolute;
      top: 12px;
      right: 22px;
    }
  }
  @media (min-width: 501px){
    .title{
      position:relative;
      top:60px;
      height: 50px;
      left:140px;
      width:100px;
      margin-bottom: 50px;
      display:flex;
      flex-direction: row;
      justify-content: space-between;
    }
    .summarylabel{
      position: absolute;
      right:0;
      text-align: center;
      width: 170px;
      max-width: 170px;
    }
    .ListIcon{
      width: 25px;
      height: 25px;
    }
    .btncover{
      background-color: gray;
      opacity: 0.8;
      position: absolute;
      top: 7px;
      right: 37px;
    }
  }
  img{
    cursor: pointer;
  }
  .querytool{
    position: relative;
    width: calc(100vw - 50px);
    margin-left: 25px;
    margin-bottom: 30px;
  }
  .dataTable{
    position: relative;
    width: calc(100vw - 44px);
    margin-left: 22px;
  }
  .editIcon{
    background-image: url(../../assets/ICON/Edit.png);
    background-color: plum;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
  }
  .detailIcon{
    background-image: url(../../assets/ICON/Detail.png);
    background-color: rgb(131, 57, 214);
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    margin-left: 10px;
  }
  .RenewIcon{
    background-image: url(../../assets/ICON/Renew.png);
    background-color: rgb(204, 125, 35);
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    margin-left: 10px;
  }
  .iconlabel{
    background-color: white;
  }
  .colum-shadow{
    position: absolute;
    height: 100%;
    width: 20px;
    top: 0;
    left: -20px;
    background: linear-gradient(90deg,transparent,rgba(0,0,0,.5));
  }
</style>
