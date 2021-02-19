import Vue from 'vue'
import Vuex from 'vuex'
// import state from './module-example/state'

// import example from './module-example'

Vue.use(Vuex)

/*
 * If not building with SSR mode, you can
 * directly export the Store instantiation;
 *
 * The function below can be async too; either use
 * async/await or return a Promise which resolves
 * with the Store instance.
 */

export default function (/* { ssrContext } */) {
  const Store = new Vuex.Store({
    state: {
      nowVersion: '0.00.03',
      repair_system: {
        selected: null
      }
    },
    modules: {
      // example
    },
    mutations: {
      SetRepairSystemSelected (state, nowselected) {
        state.repair_system.selected = nowselected
      },
      CleanRepairSystemSelected (state) {
        state.repair_system.selected = null
      }
    },

    // enable strict mode (adds overhead!)
    // for dev mode only
    strict: process.env.DEBUGGING
  })

  return Store
}
