<template>
  <q-page>
    <Breadcrumb :nowat="PageNowAt" class="noprint" />
    <div class="title noprint"></div>
    <div class="text_big Timer">{{TimeNow}}</div>
    <div class="dataTable mainTable">
      <div class="q-pa-md" style="padding:0px 0px 0px 0;white-space: nowrap;">
        <table class="q-table" style="position:relative;">
          <thead class="faker" style="background-color: whitesmoke;">
            <tr class="q-tr theader">
              <th class="text_sm text-left">報修時間</th>
              <th class="text_sm text-left">報修單號</th>
              <th class="text_sm text-left">客運業者</th>
              <th class="text_sm text-left">車號</th>
              <th class="text_sm text-left">報修項目</th>
              <th class="text_sm text-left">處理時間</th>
            </tr>
          </thead>
          <thead>
            <tr class="q-tr theader">
              <th class="text_sm text-left">報修時間</th>
              <th class="text_sm text-left">報修單號</th>
              <th class="text_sm text-left">客運業者</th>
              <th class="text_sm text-left">車號</th>
              <th class="text_sm text-left">報修項目</th>
              <th class="text_sm text-left">處理時間</th>
            </tr>
          </thead>
          <tbody>
            <tr class="q-tr">
              <td class="text_sm text-left" >{{this.maindata[0].start_datetime}}</td>
              <td class="text_sm text-left" >{{this.maindata[0].repair_no}}</td>
              <td class="text_sm text-left" >{{this.maindata[0].OperatorName}}</td>
              <td class="text_sm text-left" >{{this.maindata[0].bus_no}}</td>
              <td class="text_sm text-left" >{{this.maindata[0].item_name}}</td>
              <td class="text_sm text-left" >{{this.maindata[0].usetime}}</td>
            </tr>
          </tbody>
          <thead>
            <tr class="q-tr theader">
              <th class="text_sm text-left">報修人員</th>
              <th class="text_sm text-left">報修人員電話</th>
              <th class="text_sm text-left">司機姓名</th>
              <th class="text_sm text-left">司機聯絡電話</th>
              <th class="text_sm text-left">問題摘要</th>
              <th class="text_sm text-left">狀態</th>
            </tr>
          </thead>
          <tbody>
            <tr class="q-tr" v-for="item in this.maindata" :key="item.start_datetime">
              <td class="text_sm text-left" :class="[item.picture_filename !== '' ? 'havepic' : 'nopic']">{{item.initiator_name}}</td>
              <td class="text_sm text-left" :class="[item.picture_filename !== '' ? 'havepic' : 'nopic']">{{item.initiator_tel}}</td>
              <td class="text_sm text-left" :class="[item.picture_filename !== '' ? 'havepic' : 'nopic']">{{item.driver_name}}</td>
              <td class="text_sm text-left" :class="[item.picture_filename !== '' ? 'havepic' : 'nopic']">{{item.driver_tel}}</td>
              <td class="text_sm text-left" :class="[item.picture_filename !== '' ? 'havepic' : 'nopic']">{{item.summary}}</td>
              <td class="text_sm text-left" :class="[item.picture_filename !== '' ? 'havepic' : 'nopic']">{{item.status}}</td>
              <div class="detailbox">
                <div class="descriptionBox text_sm text-left">
                  <div class="desTitle" style="border-top: 0.5px solid black;">問題描述:</div>
                  <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{item.description}}</div>
                </div>
                <div class="pictureBox container">
                  <div class="row" v-if="item.picture_filename !== ''">
                    <img class="col" v-for="(pic, index) in item.picurllist" :key="index" :src="pic">
                  </div>
                </div>
              </div>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
    <div class="historyTitleBox">
      <img style="float:left;" src="~/assets/ICON/List.png" />
      <div class="historyTitle text_sm">歷史紀錄:</div>
    </div>
    <div class="historyTable dataTable">
      <div class="q-pa-md" style="padding:0 0 2px 0; white-space: nowrap;">
        <table class="q-table" style="position:relative;">
          <thead>
            <tr class="q-tr theader">
              <th class="text_sm text-left">紀錄時間</th>
              <!-- <th class="text_sm text-left">使用時間</th> -->
              <th class="text_sm text-left">紀錄類別</th>
              <th class="text_sm text-left">紀錄人員</th>
              <th class="text_sm text-left">維修工時(小時)</th>
              <th class="text_sm text-left">責任歸屬</th>
              <th class="text_sm text-left">更換零件</th>
              <!-- <th class="text_sm text-left">車務訂單</th> -->
            </tr>
          </thead>
          <tbody>
            <tr class="q-tr" v-if="this.historydata.length === 0"><td class="text_sm">目前尚無歷史紀錄</td></tr>
            <tr class="q-tr test" v-for="item in this.historydata" :key="item.reply_datetime">
              <td class="text_sm text-left" :class="[item.picture_filename !== null ? 'havepic' : 'nopic']">{{item.reply_datetime}}</td>
              <!-- <td class="text_sm text-left">{{item.usetime}}</td> -->
              <td class="text_sm text-left" :class="[item.picture_filename !== null ? 'havepic' : 'nopic']">
                <div v-if="item.type === 'detail'">維修回覆</div>
                <div v-else-if="item.type === 'confirmation'">驗收確認</div>
              </td>
              <td class="text_sm text-left" :class="[item.picture_filename !== null ? 'havepic' : 'nopic']">{{item.reply_person_name}}</td>
              <td class="text_sm text-left" :class="[item.picture_filename !== null ? 'havepic' : 'nopic']">{{item.fix_hour}}</td>
              <td class="text_sm text-left" :class="[item.picture_filename !== null ? 'havepic' : 'nopic']">{{item.attribution}}</td>
              <td class="text_sm text-left" :class="[item.picture_filename !== null ? 'havepic' : 'nopic']">{{item.repairing_parts}}</td>
              <!-- <td class="text_sm text-left">{{item.BB}}</td> -->
              <div class="detailbox">
                <div class="descriptionBox text_sm text-left">
                  <div v-if="item.type === 'detail'" class="desTitle">故障原因或處理方式:</div>
                  <div v-else-if="item.type === 'confirmation'" class="desTitle">意見:</div>
                  <div>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{item.description}}</div>
                </div>
                <div class="pictureBox container">
                  <div class="row" v-if="item.picture_filename !== null">
                    <img style="max-width:325px;" class="col" v-for="(pic, index) in item.picurllist" :key="index" :src="pic">
                  </div>
                </div>
              </div>
            </tr>
          </tbody>
        </table>
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
      maindata: [],
      historydata: []
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
    // 清除store暫存避免影響明細選擇進入功能
    // this.$store.commit('CleanRepairSystemSelected')
    this.setTime()
    console.log(this.maindata)
    // 設定報修主表照片
    if (this.maindata[0].picture_filename !== null && this.maindata[0].picture_filename !== '') {
      const PicNameList = this.maindata[0].picture_filename.split(',')
      const PicUrl = this.maindata[0].DownloadURL
      const PicUrlList = []
      for (var i = 0; i < PicNameList.length; i++) {
        const url = PicUrl + '/' + PicNameList[i]
        PicUrlList[i] = url
      }
      this.maindata[0].picurllist = PicUrlList
    }
    this.getHistoryList()
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
            // if (item.duration_hour !== null) {
            //   item.usetime = `${item.duration_day}D${item.duration_hour}H`
            // }
            if (item.picture_filename !== null && item.picture_filename !== '') {
              const PicNameList = item.picture_filename.split(',')
              const PicUrl = item.DownloadURL
              const PicUrlList = []
              for (var i = 0; i < PicNameList.length; i++) {
                const url = PicUrl + '/' + PicNameList[i]
                PicUrlList[i] = url
              }
              item.picurllist = PicUrlList
            }
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
  .faker{
    opacity: 0;
  }
  .title{
    position:relative;
    top:60px;
    height: 35px;
    left:225px;
    width:90px;
    margin-bottom: 45px;
    display:flex;
    flex-direction: row;
    justify-content: space-between;
  }
  .Timer{
    position: relative;
    display: inline-block;
    height: 25px;
    width: 310px;
    padding-left: 25px;
    margin-top: 10px;
  }
  .dataTable{
    position: relative;
    overflow-y: hidden;
  }
  .mainTable{
    width: calc(100vw - 50px);
    margin:0px 25px 0 25px;
    border:0.5px solid gray;
    top: -25px;
    th{
      border-top: 0.5px solid black;
    }
    td{
      border-bottom: 0.5px solid black;
    }
  }
  .historyTitleBox{
    position: relative;
    margin: 10px 25px 10px;
    width: calc(100% - 46px);
    height: 46px;
    .historyTitle{
      float: left;
      padding: 7px 0 0 9px;
    }
  }
  .historyTable{
    position: relative;
    width: calc(100vw - 50px);
    margin:0 25px 10px 25px;
    border:0.5px solid gray;
    td{
      border-top:0.5px solid black;
      border-bottom:0.5px solid black;
    }
  }
  tbody{
    tr{
      position: relative;
      .havepic{
        padding-bottom: 315px;
      }
      .nopic{
        padding-bottom: 120px;
      }
    }
  }
  .detailbox{
    position: absolute;
    display: inline-block;
    left: 0;
    padding-top: 42px;
    width: 100%;
    height: 242px;
    .descriptionBox{
      float: left;
      word-wrap: break-word;
      white-space: pre-wrap;
      max-height: 125px;
      width: 100%;
      overflow-y: hidden;
      .desTitle{
        height: 40px;
        padding: 7px 14px 7px;
        font-weight: bold;
        color: rgb(122, 14, 50);
      }
    }
    .pictureBox{
      clear: both;
      float: left;
      width: 100%;
      height: 100%;
      img{
        width: 100%;
        height: 100%;
        max-height: 175px;
        max-width: 250px;
        padding: 0 6px;
      }
    }
  }
}
@media(min-width: 501px){
  .faker{
    opacity: 0;
  }
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
  .Timer{
    position: relative;
    display: inline-block;
    height: 35px;
    width: 450px;
    padding-left: 25px;
    margin-top: 10px;
  }
  .dataTable{
    position: relative;
    overflow-y: hidden;
  }
  .mainTable{
    width: calc(100vw - 75px);
    margin:5px 25px 0 25px;
    border:1px solid black;
    top: -40px;
    th{
      border-top: 0.5px solid black;
    }
    td{
      border-bottom: 0.5px solid black;
    }
  }
  .historyTitleBox{
    position: relative;
    margin: 20px 25px 10px;
    width: calc(100% - 55px);
    height: 46px;
    .historyTitle{
      float: left;
      padding: 7px 0 0 9px;
    }
  }
  .historyTable{
    position: relative;
    width: calc(100vw - 75px);
    margin:0 25px 10px 25px;
    border:0.5px solid gray;
    td{
      border-top:1px solid black;
      border-bottom:1px solid black;
    }
  }
  tbody{
    tr{
      position: relative;
      .havepic{
        padding-bottom: 370px;
      }
      .nopic{
        padding-bottom: 150px;
      }
    }
  }
  .detailbox{
    position: absolute;
    display: inline-block;
    left: 0;
    padding-top: 42px;
    width: 100%;
    .descriptionBox{
      float: left;
      word-wrap: break-word;
      white-space: pre-wrap;
      max-height: 165px;
      width: 100%;
      overflow-y: hidden;
      .desTitle{
        height: 40px;
        padding: 7px 14px 7px;
        font-weight: bold;
        color: rgb(122, 14, 50);
      }
    }
    .pictureBox{
      clear: both;
      float: left;
      width: 100%;
      height: 100%;
      img{
        max-height: 197px;
        max-width:325px;
      }
    }
  }
}
@media print {
  .noprint{
    display: none;
  }
  .faker{
    position: relative;
    opacity: 0;
  }
}
.theader{
  color: black;
  background-color: whitesmoke;
  th{
    font-weight: bold;
  }
}
.test{
  border: 0.5px solid black;
}
th{
  color: rgb(122, 14, 50);
}
</style>
