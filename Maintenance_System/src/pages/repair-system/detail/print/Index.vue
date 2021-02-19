<template>
  <q-page>
    <Breadcrumb :nowat="PageNowAt" />
    <div class="title"></div>
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
        </q-tr>
        </template>

        </q-table>
      </div>
    </div>
    <div class="mid">
      <div class="photo mid-card">
        <div class="mid-card-header">
          <img src="~/assets/ICON/Photo.png" />
          <div class="card-title text_sm">照片: ({{PictureNow}}/{{picName_list.length}})</div>
        </div>
        <div class="mid-card-body" style="background-color: rgb(35, 36, 36);">
          <div class="text_sm" v-if="picName_list.length === 0" style="color: white;">此紀錄尚無照片</div>
          <div class="text_sm picturebox" v-else-if="picName_list.length !== 0" style="position: relative; width:100%; height:100%;">
            <img class="picture" :src="ShowPicture" />
          </div>
          <img class="picbtn" style="left: 0;" src="~/assets/ICON/picleft.png" @click="PicGoLeft" />
          <img class="picbtn" style="right: 0;" src="~/assets/ICON/picright.png" @click="PicGoRight" />
        </div>
      </div>
      <div class="detail mid-card">
        <div class="mid-card-header">
          <img src="~/assets/ICON/Description.png" />
          <div class="card-title text_sm">描述:</div>
        </div>
        <div class="mid-card-body text_sm" style="border: 1px solid black;">
          {{ ShowDescription }}
        </div>
      </div>
    </div>
    <div class="historyTable">
      <div class="q-pa-md" style="padding-top:0px;">
        <div style="position:relative; width:100%; height:46px;">
          <img style="float:left;" src="~/assets/ICON/List.png" />
          <div style="float:left; padding:7px 0 0 9px;" class="text_sm">歷史紀錄:</div>
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
              <!-- <q-th auto-width /> -->
            </q-tr>
          </template>

          <template v-slot:body="props">
            <q-tr :props="props" :class="[props.cols[7].value === 'detail' ? 'detailList' : 'confirmationList']">
              <q-td
              v-for="col in props.cols"
              :key="col.name"
              :props="props"
              class="text_sm"
              >
              {{ col.value }}
              </q-td>
            </q-tr>
          </template>
        </q-table>
      </div>
    </div>
  </q-page>
</template>

<script>
import Breadcrumb from 'layouts/components/Breadcrumb.vue'

export default {
  name: 'Detail',
  components: {
    Breadcrumb
  },
  data () {
    return {
      PageNowAt: 'RepairSystemDetailPrint',
      TimeNow: null,
      selected: [
        {
          reply_datetime: null,
          reply_person_name: null,
          status: null,
          usetime: null,
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
          usetime: null,
          attribution: null,
          repairing_parts: null,
          BB: null,
          description: null
        }
      ],
      pagination: {
        page: 1,
        rowsPerPage: 4
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
        { name: '使用時間', align: 'left', label: '使用時間', field: 'usetime', sortable: true }
      ],
      maindata: [],
      historycolumns: [
        { name: '紀錄時間', align: 'left', label: '紀錄時間', field: 'reply_datetime', sortable: true },
        { name: '使用時間', align: 'left', label: '使用時間', field: 'usetime', sortable: true },
        { name: '記錄人員', align: 'left', label: '記錄人員', field: 'reply_person_name', sortable: true },
        { name: '維修工時(小時)', align: 'left', label: '維修工時(小時)', field: 'fix_hour', sortable: true },
        { name: '責任歸屬', align: 'left', label: '責任歸屬', field: 'attribution', sortable: true },
        { name: '更換零件', align: 'left', label: '更換零件', field: 'repairing_parts', sortable: true },
        { name: '車務訂單', align: 'left', label: '車務訂單', field: 'BB', sortable: true },
        { name: '結果', align: 'right', label: '結果', field: 'type', sortable: true }
      ],
      historydata: [],
      ShowDescription: '請返回報修系統重新選擇報修主表',
      ShowPicture: '',
      PictureNow: 0,
      isReport: false,
      isCheck: false,
      isBolymin: false,
      picURL_list: [],
      picName_list: [],
      User: {
        id: null,
        name: null,
        OperatorCode: null
      }
      // User: {
      //   id: '90001',
      //   name: '測試員',
      //   OperatorCode: 'Bolymin'
      // }
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
    // 清除store暫存避免影響明細選擇進入功能
    this.$store.commit('CleanRepairSystemSelected')
    this.setTime()
    this.getHistoryList()
    // 設定使用者資訊
    this.User.id = window.sessionStorage.getItem('Number')
    this.User.name = window.sessionStorage.getItem('Name')
    this.User.OperatorCode = window.sessionStorage.getItem('Vender')
  },
  watch: {
    selected (newvalue) {
      if (this.selected.length !== 0) {
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
      }
    }
  },
  methods: {
    setTime () {
      const today = new Date()
      const timer = new Date().toLocaleTimeString('it-IT')
      this.TimeNow = '更新時間:' + today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + 'T ' + timer
    },
    getHistoryList () {
      const input = `?repair_no=${this.maindata[0].repair_no}`
      this.$axios.get(`/api/Repair/RepairDetailConfirmationList/${input}`)
        .then((response) => {
          // console.log(response)
          response.data.map((item) => {
            if (item.duration_hour !== null) {
              item.usetime = `${item.duration_day}D${item.duration_hour}H`
            }
          })
          this.historydata = response.data
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    PicGoLeft () {
      const vm = this
      let i = vm.PictureNow - 1
      const l = vm.picURL_list.length
      if (l !== 0) {
        i--
        if (i < 0) {
          i = i + l
          vm.ShowPicture = vm.picURL_list[i]
          vm.PictureNow = i + 1
        } else {
          vm.ShowPicture = vm.picURL_list[i]
          vm.PictureNow = i + 1
        }
      }
    },
    PicGoRight () {
      const vm = this
      let i = vm.PictureNow - 1
      const l = vm.picURL_list.length
      if (l !== 0) {
        i++
        if (i === l) {
          i = i - l
          vm.ShowPicture = vm.picURL_list[i]
          vm.PictureNow = i + 1
        } else {
          vm.ShowPicture = vm.picURL_list[i]
          vm.PictureNow = i + 1
        }
      }
    }
  }
}
</script>

<style lang="scss" scoped>
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
.mid{
  position: absolute;
  top:260px;
  width: calc(100vw - 56px);
  margin-left: 25px;
  height: 342px;
}
.mid-card{
  position: relative;
  width: calc(50vw - 42px);
  height: 342px;
}
.mid-card-header{
  width: 50%;
  height: 42px;
  img{
    float: left;
  }
  .card-title{
    padding-top: 9px;
    margin-left: 55px;
  }
}
.mid-card-body{
  position: relative;
  width: 100%;
  height: 300px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow-y: hidden;
}
.photo{
  float: left;
}
.picbtn{
  width: 45px;
  height: 45px;
  cursor: pointer;
  position: absolute;
}
.picturebox{
  position: relative;
  width:100%;
  height:100%;
  display: flex;
  align-items: center;
  justify-content: center;
}
.picture{
  height: 100%;
  background-size: cover;
  background-position: 50% 50%;
}
.detail{
  float: right;
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
.historyTable{
  position: absolute;
  width: calc(100vw - 25px);
  margin:0 10px 0 10px;
  height: 400px;
  top: 602px;
}
.summarylabel{
  position: absolute;
  right:0;
  text-align: center;
  width: 155px;
  max-width: 155px;
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
