// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue';
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-default/index.css';

import accounting from 'accounting';
import pluralize from 'pluralize';

import './assets/css/main.css';
import './assets/css/style.css';
import './assets/css/style_cart.css';

import store from './store';
import App from './App';
import router from './router';

Vue.use(ElementUI);
Vue.filter('pluralize', pluralize);
Vue.filter('formatMoney', accounting.formatMoney);

Vue.config.productionTip = false;

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  store,
  template: '<App/>',
  components: { App },
});
