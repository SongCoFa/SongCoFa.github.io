<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar
        class="header_img"
      >

        <q-toolbar-title>
          <a  href="http://www.fmsbolymin.com.tw/"><img src="../assets/ICON/Logo.png" class="logo_img" /></a>
          <img src="../assets/ICON/User.png" class="user_img" />
          <div class="user_title text_big" style="cursor: pointer; color:#E3D0E6;">[{{User.id}}]{{User.name}}</div>
        </q-toolbar-title>

        <div class="gt-xs">
          <img src="../assets/ICON/System.png" class="icon_img" style="position:absolute; right:140px; top:0;" />
          <div class="tittle_nav text_big" @click="gotoRepairSystem" style="cursor: pointer; color:#E3D0E6;">報修系統</div>
        </div>
        <div class="lt-sm">
          <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="rightDrawerOpen = !rightDrawerOpen"
        />
        </div>
      </q-toolbar>
    </q-header>

    <Footer />

    <q-drawer
      v-model="rightDrawerOpen"
      side="right"
      content-class="bg-grey-10"
    >
      <q-list>
        <q-item-label
          header
          class="text-grey-8"
        >
          系統連結
        </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
          target="_self"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script>
import EssentialLink from 'components/EssentialLink.vue'
import Footer from 'layouts/components/Footer.vue'

const linksData = [
  {
    title: '報修系統',
    icon: 'plagiarism',
    link: 'http://www.fmsbolymin.com.tw:8813/repair/#/repair-system'
  }
]

export default {
  name: 'MainLayout',
  components: {
    EssentialLink,
    Footer
  },
  data () {
    return {
      rightDrawerOpen: false,
      essentialLinks: linksData,
      User: {
        id: '90001',
        name: '測試員'
      }
    }
  },
  mounted () {
    this.User.id = window.sessionStorage.getItem('Number')
    this.User.name = window.sessionStorage.getItem('Name')
    if (this.User.name === null) {
      this.User.id = '尚未登入'
    }
  },
  methods: {
    gotoRepairSystem () {
      this.$router.push('/repair-system')
    }
  }
}
</script>

<style lang="scss" scoped>
   @media (max-width: 500px){
    .logo_img{
      width: 110px;
      height: 30px;
      margin-top: 5px;
      margin-left: 5px;
    }
    .user_img{
      width: 30px;
      height: 30px;
      margin-top: 5px;
      margin-left: 5px;
    }
    .user_title{
      position: absolute;
      text-align: center;
      font-weight: bold;
      width: 104px;
      height: 30px;
      top: 10px;
      left: 152px;
    }
  }
  @media (min-width: 501px){
    .logo_img{
      width: 165px;
      height: 45px;
      margin-top: 5px;
      margin-left: 10px;
    }
    .user_img{
      width: 45px;
      height: 45px;
      margin-top: 5px;
      margin-left: 20px;
    }
    .user_title{
      position: absolute;
      text-align: center;
      font-weight: bold;
      width: 104px;
      height: 45px;
      top: 10px;
      left: 260px;
    }
  }
  a{
    cursor: pointer;
    text-decoration: none;
  }
  a:visited{
    color: white;
  }
  .header_img{
    background-image: url(../assets/ICON/Header.png);
    position: absolute;
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
  }
  .tittle_nav{
    position: absolute;
    text-align: center;
    font-weight: bold;
    width: 104px;
    height: 45px;
    top: 10px;
    right: 30px;
  }
  .icon_img{
    width: 45px;
    height: 45px;
    margin-top: 5px;
  }
</style>
