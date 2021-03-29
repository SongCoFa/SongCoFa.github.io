<template>
  <q-page>
    <Breadcrumb :nowat="PageNowAt" />
    <div class="title">
        <img style="cursor: pointer;" src="~/assets/ICON/Print.png" @click="goPrint" />
        <img v-if="isReport && isBolymin" style="cursor: pointer;" src="~/assets/ICON/Report.png" @click="goReport" />
        <img v-else-if="isCheck" style="cursor: pointer;" src="~/assets/ICON/Report.png" @click="goCheck" />
    </div>
    <div class="dataTable mainTable">
      <div class="q-pa-md">
        <div class="text_big">{{TimeNow}}</div>
        <q-table
        :title="PageNowAt"
        :data="maindata"
        :columns="maincolumns"
        row-key="name"
        selection="single"
        :selected.sync="selected"
        >

        <template v-slot:header="props">
        <q-tr :props="props" style="background-color: #32274D;">
          <q-th
            v-for="col in props.cols"
            :key="col.name"
            :props="props"
            class="text_sm"
          >
            {{ col.label }}
          </q-th>
          <q-th class="text_sm summarylabel" style="text-align:right;position:relative">描述/照片</q-th>
          <q-th class="text_sm summarylabel">
            <div class="colum-shadow"></div>
            描述/照片
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
            <q-btn :props="props" v-if="nowselected.length !== 0 && props.cols[0].value === nowselected[0].reply_datetime" @click.native="goDescription" class="checkIcon ListIcon" />
            <q-btn v-else @click.native="props.selected = !props.selected;" class="choiceIcon ListIcon" />
          </q-td>
        </q-tr>
        </template>

        </q-table>
      </div>
    </div>
    <div class="historyTable">
      <div class="q-pa-md" style="padding-top:0px;">
        <div class="historyTitleBox">
          <img style="float:left;" src="~/assets/ICON/List.png" />
          <div class="historyTitle text_sm">歷史紀錄:</div>
          <div class="colorcard text_sm">
            <div class="colorbox detailList"></div>
            <div class="colorcard-title">維修紀錄</div>
            <div class="colorbox confirmationList"></div>
            <div class="colorcard-title">確認紀錄</div>
          </div>
        </div>
        <q-table
        :title="PageNowAt"
        :data="historydata"
        :columns="historycolumns"
        row-key="name"
        selection="single"
        :selected.sync="selected"
        :pagination.sync="pagination"
        :rows-per-page-options="rowsPerPageOptions"
        >
          <template v-slot:header="props">
            <q-tr :props="props" style="background-color:#38302C;">
              <q-th
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
              class="text_sm"
              >
                {{ col.label }}
              </q-th>
              <q-th class="text_sm summarylabel">
                <div class="colum-shadow"></div>
                描述/照片
              </q-th>
              <!-- <q-th auto-width /> -->
            </q-tr>
          </template>

          <template v-slot:body="props">
            <q-tr :props="props" :class="[props.cols[5].value === 'detail' ? 'detailList' : 'confirmationList']">
              <q-td
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
              class="text_sm"
              >
              {{ col.value }}
              </q-td>
              <q-td class="summarylabel" :class="[props.cols[5].value === 'detail' ? 'detailList' : 'confirmationList']">
                <div class="colum-shadow"></div>
                <q-btn :props="props" v-if="nowselected.length !== 0 && props.cols[0].value === nowselected[0].reply_datetime" @click.native="goDescription" class="checkIcon ListIcon" />
                <q-btn v-else @click.native="props.selected = !props.selected;" class="choiceIcon ListIcon" />
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </div>
    <Report ref="report" @Report="getHistoryList" />
    <Check ref="check" />
    <Description ref="description" />
  </q-page>
</template>

<script>
import Breadcrumb from 'layouts/components/Breadcrumb.vue'
import Report from 'components/Modals/ReportRepairList.vue'
import Check from 'components/Modals/CheckRepairList.vue'
import Description from 'components/Description/Description.vue'

export default {
  name: 'Detail',
  components: {
    Breadcrumb,
    Report,
    Check,
    Description
  },
  data () {
    return {
      PageNowAt: 'RepairSystemDetail',
      TimeNow: null,
      selected: [
        {
          reply_datetime: null,
          reply_person_name: null,
          status: null,
          // usetime: null,
          attribution: null,
          repairing_parts: null,
          BB: null,
          description: null
        }
      ],
      nowselected: [
        {
          reply_datetime: null,
          reply_person_name: null,
          status: null,
          // usetime: null,
          attribution: null,
          repairing_parts: null,
          BB: null,
          description: null
        }
      ],
      pagination: {
        page: 1,
        rowsPerPage: 6,
        sortBy: '紀錄時間',
        descending: true
      },
      rowsPerPageOptions: [4],
      maincolumns: [
        { name: '報修時間', align: 'left', label: '報修時間', field: 'start_datetime', sortable: true },
        { name: '報修單號', align: 'left', label: '報修單號', field: 'repair_no', sortable: true },
        { name: '客運業者', align: 'left', label: '客運業者', field: 'OperatorName', sortable: true },
        { name: '車號', align: 'left', label: '車號', field: 'bus_no', sortable: true },
        { name: '報修項目', align: 'left', label: '報修項目', field: 'item_name', sortable: true },
        { name: '問題摘要', align: 'left', label: '問題摘要', field: 'summary', sortable: true },
        { name: '狀態', align: 'left', label: '狀態', field: 'status', sortable: true },
        { name: '處理時間', align: 'left', label: '處理時間', field: 'usetime', sortable: true },
        { name: '報修人員', align: 'left', label: '報修人員', field: 'initiator_name', sortable: true },
        { name: '報修人員電話', align: 'left', label: '報修人員電話', field: 'initiator_tel', sortable: true },
        { name: '司機姓名', align: 'left', label: '司機姓名', field: 'driver_name', sortable: true },
        { name: '司機聯絡電話', align: 'left', label: '司機聯絡電話', field: 'driver_tel', sortable: true }
      ],
      maindata: [],
      historycolumns: [
        { name: '紀錄時間', align: 'left', label: '紀錄時間', field: 'reply_datetime', sortable: true },
        // { name: '使用時間', align: 'left', label: '使用時間', field: 'usetime', sortable: true },
        { name: '記錄人員', align: 'left', label: '記錄人員', field: 'reply_person_name', sortable: true },
        { name: '維修工時(小時)', align: 'left', label: '維修工時(小時)', field: 'fix_hour', sortable: true },
        { name: '責任歸屬', align: 'left', label: '責任歸屬', field: 'attribution', sortable: true },
        { name: '更換零件', align: 'left', label: '更換零件', field: 'repairing_parts', sortable: true },
        // { name: ' ', align: 'left', label: ' ', field: 'BB', sortable: true },
        { name: '結果', align: 'right', label: '結果', field: 'type', sortable: true }
      ],
      historydata: [],
      ShowDescription: '請返回報修系統重新選擇報修主表',
      ShowPicture: '',
      PictureNow: 0,
      isReport: false,
      isCheck: false,
      isBolymin: false,
      RepairList: [],
      picURL_list: [],
      picName_list: [],
      User: {
        id: null,
        name: null,
        OperatorCode: null
      }
    }
  },
  mounted () {
    // 從store引入明細選擇項目
    if (this.$store.state.repair_system.selected === null) {
      alert('請返回報修系統重新選擇報修主表')
      this.$root.reload = this.$router.replace({ name: '報修主頁' })
      return
    }
    this.maindata = this.$store.state.repair_system.selected
    this.maindata[0].reply_datetime = this.maindata[0].start_datetime
    // 設定照片與描述內容顯示
    this.selected = this.maindata
    this.$refs.description.persistent = !this.$refs.description.persistent
    // 判別報修單狀態，藉此設定上方回覆報修單項目
    if (this.maindata[0].status === '處理中' || this.maindata[0].status === '新案件') {
      this.isReport = true
    } else if (this.maindata[0].status === '待確認') {
      this.isCheck = true
    }
    // 清除store暫存避免影響明細選擇進入功能
    this.$store.commit('CleanRepairSystemSelected')
    this.setTime()
    this.getHistoryList()
    // 設定使用者資訊
    this.User.id = window.sessionStorage.getItem('Number')
    this.User.name = window.sessionStorage.getItem('Name')
    this.User.OperatorCode = window.sessionStorage.getItem('Vender')
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
    // 設定回覆報修單權限
    if (this.User.OperatorCode === 'Bolymin') {
      this.isBolymin = true
    }
  },
  watch: {
    selected (newvalue) {
      if (this.selected.length !== 0) {
        // 設定種類
        if (typeof newvalue[0].type === 'undefined') {
          this.$refs.description.type = '報修主表'
        } else if (newvalue[0].type === 'detail') {
          this.$refs.description.type = '回覆'
        } else if (newvalue[0].type === 'confirmation') {
          this.$refs.description.type = '確認'
        }
        // 照片欄位設定
        this.PictureNow = 0
        if (this.selected[0].picture_filename !== '' && this.selected[0].picture_filename !== null) {
          const PicNameList = this.selected[0].picture_filename.split(',')
          const PicUrl = this.selected[0].DownloadURL
          const PicUrlList = []
          for (var i = 0; i < PicNameList.length; i++) {
            const url = PicUrl + '/' + PicNameList[i]
            PicUrlList[i] = url
          }
          this.picURL_list = PicUrlList
          this.picName_list = PicNameList
          this.PictureNow = 1
          this.ShowPicture = PicUrlList[0]
        } else {
          this.picURL_list = []
          this.picName_list = []
        }
        // console.log(this.picURL_list, this.picName_list)
        // 描述欄位設定
        this.ShowDescription = this.selected[0].description
        this.nowselected = this.selected
        this.selected = []
        // 開啟照片與描述視窗，並導入資料
        this.$refs.description.persistent = !this.$refs.description.persistent
        this.$refs.description.ShowPicture = this.ShowPicture
        this.$refs.description.ShowDescription = this.ShowDescription
        this.$refs.description.picURL_list = this.picURL_list
        this.$refs.description.picName_list = this.picName_list
        this.$refs.description.PictureNow = this.PictureNow
      }
    }
  },
  methods: {
    setTime () {
      const today = new Date()
      const timer = new Date().toLocaleTimeString('it-IT')
      this.TimeNow = '更新時間:' + today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + 'T ' + timer
    },
    goPrint () {
      const nowSelect = this.maindata
      this.$store.commit('SetRepairSystemSelected', nowSelect)
      this.$router.push('/repair-system/print')
    },
    goDescription () {
      this.$refs.description.persistent = !this.$refs.description.persistent
    },
    goReport () {
      const today = new Date()
      const timer = new Date().toLocaleTimeString('it-IT')
      this.$refs.report.persistent = !this.$refs.report.persistent
      this.$refs.report.RepairList = this.RepairList
      this.$refs.report.selected_DrivermanagementLogParameter.OperatorName = this.maindata[0].OperatorName
      this.$refs.report.selected_DrivermanagementLogParameter.repair_no = this.maindata[0].repair_no
      this.$refs.report.selected_DrivermanagementLogParameter.item_name = this.maindata[0].item_name
      this.$refs.report.selected_DrivermanagementLogParameter.bus_no = this.maindata[0].bus_no
      this.$refs.report.selected_DrivermanagementLogParameter.reply_person_name = this.User.name
      this.$refs.report.selected_DrivermanagementLogParameter.reply_person_id = this.User.id
      this.$refs.report.selected_DrivermanagementLogParameter.reply_datetime = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + ' ' + timer
    },
    goCheck () {
      const today = new Date()
      const timer = new Date().toLocaleTimeString('it-IT')
      this.$refs.check.persistent = !this.$refs.check.persistent
      this.$refs.check.selected_DrivermanagementLogParameter.OperatorCode = this.User.OperatorCode
      this.$refs.check.selected_DrivermanagementLogParameter.repair_no = this.maindata[0].repair_no
      this.$refs.check.selected_DrivermanagementLogParameter.item_name = this.maindata[0].item_name
      this.$refs.check.selected_DrivermanagementLogParameter.bus_no = this.maindata[0].bus_no
      this.$refs.check.selected_DrivermanagementLogParameter.confirm_person_name = this.User.name
      this.$refs.check.selected_DrivermanagementLogParameter.confirm_person_id = this.User.id
      this.$refs.check.selected_DrivermanagementLogParameter.remark = null
      this.$refs.check.selected_DrivermanagementLogParameter.confirm_datetime = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + ' ' + timer
    },
    getHistoryList () {
      const input = `?repair_no=${this.maindata[0].repair_no}`
      this.$axios.get(`/api/Repair/RepairDetailConfirmationList/${input}`)
        .then((response) => {
          response.data.map((item) => {
            const vm = item
            // 零件項目
            if (vm.type === 'detail' && vm.repairing_parts !== '{}') {
              const a = JSON.parse(vm.repairing_parts)
              let x = []
              a.repairing_parts.map((num) => {
                x = x.concat(num)
              })
              vm.repairing_parts = x
            } else {
              vm.repairing_parts = null
            }
          })
          // response.data.map((item) => {
          //   if (item.duration_hour !== null) {
          //     item.usetime = `${item.duration_day}D${item.duration_hour}H`
          //   }
          // })
          // console.log(response.data)
          this.historydata = response.data
        })
        .catch(function (error) {
          console.log(error)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
@media(max-width: 500px){
  .title{
    position:relative;
    top:60px;
    height:30px;
    left:165px;
    width:50px;
    margin-bottom: 60px;
    display:flex;
    flex-direction: row;
    justify-content: space-between;
    img{
      width:30px;
      height: 30px;
    }
  }
  .dataTable{
    position: relative;
    width: calc(100vw - 25px);
    margin:0 10px 0 10px;
    height: 180px;
  }
  .summarylabel{
    position: absolute;
    right:0;
    text-align: center;
    width: 100px;
    max-width: 100px;
    height: 49px;
    padding-bottom: 0;
  }
  .ListIcon{
    width: 20px;
    height: 20px;
  }
  .historyTable{
    position: absolute;
    width: calc(100vw - 25px);
    margin:0 10px 0 10px;
    height: 550px;
    top: 270px;
    img{
      width: 30px;
      height: 30px;
      margin-top: 3px;
    }
    .historyTitleBox{
      position: relative;
      width: 100%;
      height: 57px;
    }
    .historyTitle{
      float: left;
      padding: 7px 0 0 2px;
    }
  }
  .colorcard{
    float: right;
    width: 95px;
    padding-top: 7px;
  }
  .colorbox{
    width: 20px;
    height: 20px;
    float: left;
    box-sizing: border-box;
    border: 0.5px solid black;
    margin-left: 7px;
  }
  .colorcard-title{
    float: left;
    padding:0px 0 0 5px;
  }
}
@media(min-width: 501px){
  .title{
    position:relative;
    top:60px;
    height: 50px;
    left:225px;
    width:100px;
    margin-bottom: 45px;
    display:flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .dataTable{
    position: relative;
    width: calc(100vw - 25px);
    margin:0 10px 0 10px;
    height: 200px;
  }
  .summarylabel{
    position: absolute;
    right:0;
    text-align: center;
    width: 135px;
    max-width: 135px;
    height: 49px;
  }
  .ListIcon{
    width: 25px;
    height: 25px;
  }
  .historyTable{
    position: absolute;
    width: calc(100vw - 25px);
    margin:0 10px 0 10px;
    height: 540px;
    top: 300px;
    .historyTitleBox{
      position: relative;
      width: 100%;
      height: 46px;
    }
    .historyTitle{
      float: left;
      padding: 7px 0 0 9px;
    }
    .text-right{
      max-width: 20px;
    }
  }
  .colorcard{
    float: right;
    width: 290px;
    padding-top: 7px;
  }
  .colorbox{
    width: 35px;
    height: 35px;
    float: left;
    box-sizing: border-box;
    border: 0.5px solid black;
    margin-left: 20px;
  }
  .colorcard-title{
    float: left;
    padding:2px 0 0 5px;
  }
}
.checkIcon{
  background-image: url(../../../assets/ICON/Check.png);
  background-color: plum;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  cursor: pointer;
}
.choiceIcon{
  background-image: url(../../../assets/ICON/Choice.png);
  background-color: plum;
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  cursor: pointer;
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
.confirmationList{
  background-color: #CAC4F5;
}
.detailList{
  background-color: #D9CAA6;
}
</style>
