<template>
  <div>
    <section class="bg-login">
      <Header></Header>
      <form class="form-signin" @submit.prevent="signin">
        <div class="ms-logo mb-2">
          <h1 class="m-0 navbar-brand mx-auto" href="#">Fate Grand Order</h1>
        </div>
        <label for="inputEmail">帳號</label>
        <input
          type="email"
          id="inputEmail"
          class="form-control mb-2"
          placeholder="Email address"
          required
          autofocus
          v-model="user.username"
        />
        <label for="inputPassword">密碼</label>
        <input
          type="password"
          id="inputPassword"
          class="form-control mb-2"
          placeholder="Password"
          required
          v-model="user.password"
        />
        <div class="d-flex justify-content-end">
          <button class="btn btn-lg btn-fgo" type="submit">登入</button>
        </div>
      </form>
    </section>
  </div>
</template>

<script>
import Header from "../Header";

export default {
  name: "Login",
  components: {
    Header
  },
  data(){
      return{
          user:{
              username:'',
              password:'',
          },
      };
  },
  methods:{
      signin(){
        const api =`${process.env.VUE_APP_APIPATH}/admin/signin`;
        const vm = this;
        vm.$http.post(api, vm.user).then((response) => {
        if(response.data.success){
            vm.$router.push('/admin/products');
        }
        })
      },
  },
};
</script>

<style lang="scss" scoped>

html,
body {
  height: 100%;
}

body {
  display: -ms-flexbox;
  display: flex;
  -ms-flex-align: center;
  align-items: center;
  padding-top: 40px;
  padding-bottom: 40px;
  background-color: #f5f5f5;
}

.btn-fgo {
    background-color: rgb(160, 3, 3);
      color: #ffffff;
    transition: 0.3s;
    &.active,
    &:hover {
    border: 0.5px solid rgb(160, 3, 3);
    color: rgb(160, 3, 3);
    background-color: #ffffff;
    }
  }

section.bg-login {
  background-image: url(../../assets/images/Banner/pocket.png);
  background-size: cover;
  background-repeat: no-repeat;
  background-position: center center;
  height: 100vh;
  padding-top: 130px;
  .form-signin {
    border-radius: 5px;
    background-color: rgba(255, 255, 255, 0.65);
    width: 100%;
    max-width: 330px;
    padding: 15px;
    margin: 0 auto;
    @media (min-width: 576px) {
      max-width: 500px;
      padding: 30px 30px;
    }
    @media (min-width: 768px) {
      margin-top: 48px;
    }
    .ms-logo .navbar-brand {
      display: block;
      background-image: url(../../assets/images/fgo_logo.png);
      background-size: contain;
      background-repeat: no-repeat;
      background-position: 55% center;
      background-color: rgba(245, 245, 245, 0);
      height: 120px;
      text-indent: 101%;
      overflow: hidden;
      @media (min-width: 576px) {
        height: 150px;
      }
    }
    label {
      font-weight: 800;
      letter-spacing: 1px;
    }
    .form-control {
      position: relative;
      box-sizing: border-box;
      height: auto;
      padding: 10px;
      font-size: 16px;
      &:focus {
        z-index: 2;
        box-shadow: 0 0 0;
        border: 1px solid #274878;
        outline: none;
      }
    }
    .btn {
      margin-top: 8px;
      padding-left: 22px;
      padding-right: 22px;
      @media (max-width: 575px) {
        width: 100%;
      }
    }
  }
}

</style>