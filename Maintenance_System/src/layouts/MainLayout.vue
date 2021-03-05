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
          Essential Links
        </q-item-label>
        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
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
    title: 'Docs',
    caption: 'quasar.dev',
    icon: 'school',
    link: 'https://quasar.dev'
  },
  {
    title: 'Github',
    caption: 'github.com/quasarframework',
    icon: 'code',
    link: 'https://github.com/quasarframework'
  },
  {
    title: 'Discord Chat Channel',
    caption: 'chat.quasar.dev',
    icon: 'chat',
    link: 'https://chat.quasar.dev'
  },
  {
    title: 'Forum',
    caption: 'forum.quasar.dev',
    icon: 'record_voice_over',
    link: 'https://forum.quasar.dev'
  },
  {
    title: 'Twitter',
    caption: '@quasarframework',
    icon: 'rss_feed',
    link: 'https://twitter.quasar.dev'
  },
  {
    title: 'Facebook',
    caption: '@QuasarFramework',
    icon: 'public',
    link: 'https://facebook.quasar.dev'
  },
  {
    title: 'Quasar Awesome',
    caption: 'Community Quasar projects',
    icon: 'favorite',
    link: 'https://awesome.quasar.dev'
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
