<template>
    <q-dialog v-model="persistent" persistent transition-show="scale" transition-hide="scale">
      <q-card class="bg_pink" style="width: 700px; max-width: 80vw;">
        <q-card-section>
          <div class="text_big title">照片/描述</div>
          <q-btn id="closs_btn" flat v-close-popup />
        </q-card-section>

        <q-card-section class="q-pt-none row bg_pink2">
          <div class="mid row text_sm mb_20" style="margin-top:10px;">
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
              <div class="mid-card-body text_sm box">
                {{ ShowDescription }}
              </div>
            </div>
          </div>
        </q-card-section>
      </q-card>
    </q-dialog>
</template>

<script>
export default {
  data () {
    return {
      persistent: false,
      picURL_list: [],
      picName_list: [],
      ShowDescription: '請返回報修系統重新選擇報修主表',
      ShowPicture: '',
      PictureNow: 0
    }
  },
  methods: {
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
  .mid{
    position: relative;
    width: 100%;
    margin-left: 0px;
    .mid-card{
      position: relative;
      width: 100%;
      height: 245px;
      .mid-card-header{
        width: 60%;
        height: 30px;
        img{
          float: left;
          width: 30px;
          height: 30px;
        }
        .card-title{
          padding-top: 5px;
          margin-left: 35px;
        }
      }
      .mid-card-body{
        position: relative;
        width: 100%;
        height: 200px;
        display: flex;
        align-items: center;
        justify-content: center;
        overflow-y: hidden;
      }
    }
  }
  .picbtn{
    width: 35px;
    height: 40px;
    cursor: pointer;
    position: absolute;
  }
  .detail{
    .box{
      border: 1px solid black;
      align-items: flex-start !important;
      justify-content: flex-start !important;
    }
  }
  .mb_20{
    margin-bottom: 5px;
    font-weight: bold;
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
  .mid{
    position: relative;
    width: 100%;
    margin-left: 50px;
    .mid-card{
      position: relative;
      width: 90%;
      height: 370px;
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
    }
  }
  .picbtn{
    width: 45px;
    height: 45px;
    cursor: pointer;
    position: absolute;
  }
  .detail{
    .box{
      border: 1px solid black;
    }
  }
  .mb_20{
    margin-bottom: 0px;
    font-weight: bold;
  }
}
.bg_pink{
  background-color: #C791BA;
}
.bg_pink2{
  background-color: #E0CED3;
}
.photo{
  float: left;
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
  width: 100%;
  background-size: cover;
  background-position: 50% 50%;
}
</style>
