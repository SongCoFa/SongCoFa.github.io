<template>
  <b-navbar class="HeadNav">
    <router-link to="/">
      <img src="@/assets/images/logo.png" />
    </router-link>
    <div v-if="userInfo" class="ml-auto">
      <b-row class="d-flex justify-content-end">
        <div class="m-2">
          <span
            class="mr-2 text-style font-weight-bold"
            v-if="nowTime != null"
          >{{ nowTime | moment("YYYY-MM-DD HH:mm:ss")}}</span>
          <span
            class="text-style font-weight-bold"
            v-if="userInfo"
          >您好：({{ userInfo.emp_ID }}){{ userInfo.emp_name }}</span>
        </div>
      </b-row>

      <b-row>
        <b-navbar-nav class="ml-auto">
          <b-dropdown
            v-if="PermissionParse(userInfo.profile_permission)"
            variant="primary"
            no-caret
            text="基本資料管理"
            right
            class="m-2"
          >
            <b-dropdown-item class="hover-dropdown-item" to="/profile-management/driver">駕駛長資料管理</b-dropdown-item>
            <b-dropdown-item class="hover-dropdown-item" to="/profile-management/vehicle">車輛資料管理</b-dropdown-item>
            <b-dropdown-item class="hover-dropdown-item" to="/profile-management/route">路線資料管理</b-dropdown-item>
            <b-dropdown-item class="hover-dropdown-item" to="/profile-management/driver-leave">駕駛長休假資料管理</b-dropdown-item>
            <b-dropdown-item class="hover-dropdown-item" to="/profile-management/national-holiday">國定假日資料管理</b-dropdown-item>
            <b-dropdown-item class="hover-dropdown-item" to="/profile-management/special-date">特殊日期資料管理</b-dropdown-item>
          </b-dropdown>

          <b-dropdown
            v-if="PermissionParse(userInfo.schedule_permission)"
            variant="primary"
            no-caret
            text="排班系統"
            right
            class="m-2"
          >
            <b-dropdown-item class="hover-dropdown-item" to="/schedule-management/career">仕業管理</b-dropdown-item>
            <b-dropdown-item
              class="hover-dropdown-item"
              to="/schedule-management/general-schedule"
            >總班表管理</b-dropdown-item>
            <b-dropdown-item class="hover-dropdown-item" to="/schedule-management/schedule">班表管理</b-dropdown-item>
            <b-dropdown-item
              class="hover-dropdown-item"
              to="/schedule-management/schedule-query"
            >排班資料查詢</b-dropdown-item>
            <b-dropdown-item class="hover-dropdown-item" to="/schedule-management/working-hours">駕駛工時管理</b-dropdown-item>
            <b-dropdown-item class="hover-dropdown-item" to="/schedule-management/distance-adjust">里程調整</b-dropdown-item>
            <b-dropdown-item
              class="hover-dropdown-item"
              to="/schedule-management/schedule-related-reports"
            >排班相關報表</b-dropdown-item>
          </b-dropdown>

          <b-dropdown
            v-if="PermissionParse(userInfo.salary_permission)"
            variant="primary"
            no-caret
            text="薪資系統"
            right
            class="m-2"
          >
            <b-dropdown-item
              class="hover-dropdown-item"
              to="/salary-management/basic-salary-parameter"
            >基本薪資參數管理</b-dropdown-item>
            <b-dropdown-item class="hover-dropdown-item" to="/salary-management/payroll">薪津表管理</b-dropdown-item>
            <b-dropdown-item class="hover-dropdown-item" to="/salary-management/payroll-query">薪津表列印</b-dropdown-item>
            <b-dropdown-item
              class="hover-dropdown-item"
              to="/salary-management/salary-statement"
            >薪資報表</b-dropdown-item>
          </b-dropdown>

          <b-dropdown variant="primary" no-caret text="系統設定" right class="m-2">
            <b-dropdown-item
              class="hover-dropdown-item"
              to="/system-configuration/personal-password-setting"
            >個人密碼設定</b-dropdown-item>
            <b-dropdown-item
              v-if="isAdmin(userInfo)"
              class="hover-dropdown-item"
              to="/system-configuration/account-management"
            >帳號管理</b-dropdown-item>
            <b-dropdown-item
              v-if="isAdmin(userInfo)"
              class="hover-dropdown-item"
              to="/system-configuration/transfer-voucher"
            >手動轉班表</b-dropdown-item>
            <b-dropdown-item
              v-if="isAdmin(userInfo)"
              class="hover-dropdown-item"
              to="/system-configuration/operation-record-query"
            >操作紀錄查詢</b-dropdown-item>
            <b-dropdown-item class="hover-dropdown-item" @click="SignOut()">登出</b-dropdown-item>
          </b-dropdown>
        </b-navbar-nav>
      </b-row>
    </div>
  </b-navbar>
</template>

<script>
import { mapState } from 'vuex';
import Logout from '@/layout/Logout';

export default {
  name: 'HeadNav',
  data() {
    return {
      nowTime: null,
    };
  },
  mounted() {
    window.setInterval(() => {
      this.nowTime = new Date();
    }, 1000);
  },
  computed: {
    ...mapState(['userInfo']),
    routes() {
      return this.$router.options.routes;
    },
  },
  methods: {
    PermissionParse(permission) {
      const ForbidPermission = 'X';
      return permission !== ForbidPermission;
    },
    isAdmin(userInfo) {
      return userInfo.emp_ID === 'admin' && userInfo.title === '系統管理者';
    },
    SignOut() {
      Logout.call(this);
    },
  },
};
</script>

<style lang="scss" scoped>
.HeadNav {
  border-bottom: 1px #194c28 solid;
  box-shadow: 0px 0px 20px rgba(22, 76, 40, 0.2);
}

.text-style {
  color: #1c4a9d;
}

.hover-dropdown-item {
  :hover {
    color: white;
    background-color: #0dac67;
  }
}
</style>
