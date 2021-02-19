<template>
  <q-footer elevated>
      <q-toolbar class="footer_img">
        <q-toolbar-title>
          <span
            class="mr-2"
            style="position:absolute; top:10px; left:25px;"
            v-if="nowTime != null"
          >{{nowTime}}</span>
        </q-toolbar-title>
        <div class="text_sm" style="padding-right:15px;">
          <a href="http://bolymin.com.tw/" style="padding-right:30px;"> © 2019 - {{nowYear}} - Bolymin 報修系統</a>
          <b> Version: {{$store.state.nowVersion}}</b>
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
