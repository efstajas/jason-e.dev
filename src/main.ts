import Vue from 'vue';
import VueScrollactive from 'vue-scrollactive';
import VueMeta from 'vue-meta';

import App from './App.vue';
import router from './router';
import store from './store';
import './registerServiceWorker';

Vue.config.productionTip = false;
Vue.use(VueScrollactive);
Vue.use(VueMeta);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
