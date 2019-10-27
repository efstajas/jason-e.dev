import Vue from 'vue';
import Vuex from 'vuex';

import theme from './modules/theme/theme';
import projects from './modules/projects/projects';

Vue.use(Vuex);

export default new Vuex.Store({
  modules: {
    theme,
    projects,
  },
});
