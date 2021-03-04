<template>
  <div class="d-flex justify-content-center align-content-center h-100">
    <form class="form-signin">
      <img img src="@/assets/images/logo.png" />
      <input
        type="text"
        class="form-control input-outline"
        v-model="user.emp_ID"
        placeholder="請輸入帳號"
        required
        autofocus
      />
      <input
        type="password"
        class="form-control input-outline"
        v-model="user.Password"
        placeholder="請輸入密碼"
        required
      />
      <button class="btn btn-lg btn-primary btn-block outline" @click="login">登入</button>
      <button class="btn btn-lg btn-primary btn-block outline" @click="Visitorlogin">訪客登入</button>
      <div class="mb-5"></div>
    </form>
  </div>
</template>

<script>
export default {
  name: 'Login',
  data() {
    return {
      user: {
        emp_ID: '',
        Password: '',
      },
      api: `${process.env.VUE_APP_BASE_API}/api/auth/signIn`,
    };
  },
  methods: {
    login() {
      // console.log(user);
      this.$http
        .post(this.api, this.user)
        .then((response) => {
          // console.log(response.data);

         if (response.status !== 200) {
            alert('伺服器回應失敗');
            return;
          }

          if (response.data.Code !== 1) {
            alert(response.data.Message);
            return;
          }
          window.sessionStorage.setItem('member', 'admin');
          this.$router.push('/');
        })
        .catch(error => console.log(error));
    },
    Visitorlogin() {
      const visitor = {
        emp_ID: 'admin',
        Password: '0000',
      };
      window.sessionStorage.setItem('member', 'visitor');
      // console.log(visitor);
      this.$http
        .post(this.api, visitor)
        .then((response) => {
          // console.log(response.data);

         if (response.status !== 200) {
            alert('伺服器回應失敗');
            return;
          }

          if (response.data.Code !== 1) {
            alert(response.data.Message);
            return;
          }

          this.$router.push('/');
        })
        .catch(error => (error));
    },
  },
};
</script>

<style lang="scss" scoped>
.form-signin {
  width: 100%;
  max-width: 330px;
  padding: 15px;
  margin: auto;
}
.form-signin .form-control {
  position: relative;
  box-sizing: border-box;
  height: auto;
  padding: 10px;
  font-size: 16px;
}
.form-signin .form-control:focus {
  z-index: 2;
}
.form-signin input[type="text"] {
  margin-bottom: -1px;
  border-bottom-right-radius: 0;
  border-bottom-left-radius: 0;
}
.form-signin input[type="password"] {
  margin-bottom: 10px;
  border-top-left-radius: 0;
  border-top-right-radius: 0;
}

.btn-outline {
  border: 1ex;
  border-color: white;
}

.input-outline {
  border: solid 1px #00a199;
}
</style>
