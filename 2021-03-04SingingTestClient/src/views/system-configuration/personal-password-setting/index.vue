<template>
  <b-card>
    <b-form-group label="請輸入舊密碼">
      <b-form-input trim type="password" v-model="oldPassword" :state="oldPasswordState"></b-form-input>
    </b-form-group>
    <b-form-group label="請輸入新密碼">
      <b-form-input trim type="password" v-model="newPassword" :state="newPasswordState"></b-form-input>
    </b-form-group>
    <b-form-group label="請再次輸入新密碼">
      <b-form-input trim type="password" v-model="checkNewPassword" :state="checkNewPasswordState"></b-form-input>
    </b-form-group>
    <b-button href="#" variant="primary" @click="handleOK">變更</b-button>
  </b-card>
</template>

<script>
import Logout from '@/layout/Logout';

export default {
  components: {
  },
  data() {
    return {
      oldPassword: '',
      newPassword: '',
      checkNewPassword: '',
    };
  },
  computed: {
    oldPasswordState() {
      return this.oldPassword !== '';
    },
    newPasswordState() {
      return this.newPassword !== '' && this.newPassword === this.checkNewPassword;
    },
    checkNewPasswordState() {
      return this.checkNewPassword !== '' && this.newPassword === this.checkNewPassword;
    },
    // check() {
    //   if (this.oldPassword !== '' && this.newPassword !== '' && this.checkNewPassword !== '' && this.newPassword === this.checkNewPassword) {
    //     return false;
    //   }

    //   return true;
    // },
  },
  methods: {
    handleOK() {
      if (this.oldPassword === '' || this.newPassword === '' || this.checkNewPassword === '' || this.newPassword !== this.checkNewPassword) {
        alert('請檢查不符格式資料');
        return;
      }

      const value = this.$cookies.get('user-info');

      const send = [{
        emp_ID: value.emp_ID,
        password_old: this.oldPassword,
        password_new: this.newPassword,
      }];

      console.log(send);

      this.$http.post(`${process.env.VUE_APP_BASE_API}/api/basic-data/ChangePassword`, send)
        .then((response) => {
          console.log(response);
          if (response.data.Resource && response.data.Resource.ReturnMessage === '密碼不正確') {
            alert('密碼不正確');
          } else {
            Logout.call(this);
          }
        })
        .catch(e => console.log(e));
    },
  },
};
</script>
