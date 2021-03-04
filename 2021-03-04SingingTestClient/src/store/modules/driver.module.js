/* eslint-disable no-shadow */
/* eslint-disable import/prefer-default-export */
import axios from 'axios';

const state = {
  drivers: null,
  driverList: null,
  driversIncludeResignation: null,
  driversWithoutResignation: null,
};

const actions = {
  getDrivers({ commit }) {
    const api = `${process.env.VUE_APP_BASE_API}/api/driver/GetList`;
    const condition = {
      emp_ID: null,
      emp_name: null,
      dept: null,
      expired: 1,
    };

    axios.post(api, condition)
      .then((response) => {
        const filterResult = response.data.Resource.filter(item => item.title === '駕駛長');
        commit('SetDrivers', filterResult);
        commit('Drivers', response.data.Resource);
      })
      .catch(error => console.log(error));
  },
  getDriversIncludeResignation({ commit }) {
    // 查詢不分在職離職員工
    const api = `${process.env.VUE_APP_BASE_API}/api/driver/GetList`;
    const condition = {
      emp_ID: null,
      emp_name: null,
      dept: null,
      expired: 0,
    };

    axios.post(api, condition)
      .then((response) => {
        const filterResult = response.data.Resource.filter(item => item.title === '駕駛長');
        commit('DriversIncludeResignation', filterResult);
      })
      .catch(error => console.log(error));
  },
  getDriversWithoutResignation({ commit }) {
    // 查詢在職員工
    const api = `${process.env.VUE_APP_BASE_API}/api/driver/GetList`;
    const condition = {
      emp_ID: null,
      emp_name: null,
      dept: null,
      expired: 1,
    };

    axios.post(api, condition)
      .then((response) => {
        const filterResult = response.data.Resource.filter(item => item.title === '駕駛長');
        commit('DriversWithoutResignation', filterResult);
      })
      .catch(error => console.log(error));
  },
};

const mutations = {
  Drivers(state, payload) {
    // 無任何處理的資料
    state.drivers = payload;
  },
  SetDrivers(state, payload) {
    // select 選單用
    const list = payload.map((item) => {
      const temp = {};
      temp.text = `${item.emp_ID} / ${item.emp_name}`;
      temp.value = item.emp_ID;
      return temp;
    });

    state.driverList = list;
  },
  DriversIncludeResignation(state, payload) {
    state.driversIncludeResignation = payload;
  },
  DriversWithoutResignation(state, payload) {
    state.driversWithoutResignation = payload;
  },
};

const getters = {
  driversRawData(state) {
    return state.drivers;
  },
  drivers(state) {
    return state.driverList;
  },
  driversIncludeResignation(state) {
    return state.driversIncludeResignation;
  },
  driversWithoutResignation(state) {
    return state.driversWithoutResignation;
  },
};

export const DriverList = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};
