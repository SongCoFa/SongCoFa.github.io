/* eslint-disable no-shadow */
/* eslint-disable import/prefer-default-export */
import axios from 'axios';

const state = {
  intermediateStationsList: null,
};

const actions = {
  getStations({ commit }, payload) {
    const api = `${process.env.VUE_APP_BASE_API}/api/route/GetStopList`;

    const condition = {
      SubRouteUID: payload.id,
      Direction: payload.direction,
    };

    axios.post(api, condition)
      .then((response) => {
        commit('SetStationsList', response.data.Resource);
      })
      .catch(e => console.log(e));
  },
};

const mutations = {
  SetStationsList(state, payload) {
    state.intermediateStationsList = payload;
  },
};

const getters = {
  intermediateStations(state) {
    return state.intermediateStationsList;
  },
};

export const IntermediateStations = {
  namespaced: true,
  state,
  actions,
  mutations,
  getters,
};
