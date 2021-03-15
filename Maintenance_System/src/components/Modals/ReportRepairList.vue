<template>
    <q-dialog v-model="persistent" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg_pink" style="min-width:230px;">
        <q-card-section>
          <div class="text_big title">回覆報修單</div>
          <q-btn id="closs_btn" flat @click="cleanAll" v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-none row bg_pink2">
          <div class="row w-100 text_sm mb_20" style="margin-top:10px;">
            <div class="col col_box">
              <span>
                表單編號：
              </span>
              <div class="form-group input-group">
                <input class="form-control w-100" type="text" v-model="selected_DrivermanagementLogParameter.repair_no" disabled>
              </div>
            </div>
            <div class="col col_box">
              <span>
                客運業者：
              </span>
              <div class="form-group input-group">
                <input class="form-control w-100" type="text" v-model="selected_DrivermanagementLogParameter.OperatorName" disabled>
              </div>
            </div>
          </div>
          <div class="row w-100 text_sm mb_20">
            <div class="col col_box">
              <span>
                車號：
              </span>
              <div class="form-group input-group">
                <input class="form-control w-100" type="text" v-model="selected_DrivermanagementLogParameter.bus_no" disabled>
              </div>
            </div>
            <div class="col col_box">
              <span>
                報修項目：
              </span>
              <div class="form-group input-group">
                <input class="form-control w-100" type="text" v-model="selected_DrivermanagementLogParameter.item_name" disabled>
              </div>
            </div>
          </div>
          <div class="row w-100 text_sm mb_20">
            <div class="col col_box">
              <span>
                回覆時間：
              </span>
              <div class="form-group input-group">
                <input class="form-control w-100" type="text" v-model="selected_DrivermanagementLogParameter.reply_datetime" disabled>
              </div>
            </div>
            <div class="col col_box">
              <span>
                回覆人員：
              </span>
              <div class="form-group input-group">
                <input class="form-control w-100" type="text" v-model="selected_DrivermanagementLogParameter.reply_person_name" disabled>
              </div>
            </div>
          </div>
          <div class="row w-100 text_sm mb_20">
            <div class="col col_box">
              <span>
                維修工時(小時)：
              </span>
              <div class="must" v-if="selected_DrivermanagementLogParameter.fix_hour === ''">(*完修必填)</div>
              <div class="form-group input-group">
                <input class="form-control w-100" :class="{mustborder: selected_DrivermanagementLogParameter.fix_hour === ''}" type="number" value="0" v-model.trim="selected_DrivermanagementLogParameter.fix_hour">
              </div>
            </div>
            <div class="col col_box">
              <span>
                責任歸屬：
              </span>
              <div class="must" v-if="selected_DrivermanagementLogParameter.attribution === null">(*完修必填)</div>
              <div class="form-group input-group">
                <!-- <input class="form-control w-100" :class="{mustborder: selected_DrivermanagementLogParameter.attribution === null}" type="text" placeholder="請選擇責任歸屬" v-model="selected_DrivermanagementLogParameter.attribution"> -->
                <select class="form-control w-100" v-model="selected_DrivermanagementLogParameter.attribution">
                    <option v-for="item in AttributionList" :class="{itemChoice: item.ischoice}" :value="item.name" :key='item.name'>{{item.name}}</option>
                </select>
              </div>
            </div>
          </div>
          <div class="row w-100 text_sm mb_20">
            <div class="col col_box">
              <span>
                更換零件：
              </span>
              <div v-if="ChoicePartsName.length !== 0">
                <div class="item_text" v-for="item in ChoicePartsName" :key='item'>{{item}}</div>
              </div>
              <div class="form-group input-group">
                <!-- <input class="form-control w-100" type="text" placeholder="請輸入更換零件" v-model.trim="selected_DrivermanagementLogParameter.repairing_parts"> -->
                <select class="form-control w-100" v-model="ChoiceParts">
                    <option value="" disabled>請選擇更換零件</option>
                    <option v-for="item in RepairList" :class="{itemChoice: item.ischoice}" :value="item.item" :key='item.name'>{{item.name}}</option>
                </select>
              </div>
            </div>
            <div class="col col_box">
              <span>
                故障原因或處理方式：
              </span>
              <div class="must" v-if="selected_DrivermanagementLogParameter.description === ''">(*完修必填)</div>
              <div class="form-group input-group">
                <input class="form-control w-100" :class="{mustborder: selected_DrivermanagementLogParameter.description === ''}" type="text" placeholder="請輸入故障原因或處理方式" v-model.trim="selected_DrivermanagementLogParameter.description">
              </div>
            </div>
          </div>
          <div class="row w-100 text_sm mb_20">
            <div class="col col_box">
              <span>
                上傳照片：
              </span>
              <div class="form-group input-group">
                <input type="file" accept="image/*" multiple="multiple" @change="previewMultiImage" class="form-control-file" id="my-file">
              </div>
            </div>
          </div>
          <div class="row w-100 text_sm mb_20">
            <div class="col col_box" v-if="0 < picURL_list.length">
              <div>
                照片預覽：上傳數量{{picURL_list.length}}
              </div>
              <div class="w-100" v-for="(item, index) in picURL_list" :key="index">
                <q-btn class="pic_btn" flat @click="cleanPic(index)"/>
                <img :src="item" class="img-fluid w-100" />
                <p class="mb-0">名稱: {{ picName_list[index] }}</p>
                <!-- <p>size: {{ image_list[index].size/1024 }}KB</p> -->
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="center" class="text-teal" style="height:60px;">
          <q-btn class="check_btn" flat label="完修" @click="Finish" />
          <q-btn class="re_btn" flat label="回覆" @click="Report" />
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>

<script>
export default {
  data () {
    return {
      persistent: false,
      RepairList: [],
      AttributionList: [
        { name: '待確認' },
        { name: '自責' },
        { name: '客責' }
      ],
      selected_DrivermanagementLogParameter: {
        OperatorName: '寶麗明測試',
        reply_datetime: null,
        reply_person_name: '測試員',
        reply_person_id: null,
        bus_no: null,
        repair_no: '',
        item_name: null,
        fix_hour: '0',
        attribution: '待確認',
        repairing_parts: '',
        description: ''
      },
      ChoiceParts: '',
      ChoicePartsList: [],
      ChoicePartsName: [],
      preview_list: [],
      image_list: [],
      picURL_list: [],
      picName_list: []
    }
  },
  watch: {
    ChoiceParts (newpart) {
      if (this.ChoiceParts === '') {
        return
      }
      this.RepairList.map((item) => {
        if (item.item === newpart && item.ischoice === false) {
          if (this.ChoicePartsList.length >= 5) {
            alert('零件項目不可複選超過5項')
            return
          }
          item.ischoice = true
        } else if (item.item === newpart && item.ischoice === true) {
          item.ischoice = false
        }
      })
      this.ChoicePartsName = []
      this.ChoicePartsList = []
      const Choice = this.RepairList.filter(item => item.ischoice === true)
      if (Choice.length !== 0) {
        Choice.map((item) => {
          const newName = `${item.name}`
          const newlist = item.item
          this.ChoicePartsName = this.ChoicePartsName.concat(newName)
          this.ChoicePartsList = this.ChoicePartsList.concat(newlist)
        })
      }
      this.ChoiceParts = ''
    }
  },
  methods: {
    cleanAll () {
      this.selected_DrivermanagementLogParameter = {
        OperatorName: '寶麗明測試',
        reply_datetime: null,
        reply_person_name: '測試員',
        reply_person_id: null,
        bus_no: null,
        repair_no: '',
        item_name: null,
        fix_hour: '0',
        attribution: '待確認',
        repairing_parts: '',
        description: ''
      }
      this.RepairList.map((item) => {
        item.ischoice = false
      })
      this.ChoiceParts = ''
      this.ChoicePartsList = []
      this.ChoicePartsName = []
      this.picURL_list = []
      this.picName_list = []
    },
    Finish () {
      let picname = ''
      for (var i = 0; i < this.picName_list.length; i++) {
        if (i === 0) {
          picname = `${this.picName_list[i]}`
        } else {
          picname = `${picname}` + ',' + `${this.picName_list[i]}`
        }
      }
      this.selected_DrivermanagementLogParameter.picture_filename = picname
      // 零件項目轉換json
      if (this.ChoicePartsList.length === 0) {
        this.selected_DrivermanagementLogParameter.repairing_parts = JSON.stringify({})
      } else {
        const a = JSON.stringify({ repairing_parts: this.ChoicePartsList })
        this.selected_DrivermanagementLogParameter.repairing_parts = a
      }
      // 設定完修
      this.selected_DrivermanagementLogParameter.result = true
      const check = this.inspection(this.selected_DrivermanagementLogParameter)
      if (!check) {
        alert('必填項目不得為空')
      } else {
        const close = document.getElementById('closs_btn')
        // 轉換字串成數字
        let num = parseFloat(this.selected_DrivermanagementLogParameter.fix_hour)
        num = num.toFixed(1)
        this.selected_DrivermanagementLogParameter.fix_hour = num
        this.$axios.post('/api/Repair/RepairDetail', this.selected_DrivermanagementLogParameter)
          .then((response) => {
          // console.log(response)
            if (response.data[0].ReturnMessage === '成功') {
              close.click()
              alert('報修單完修，請等待客戶驗收確認')
              this.$router.push('/repair-system')
            } else {
              alert('回覆報修單失敗，請稍後確認填入資料正確後再嘗試')
            }
          })
          .catch(function (error) {
            console.log(error)
            alert('回覆報修單失敗，請稍後確認填入資料正確後再嘗試')
          })
      }
    },
    Report () {
      this.selected_DrivermanagementLogParameter.result = false
      let picname = ''
      for (var i = 0; i < this.picName_list.length; i++) {
        if (i === 0) {
          picname = `${this.picName_list[i]}`
        } else {
          picname = `${picname}` + ',' + `${this.picName_list[i]}`
        }
      }
      this.selected_DrivermanagementLogParameter.picture_filename = picname
      // 零件項目轉換json
      if (this.ChoicePartsList.length === 0) {
        this.selected_DrivermanagementLogParameter.repairing_parts = JSON.stringify({})
      } else {
        const a = JSON.stringify({ repairing_parts: this.ChoicePartsList })
        this.selected_DrivermanagementLogParameter.repairing_parts = a
      }
      // 轉換字串成數字
      let num = parseFloat(this.selected_DrivermanagementLogParameter.fix_hour)
      num = num.toFixed(1)
      this.selected_DrivermanagementLogParameter.fix_hour = num
      // console.log(num)
      this.$axios.post('/api/Repair/RepairDetail', this.selected_DrivermanagementLogParameter)
        .then((response) => {
          // console.log(response)
          this.$emit('Report')
          if (response.data[0].ReturnMessage === '成功') {
            const close = document.getElementById('closs_btn')
            alert('回覆報修單成功')
            close.click()
          } else {
            alert('回覆報修單失敗，請稍後確認填入資料正確後再嘗試')
          }
        })
        .catch(function (error) {
          console.log(error)
          alert('回覆報修單失敗，請稍後確認填入資料正確後再嘗試')
        })
    },
    previewMultiImage (event) {
      var input = event.target
      var count = input.files.length
      var index = 0
      if (input.files) {
        while (count--) {
          var reader = new FileReader()
          reader.onload = (e) => {
            this.preview_list.push(e.target.result)
          }
          this.image_list.push(input.files[index])
          reader.readAsDataURL(input.files[index])
          index++
          // console.log(this.preview_list, this.image_list)
        }
      }
      this.uploadpicture()
    },
    uploadpicture () {
      const formData = new FormData()
      for (var i = 0; i < this.image_list.length; i++) {
        formData.append(i, this.image_list[i])
      }
      // Object.keys(this.image_list).forEach((item) => {
      //   formData.append(item, this.image_list[`${item}`])
      // })
      this.$axios
        .post('/api/Repair/PictureUpload', formData, {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        })
        .then((response) => {
          // console.log(response)
          const name = response.data.fileNames
          const url = response.data.fileURLs
          this.picName_list = this.picName_list.concat(name)
          this.picURL_list = this.picURL_list.concat(url)
        })
        .catch(function (error) {
          console.log(error)
          alert('上傳照片失敗，請稍後再嘗試')
        })
      this.preview_list = []
      this.image_list = []
    },
    cleanPic (i) {
      if (i === 0) {
        this.picName_list.shift()
        this.picURL_list.shift()
      } else {
        this.picName_list.splice(i, i)
        this.picURL_list.splice(i, i)
      }
    },
    inspection (item) {
      // console.log(item)
      if (item.fix_hour === '' || item.attribution === null || item.description === '') {
        return false
      } else {
        return true
      }
    }
  }
}
</script>

<style lang="scss" scoped>
@media (max-width: 500px){
  .col_box{
    min-width: 195px;
  }
  .title{
    font-weight: bold;
    height: 22px;
  }
  .item_text{
    clear: both;
    font-weight: normal;
    font-size: 14px;
  }
  #closs_btn{
    position: absolute;
    top: 0;
    right: 0;
    font-weight: bold;
    font-size: 20px;
    background-image: url(../../assets/ICON/Cross.png);
    background-position: 50% 50%;
    background-repeat: no-repeat;
  }
  .check_btn{
    background-color: #A33758;
    width: 33%;
    min-width: 90px;
    color: whitesmoke;
    margin: 0 15px 0 0;
  }
  .re_btn{
    background-color: #3CA395;
    width: 33%;
    min-width: 90px;
    color: whitesmoke;
    margin: 0 0 0 0px;
  }
  .pic_btn{
    position: relative;
    display: block;
    width: 20px;
    height: 20px;
    font-weight: bold;
    font-size: 16px;
    background-image: url(../../assets/ICON/Cross.png);
    background-position: 50% 50%;
    background-repeat: no-repeat;
    background-size: contain;
    background-color: white;
    border-radius: 50%;
  }
}
@media (min-width: 501px){
  .col_box{
    min-width: 250px;
  }
  .title{
    font-weight: bold;
    height: 36px;
  }
  .item_text{
    clear: both;
    font-weight: normal;
    font-size: 17px;
  }
  #closs_btn{
    position: absolute;
    top: 0;
    right: 0;
    font-weight: bold;
    font-size: 26px;
    background-image: url(../../assets/ICON/Cross.png);
    background-position: 50% 50%;
    background-repeat: no-repeat;
  }
  .check_btn{
    background-color: #A33758;
    width: 33%;
    color: whitesmoke;
    margin: 0 80px 0 0;
  }
  .re_btn{
    background-color: #3CA395;
    width: 33%;
    color: whitesmoke;
    margin: 0 0 0 80px;
  }
  .pic_btn{
    position: relative;
    display: block;
    width: 30px;
    height: 30px;
    font-weight: bold;
    font-size: 26px;
    background-image: url(../../assets/ICON/Cross.png);
    background-position: 50% 50%;
    background-repeat: no-repeat;
    background-size: contain;
    background-color: white;
    border-radius: 50%;
  }
}
.mb_20{
  margin-bottom: 20px;
  font-weight: bold;
}
.bg_pink{
  background-color: #C791BA;
}
.bg_pink2{
  background-color: #E0CED3;
}
.col span{
  float: left;
}
.must{
  color: red;
  font-size: 16px;
}
.mustborder{
  border: 0.5px solid red;
  border-radius: 5px;
}
.itemChoice{
  background-color: rgb(97, 37, 138);
  color: whitesmoke;
}
</style>
