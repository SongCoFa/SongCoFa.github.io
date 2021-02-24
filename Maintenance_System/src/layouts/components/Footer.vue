<template>
  <q-footer elevated>
      <q-toolbar class="footer_img">
        <q-toolbar-title>
          <span
            class="mr-2 timer"
            v-if="nowTime != null"
          >{{nowTime}}</span>
        </q-toolbar-title>
        <div class="text_sm versionbox">
          <a href="http://bolymin.com.tw/" class="year"> © 2019 - {{nowYear}} - Bolymin 報修系統</a>
          <b class="version"> Version: {{$store.state.nowVersion}}</b>
        </div>
      </q-toolbar>
    </q-footer>
</template>

<script>
export default {
  data () {
    return {
      nowTime: null
    }
  },
  mounted () {
    window.setInterval(() => {
      const today = new Date()
      const timer = new Date().toLocaleTimeString('it-IT')
      this.nowTime = today.getFullYear() + '-' + (today.getMonth() + 1) + '-' + today.getDate() + 'T ' + timer
    }, 1000)
  },
  computed: {
    nowYear () {
      return new Date().getFullYear()
    }
  }
}
</script>

<style lang="scss" scoped>
  @media (max-width: 500px){
    .timer{
      position: absolute;
      top:3px;
      left:10px;
      font-size: 15px;
    }
    .versionbox{
      padding-right: 15px;
      text-align: right;
    }
    .year{
      position: absolute;
      width: 225px;
      bottom: 2px;
      left: 9px;
    }
    .version{
      position: absolute;
      width: 150px;
      top:3px;
      right: 15px;
    }
  }
  @media (min-width: 501px) and (max-width: 755px){
    .timer{
      position: absolute;
      top:3px;
      left:15px;
      font-size: 22px;
    }
    .versionbox{
      padding-right: 15px;
    }
    .year{
      position: absolute;
      width: 230px;
      bottom: 2px;
      right: 15px;
      font-size: 15px;
    }
    .version{
      position: absolute;
      width: 118px;
      top:3px;
      right: 15px;
      font-size: 15px;
    }
  }
  @media (min-width: 756px){
    .timer{
      position: absolute;
      top:10px;
      left: 25px;
    }
    .versionbox{
      position: relative;
      padding-right: 15px;
    }
    .year{
      padding-right: 30px;
    }
  }
  a{
    cursor: pointer;
    text-decoration: none;
  }
  a:visited{
    color: white;
  }
  .footer_img{
    background-image: url(../../assets/ICON/Footer.png);
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
  }
</style>
