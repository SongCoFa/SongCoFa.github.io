<template>
  <div>
    <div v-if="query === 'RepairSystem'">
      <div class="row m-0">
        <div class="col d-inline-block" style="min-width: 193px;">
            <h4 class="text_sm">起始時間：</h4>
            <div class="input-group text_sm">
                <input type="date" class="form-control w-100" v-model="Query.start_datetime" placeholder="請輸入起始時間" />
            </div>
        </div>
        <div class="col d-inline-block" style="min-width: 193px">
            <h4 class="text_sm">結束時間：</h4>
            <div class="input-group text_sm">
                <input type="date" class="form-control w-100" v-model="Query.end_datetime" placeholder="請輸入結束時間" />
            </div>
        </div>
        <div class="col d-inline-block" style="min-width: 193px">
            <h4 class="text_sm">車號：</h4>
            <div class="input-group text_sm">
                <input type="text" class="form-control w-100" v-model="Query.bus_no" placeholder="請輸入車號" />
            </div>
        </div>
        <div class="col d-inline-block" style="min-width: 193px">
            <h4 class="text_sm">狀態：</h4>
            <div class="input-group text_sm">
                <select class="form-control w-100" v-model="Query.status">
                    <option value="new" disabled>請選擇狀態</option>
                    <option v-for="item in StatusList" :value="item.value" :key='item.name'>{{item.name}}</option>
                </select>
            </div>
        </div>
      </div>
    </div>
    <div class="row text_sm">
      <button id="GetResultBTN" class="btn btn-primary btn-block mx-3" @click="GetResult">查詢</button>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    query: String
  },
  data () {
    return {
      text: '',
      Query: {
        bus_no: '',
        start_datetime: null,
        end_datetime: null,
        OperatorCode: '',
        status: 'Processing'
      },
      StatusList: [
        {
          name: '新案件',
          value: 'New'
        },
        {
          name: '處理中',
          value: 'Processing'
        },
        {
          name: '待確認',
          value: 'Finished'
        },
        {
          name: '結案',
          value: 'Close'
        }
      ]
    }
  },
  mounted () {
    // 設定查詢客運業者權限
    this.Query.OperatorCode = window.sessionStorage.getItem('Vender')
    // 判斷有無查詢紀錄，如果有則沿用
    const querySD = window.sessionStorage.getItem('start_datetime')
    if (querySD !== null) {
      const queryED = window.sessionStorage.getItem('end_datetime')
      const queryST = window.sessionStorage.getItem('status')
      const queryBN = window.sessionStorage.getItem('bus_no')
      const GetBTN = document.getElementById('GetResultBTN')
      this.Query.start_datetime = querySD
      this.Query.end_datetime = queryED
      this.Query.status = queryST
      this.Query.bus_no = queryBN
      GetBTN.click()
    } else {
      const today = new Date()
      let month = `${today.getMonth() + 1}`
      if (month.length === 1) {
        month = '0' + `${month}`
      }
      let startday = `${today.getDate()}`
      if (startday.length === 1) {
        startday = '0' + `${startday}`
      }
      let endday = `${today.getDate() - 1}`
      if (endday.length === 1) {
        endday = '0' + `${endday}`
      }
      this.Query.end_datetime = today.getFullYear() + '-' + month + '-' + startday
      this.Query.start_datetime = today.getFullYear() + '-' + month + '-' + endday
      // console.log(this.Query.end_datetime, this.Query.start_datetime)
    }
  },
  methods: {
    GetResult () {
      const today = new Date()
      const timer = new Date().toLocaleTimeString('it-IT')
      const ReSetTime = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + 'T ' + timer
      const input = this.Query
      const test = `?start_datetime=${input.start_datetime} 00:00:00&end_datetime=${input.end_datetime} 23:59:59&OperatorCode=${input.OperatorCode}&bus_no=${input.bus_no}&status=${input.status}`
      this.$axios.get(`/api/Repair/RepairData/${test}`)
        .then((response) => {
          // console.log(response)
          response.data.map((item) => {
            const vm = item
            // 使用時間
            if (vm.duration_hour !== null) {
              vm.usetime = `${vm.duration_day}D${vm.duration_hour}H`
            }
            // 報修項目
            const a = JSON.parse(vm.item)
            let x = []
            let y = []
            a[0].item.map((num) => {
              x = x.concat(num)
            })
            vm.item = x
            const b = JSON.parse(item.item_name)
            b[0].item_name.map((num) => {
              y = y.concat(num)
            })
            vm.item_name = y
          })
          const result = response.data
          this.$emit('querytool', result, ReSetTime)
          this.setQuery()
        })
        .catch(function (error) {
          console.log(error)
        })
    },
    setQuery () {
      const SD = this.Query.start_datetime
      const ED = this.Query.end_datetime
      const ST = this.Query.status
      const BN = this.Query.bus_no
      window.sessionStorage.setItem('start_datetime', SD)
      window.sessionStorage.setItem('end_datetime', ED)
      window.sessionStorage.setItem('status', ST)
      window.sessionStorage.setItem('bus_no', BN)
    }
  }
}
</script>
