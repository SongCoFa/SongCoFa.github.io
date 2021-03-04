import Vue from 'vue';
import Vuex from 'vuex';

import { DriverList } from './modules/driver.module';
import { IntermediateStations } from './modules/intermediate.module';

Vue.use(Vuex);

export default new Vuex.Store({

  strict: process.env.NODE_ENV !== 'production', // turn strict off to avoid the performance cost.

  state: {
    nowVersion: '0.00.28',
    userInfo: {
      activate_date: 'activate_date',
      annual_leave: 'annual_leave',
      birthday: 'birthday',
      dept: 'dept',
      emp_ID: 'emp_ID',
      emp_name: 'emp_name',
      profile_permission: 'profile_permission',
      salary_permission: 'salary_permission',
      schedule_permission: 'schedule_permission',
      station_no: 'station_no',
      title: 'title',
    },
  },
  mutations: {
    setUserInfo(state, playload) {
      state.userInfo = playload;
    },
  },
  actions: {

  },
  getters: {
    permissions(state) {
      return state.userInfo;
    },
  },
  modules: {
    DriverList,
    IntermediateStations,
  },
});
