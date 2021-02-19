// import Vue from 'vue'
import axios from 'axios'

export default ({ app, router, store, Vue }) => {
  axios.defaults.baseURL = process.env.API_URL // 從env取得API的網址
  axios.interceptors.request.use((config) => {
    return config
  })
  Vue.prototype.$axios = axios
}
