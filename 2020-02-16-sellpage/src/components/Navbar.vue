<template>
  <div>
    <header class="fixed-top">
      <nav class="navbar navbar-expand-md navbar-light bg-light">
        <div class="container">
          <button
            class="navbar-toggler"
            type="button"
            data-toggle="collapse"
            data-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span class="navbar-toggler-icon"></span>
          </button>
          <div class="ms-logo">
            <h1 class="m-0">
              <router-link to="/customer_home" class="navbar_img ml-auto" href="#">Fate Grand Order</router-link>
            </h1>
          </div>
          <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ml-auto">
              <li class="nav-item">
                <span></span>
                <router-link
                  to="/admin/products"
                  class="nav-link p-3"
                  data-toggle="collapse"
                  data-target=".navbar-collapse.show"
                >
                  <i class="fas fa-box-open"></i>
                  產品列表
                </router-link>
              </li>
              <li class="nav-item">
                <span></span>
                <router-link
                  to="/admin/orders"
                  class="nav-link p-3"
                  data-toggle="collapse"
                  data-target=".navbar-collapse.show"
                >
                  <i class="fas fa-cart-arrow-down"></i>
                  訂單列表
                </router-link>
              </li>
              <li class="nav-item">
                <span></span>
                <router-link
                  to="/admin/coupons"
                  class="nav-link p-3"
                  data-toggle="collapse"
                  data-target=".navbar-collapse.show"
                >
                  <i class="fas fa-money-check-alt"></i>
                  優惠券列表
                </router-link>
              </li>
              <li class="nav-item">
                <span></span>
                <a class="nav-link p-3" href="#" @click.prevent="signout">登出</a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </header>
  </div>
</template>

<script>
export default {
  name: "Navbar",
  methods: {
    signout() {
      const vm = this;
      const api = `${process.env.VUE_APP_APIPATH}/logout`;
      vm.$http.post(api).then(response => {
        if (response.data.success) {
          vm.$router.push("/customer_home");
        }
      });
    }
  }
};
</script>

<style scoped lang="scss">
.navbar {
    background-color: rgb(239, 241, 241);
  border-bottom: 4px solid #ffffff;
  box-shadow: 0 3px 10px rgba(0, 0, 0, 0.15);
  .ms-logo {
    @media (max-width: 992px) {
      margin: 0 auto;
    }
    .navbar_img {
      background-image: url(../assets/images/fgo_logo.png);
      background-size: cover;
      width: 150px;
      height: 57.79px;
      display: block;
      text-indent: 101%;
      overflow: hidden;
    }
  }
  li.nav-item {
    float: left;
    position: relative;
    &:hover span {
      position: absolute;
      left: 50%;
      top: 50%;
      margin-left: -35%;
      width: 70%;
      height: 0px;
      box-shadow: 0 0 20px 12px rgba(150, 180, 200, 0.6);
      border-radius: 10px 6px;
      @media (max-width: 991px) {
        left: 2%;
        top: 50%;
        margin-left: 0;
        width: 95%;
      }
    }
    .nav-link {
      display: block;
      background: transparent;
      // color: #000;
      font-weight: bold;
      text-decoration: none;
      padding: 20px;
      position: relative;
      &.active,
      &:hover {
        color: #0c7fc1;
      }
    }
  }
}
</style>