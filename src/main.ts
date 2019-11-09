import Vue from 'vue';
import VueScrollactive from 'vue-scrollactive';

import App from './App.vue';
import router from './router';
import store from './store';

Vue.config.productionTip = false;
Vue.use(VueScrollactive);

new Vue({
  router,
  store,
  render: h => h(App),
}).$mount('#app');
