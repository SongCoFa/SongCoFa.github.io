<template>
  <div>
    <!-- Header -->
    <Header></Header>

    <!-- Alert Message -->
    <AlertMessage></AlertMessage>

    <!-- 各頁面內容 -->
    <main>
      <router-view></router-view>
    </main>

    <!-- 懸浮購物車 -->
    <Cart class="d-none d-sm-block"></Cart>

    <!-- Footer -->
    <!-- <Footer></Footer> -->
  </div>
</template>

<script>
import Header from "./Header";
// import Footer from "./Footer";
import Cart from "./Cart";
import AlertMessage from "./AlertMessage";
export default {
  components: {
    Header,
    // Footer,
    Cart,
    AlertMessage
  },
};
</script>

<style lang="scss">
main {
  margin-top: 65px;
  overflow: hidden;
  font-family: 'Noto Sans SC', sans-serif;
}
.text-fgo{
  font-size: 25px;
  color:rgb(31, 29, 29);
}
</style>