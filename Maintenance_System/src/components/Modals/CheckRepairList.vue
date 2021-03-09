<template>
    <q-dialog v-model="persistent" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg_pink" style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <div class="text_big title">確認報修單</div>
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
                <select v-if="isBolymin" class="form-control w-100" v-model="selected_DrivermanagementLogParameter.OperatorCode">
                    <option value="" disabled>請選擇客運業者</option>
                    <option v-for="item in OperatorList" :value="item.OperatorCode" :key='item.OperatorName'>{{item.OperatorName}}</option>
                </select>
                <select v-else class="form-control w-100" v-model="selected_DrivermanagementLogParameter.OperatorCode" disabled>
                    <option value="" disabled>請選擇客運業者</option>
                    <option v-for="item in OperatorList" :value="item.OperatorCode" :key='item.OperatorName'>{{item.OperatorName}}</option>
                </select>
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
                確認時間：
              </span>
              <div class="form-group input-group">
                <input class="form-control w-100" type="text" v-model="selected_DrivermanagementLogParameter.confirm_datetime" disabled>
              </div>
            </div>
            <div class="col col_box">
              <span>
                確認人員：
              </span>
              <div class="form-group input-group">
                <input class="form-control w-100" type="text" v-model="selected_DrivermanagementLogParameter.confirm_person_name" disabled>
              </div>
            </div>
          </div>
          <div class="row w-100 text_sm mb_20">
            <div class="col col_box">
              <span>
                意見：
              </span>
              <div class="form-group input-group">
                <input class="form-control w-100" type="text" placeholder="請輸入意見" v-model.trim="selected_DrivermanagementLogParameter.remark">
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
          <q-btn class="check_btn" flat label="確認"  @click="Finish"/>
          <q-btn class="re_btn" flat label="未修復"  @click="Report"/>
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>

<script>
export default {
  data () {
    return {
      persistent: false,
      OperatorList: [],
      isBolymin: false,
      selected_DrivermanagementLogParameter: {
        OperatorName: '',
        OperatorCode: '',
        confirm_datetime: null,
        confirm_person_name: '',
        confirm_person_id: null,
        bus_no: null,
        repair_no: '',
        item_name: null,
        repairing_parts: null,
        remark: null
      },
      preview_list: [],
      image_list: [],
      picURL_list: [],
      picName_list: []
    }
  },
  mounted () {
    this.$axios.get('/api/Repair/OperatorCodeList')// 取得客運業者列表OperatorList
      .then((response) => {
        this.OperatorList = response.data
      })
      .catch(function (error) {
        console.log(error)
      })
    // 設定權限
    const a = window.sessionStorage.getItem('Vender')
    if (a === 'Bolymin') {
      this.isBolymin = true
    }
  },
  methods: {
    cleanAll () {
      this.selected_DrivermanagementLogParameter = {
        OperatorName: '',
        OperatorCode: '',
        confirm_datetime: null,
        confirm_person_name: '',
        confirm_person_id: null,
        bus_no: null,
        repair_no: '',
        item_name: null,
        repairing_parts: null,
        remark: null
      }
      this.picURL_list = []
      this.picName_list = []
    },
    Finish () {
      this.selected_DrivermanagementLogParameter.result = true
      let picname = ''
      for (var i = 0; i < this.picName_list.length; i++) {
        if (i === 0) {
          picname = `${this.picName_list[i]}`
        } else {
          picname = `${picname}` + ',' + `${this.picName_list[i]}`
        }
      }
      this.selected_DrivermanagementLogParameter.picture_filename = picname
      this.$axios.post('/api/Repair/RepairConfirmation', this.selected_DrivermanagementLogParameter)
        .then((response) => {
          // console.log(response)
          if (response.data[0].ReturnMessage === '成功') {
            const close = document.getElementById('closs_btn')
            close.click()
            alert('確認成功，此報修單結案')
            this.$router.push('/repair-system')
          } else {
            alert('確認報修單失敗，請稍後確認填入資料正確後再嘗試')
          }
        })
        .catch(function (error) {
          console.log(error)
          alert('確認報修單失敗，請稍後確認填入資料正確後再嘗試')
        })
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
      // console.log(this.selected_DrivermanagementLogParameter)
      this.$axios.post('/api/Repair/RepairConfirmation', this.selected_DrivermanagementLogParameter)
        .then((response) => {
          // console.log(response)
          if (response.data[0].ReturnMessage === '成功') {
            const close = document.getElementById('closs_btn')
            alert('成功回報未修復，請等待維修人員再次確認')
            close.click()
            this.$router.push('/repair-system')
          } else {
            alert('確認報修單失敗，請稍後確認填入資料正確後再嘗試')
          }
        })
        .catch(function (error) {
          console.log(error)
          alert('確認報修單失敗，請稍後確認填入資料正確後再嘗試')
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
</style>
