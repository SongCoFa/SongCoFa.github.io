import Vue from 'vue';
import axios from 'axios';
import VueAxios from 'vue-axios';
import BootstrapVue from 'bootstrap-vue';
import { library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { far } from '@fortawesome/free-regular-svg-icons';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import VueMoment from 'vue-moment';
import VueSession from 'vue-session';
import { Icon } from 'leaflet';
import VueCookies from 'vue-cookies';
import i18n from './i18n';
import App from './App.vue';
import router from './router';
import store from './store';

import 'leaflet/dist/leaflet.css';
import '@/styles/index.scss';

// eslint-disable-next-line no-underscore-dangle
delete Icon.Default.prototype._getIconUrl;

const iconRetinaUrl = require('leaflet/dist/images/marker-icon-2x.png');
const iconUrl = require('leaflet/dist/images/marker-icon.png');
const shadowUrl = require('leaflet/dist/images/marker-shadow.png');

Icon.Default.mergeOptions({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
});


// axios 攔截器
const httpClient = axios.create();
httpClient.defaults.withCredentials = true;
httpClient.interceptors.response.use(null, (err) => {
  const { code, message } = err;
  if (code === 'ECONNABORTED' || message === 'Network Error') {
    // 請求超時
    console.warn('請求超時');
    return Promise.reject(err);
  }

  return Promise.reject(err);
});
// axios 攔截器

Vue.use(VueMoment);
Vue.use(BootstrapVue);
Vue.use(VueAxios, axios);
Vue.use(VueSession);
Vue.use(VueCookies);

library.add(
  fas,
  far,
  fab,
);

Vue.component('font-awesome-icon', FontAwesomeIcon);

Vue.config.productionTip = false;

new Vue({
  i18n,
  router,
  store,
  render: h => h(App),
}).$mount('#app');
