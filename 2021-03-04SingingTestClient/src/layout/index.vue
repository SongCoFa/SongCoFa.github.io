<template>
  <div class="d-flex flex-column w-100 h-100">
    <HeadNav />
    <Breadcrumb :items="BreadcrumbNowAt" />
    <router-view class="d-flex flex-column flex-grow-1 overflow-auto" :key="$route.path" />
    <Footer />
  </div>
</template>

<script>
import HeadNav from '@/layout/components/HeadNav.vue';
import Breadcrumb from '@/layout/components/Breadcrumb.vue';
import Footer from '@/layout/components/Footer.vue';

import Logout from '@/layout/Logout';

export default {
  name: 'Layout',
  components: {
    HeadNav,
    Breadcrumb,
    Footer,
  },
  mounted() {
    const isCookieExist = !!this.$cookies.get('.ASPXAUTH') && !!this.$cookies.get('user-info');

    if (!isCookieExist) Logout.call(this);

    this.$store.commit('setUserInfo', this.$cookies.get('user-info'));

    window.setInterval(() => {
      this.nowTime = new Date();
    }, 1000);
  },
  computed: {
    BreadcrumbNowAt() {
      return [
        {
          text: this.$route.name,
          active: true,
        },
      ];
    },
  },
};

console.log(process.env.VUE_APP_BASE_API); // display now environment base url
</script>

<style lang="scss">
</style>
