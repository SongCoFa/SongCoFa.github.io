<template>
    <q-dialog v-model="persistent" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg_pink" style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <div class="text_big title">編輯報修單</div>
          <q-btn id="closs_btn" flat @click="cleanAll" v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-none row bg_pink2">
          <div class="row w-100 text_sm mb_20" style="margin-top:10px;">
            <div class="col">
              <span>
                表單編號：
              </span>
              <div class="form-group input-group">
                <input class="form-control w-100" type="text" v-model="selected_DrivermanagementLogParameter.repair_no" disabled>
              </div>
            </div>
            <div class="col">
              <span>
                客運業者：
              </span>
              <div class="form-group input-group">
                <select class="form-control w-100" v-model="selected_DrivermanagementLogParameter.OperatorCode" disabled>
                    <option value="" disabled>請選擇客運業者</option>
                    <option v-for="item in OperatorList" :value="item.OperatorCode" :key='item.OperatorName'>{{item.OperatorName}}</option>
                </select>
              </div>
            </div>
          </div>
          <div class="row w-100 text_sm mb_20">
            <div class="col">
              <span>
                報修人員：
              </span>
              <div class="form-group input-group">
                <input class="form-control w-100" type="text" v-model="selected_DrivermanagementLogParameter.initiator_name" disabled>
              </div>
            </div>
            <div class="col">
              <span>
                報修人員聯絡電話：
              </span>
              <div class="form-group input-group">
                <input class="form-control w-100" type="text" placeholder="請輸入報修人員聯絡電話" v-model="selected_DrivermanagementLogParameter.initiator_tel">
              </div>
            </div>
          </div>
          <div class="row w-100 text_sm mb_20">
            <div class="col">
              <span>
                報修項目：
              </span>
              <div class="must" v-if="selected_DrivermanagementLogParameter.item === ''">(*必填)</div>
              <div class="form-group input-group">
                <select class="form-control w-100" :class="{mustborder: selected_DrivermanagementLogParameter.item === ''}" v-model="selected_DrivermanagementLogParameter.item">
                    <option value="" disabled>請選擇報修項目</option>
                    <option v-for="item in ItemList" :value="item.item" :key='item.name'>{{item.name}}</option>
                </select>
              </div>
            </div>
            <div class="col">
              <span>
                車號：
              </span>
              <div class="must" v-if="selected_DrivermanagementLogParameter.bus_no === ''">(*必填)</div>
              <div class="form-group input-group">
                <input class="form-control w-100" :class="{mustborder: selected_DrivermanagementLogParameter.bus_no === ''}" type="text" placeholder="請輸入車號" v-model.trim="selected_DrivermanagementLogParameter.bus_no">
              </div>
            </div>
          </div>
          <div class="row w-100 text_sm mb_20">
            <div class="col">
              <span>
                司機姓名：
              </span>
              <div class="form-group input-group">
                <input class="form-control w-100" type="text" placeholder="請輸入司機姓名" v-model="selected_DrivermanagementLogParameter.driver_name">
              </div>
            </div>
            <div class="col">
              <span>
                司機聯絡電話：
              </span>
              <div class="form-group input-group">
                <input class="form-control w-100" type="text" placeholder="請輸入司機聯絡電話" v-model="selected_DrivermanagementLogParameter.driver_tel">
              </div>
            </div>
          </div>
          <div class="row w-100 text_sm mb_20">
            <div class="col">
              <span>
                問題摘要：
              </span>
              <div class="form-group input-group">
                <input class="form-control w-100" type="text" placeholder="請輸入問題摘要" v-model="selected_DrivermanagementLogParameter.summary">
              </div>
            </div>
            <div class="col">
              <span>
                問題描述：
              </span>
              <div class="form-group input-group">
                <input class="form-control w-100" type="text" placeholder="請輸入問題描述" v-model="selected_DrivermanagementLogParameter.description">
              </div>
            </div>
          </div>
          <div class="row w-100 text_sm mb_20">
            <div class="col">
              <span>
                上傳照片：
              </span>
              <div class="form-group input-group">
                <input type="file" accept="image/*" multiple="multiple" @change="previewMultiImage" class="form-control-file" id="my-file">
              </div>
            </div>
          </div>
          <div class="row w-100 text_sm mb_20">
            <div class="col" v-if="picName_list[0] !== ''">
              <div>
                照片預覽：上傳數量{{picURL_list.length}}
              </div>
              <div class="w-100" v-for="(item, index) in picURL_list" :key="index">
                <q-btn class="pic_btn" flat @click="cleanPic(index)"/>
                <p class="mb-0">名稱: {{ picName_list[index] }}</p>
                <img :src="item" class="img-fluid w-100" />
                <!-- <p>size: {{ image_list[index].size/1024 }}KB</p> -->
              </div>
            </div>
          </div>
        </q-card-section>

        <q-card-actions align="center" class="text-teal" style="height:60px;">
          <q-btn class="check_btn" flat label="確認" @click="Add" />
        </q-card-actions>
      </q-card>
    </q-dialog>
</template>

<script>
export default {
  data () {
    return {
      persistent: false,
      repair_no: '',
      selected_DrivermanagementLogParameter: {
        OperatorCode: '',
        initiator_tel: null,
        initiator_id: '',
        initiator_name: '',
        driver_tel: null,
        driver_id: null,
        driver_name: null,
        bus_no: '',
        item: '',
        summary: null,
        description: null,
        start_datetime: null,
        picture_filename: null
      },
      OperatorList: [],
      ItemList: [],
      preview_list: [],
      image_list: [],
      picURL_list: [],
      picName_list: []
    }
  },
  methods: {
    Add () {
      const today = new Date()
      const timer = new Date().toLocaleTimeString('it-IT')
      this.selected_DrivermanagementLogParameter.start_datetime = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + ' ' + timer
      let picname = ''
      for (var i = 0; i < this.picName_list.length; i++) {
        if (i === 0) {
          picname = `${this.picName_list[i]}`
        } else {
          picname = `${picname}` + ',' + `${this.picName_list[i]}`
        }
      }
      this.selected_DrivermanagementLogParameter.picture_filename = picname
      const check = this.inspection(this.selected_DrivermanagementLogParameter)
      if (!check) {
        alert('必填項目不得為空')
        return false
      } else {
        const close = document.getElementById('closs_btn')
        this.$axios.put('/api/Repair/RepairMaster', this.selected_DrivermanagementLogParameter)
          .then((response) => {
          // console.log(response)
            if (response.data[0].ReturnMessage === '成功') {
              alert('編輯報修單成功')
            } else {
              alert('編輯報修單失敗，請稍後確認填入資料正確後再嘗試')
            }
          })
          .catch(function (error) {
            console.log(error)
            alert('編輯報修單失敗，請稍後確認填入資料正確後再嘗試')
          })
        close.click()
      }
    },
    cleanAll () {
      this.selected_DrivermanagementLogParameter = {
        OperatorCode: '',
        initiator_tel: null,
        initiator_id: '',
        initiator_name: '',
        driver_tel: null,
        driver_id: null,
        driver_name: null,
        bus_no: '',
        item: '',
        summary: null,
        description: null,
        start_datetime: null,
        picture_filename: null
      }
      this.picURL_list = []
      this.picName_list = []
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
      if (item.bus_no === '' || item.item === '') {
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
    margin: 0;
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
    margin: 0;
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
/* .pic_btn :hover{
  background-color: rgb(233, 27, 27);
} */
</style>
