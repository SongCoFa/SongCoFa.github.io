<template>
  <q-page>
    <Breadcrumb :nowat="PageNowAt" />
    <div class="title"></div>
    <div class="text_big Timer">{{TimeNow}}</div>
    <div class="dataTable mainTable">
      <div class="q-pa-md" style="padding:0px 0px 0px 0;white-space: nowrap;">
        <table class="q-table" style="position:relative;">
          <thead>
            <tr class="q-tr" style="background-color: rgb(50, 39, 77);">
              <th class="text_sm text-left">報修時間</th>
              <th class="text_sm text-left">報修單號</th>
              <th class="text_sm text-left">客運業者</th>
              <th class="text_sm text-left">車號</th>
              <th class="text_sm text-left">報修項目</th>
              <th class="text_sm text-left">問題摘要</th>
              <th class="text_sm text-left">狀態</th>
              <th class="text_sm text-left">處理時間</th>
            </tr>
          </thead>
          <tbody>
            <tr class="q-tr" v-for="item in this.maindata" :key="item.start_datetime">
              <td class="text_sm text-left">{{item.start_datetime}}</td>
              <td class="text_sm text-left">{{item.repair_no}}</td>
              <td class="text_sm text-left">{{item.OperatorName}}</td>
              <td class="text_sm text-left">{{item.bus_no}}</td>
              <td class="text_sm text-left">{{item.item_name}}</td>
              <td class="text_sm text-left">{{item.summary}}</td>
              <td class="text_sm text-left">{{item.status}}</td>
              <td class="text_sm text-left">{{item.usetime}}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
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
    <div class="historyTable dataTable">
      <div class="q-pa-md" style="padding:0 0 2px 0; white-space: nowrap;">
        <table class="q-table" style="position:relative;">
          <thead>
            <tr class="q-tr" style="background-color: rgb(56, 48, 44);">
              <th class="text_sm text-left">紀錄時間</th>
              <!-- <th class="text_sm text-left">使用時間</th> -->
              <th class="text_sm text-left">紀錄人員</th>
              <th class="text_sm text-left">維修工時(小時)</th>
              <th class="text_sm text-left">責任歸屬</th>
              <th class="text_sm text-left">更換零件</th>
              <!-- <th class="text_sm text-left">車務訂單</th> -->
            </tr>
          </thead>
          <tbody>
            <tr class="q-tr" v-for="item in this.historydata" :key="item.reply_datetime" :class="[item.type === 'detail' ? 'detailList' : 'confirmationList']">
              <td class="text_sm text-left">{{item.reply_datetime}}</td>
              <!-- <td class="text_sm text-left">{{item.usetime}}</td> -->
              <td class="text_sm text-left">{{item.reply_person_name}}</td>
              <td class="text_sm text-left">{{item.fix_hour}}</td>
              <td class="text_sm text-left">{{item.attribution}}</td>
              <td class="text_sm text-left">{{item.repairing_parts}}</td>
              <!-- <td class="text_sm text-left">{{item.BB}}</td> -->
              <div class="detailbox">
                <div class="descriptionBox text_sm text-left">
                  <div class="desTitle">描述:</div>
                  &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;{{item.description}}
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
    this.$store.commit('CleanRepairSystemSelected')
    this.setTime()
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
    height: 110px;
    width: calc(100vw - 50px);
    margin:0px 25px 0 25px;
    border:0.5px solid gray;
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
    tbody{
      tr{
        position: relative;
        td{
          padding-bottom: 200px;
        }
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
    border: 0.5px solid gray;
    .descriptionBox{
      float: left;
      width: 23%;
      height: 100%;
    // border: 0.5px solid gray;
      .desTitle{
        height: 50px;
        padding: 7px 14px;
      }
    }
    .pictureBox{
      float: left;
      width: 77%;
      height: 100%;
      img{
        max-height: 197px;
      }
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
    height: 110px;
    width: calc(100vw - 75px);
    margin:5px 25px 0 25px;
    border:0.5px solid gray;
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
    tbody{
      tr{
        position: relative;
        td{
          padding-bottom: 200px;
        }
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
    border: 0.5px solid gray;
    .descriptionBox{
      float: left;
      width: 23%;
      height: 100%;
    // border: 0.5px solid gray;
      .desTitle{
        height: 50px;
        padding: 7px 14px;
      }
    }
    .pictureBox{
      float: left;
      width: 77%;
      height: 100%;
      img{
        max-height: 197px;
      }
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
.confirmationList{
  background-color: #CAC4F5;
}
.detailList{
  background-color: #D9CAA6;
}
</style>
