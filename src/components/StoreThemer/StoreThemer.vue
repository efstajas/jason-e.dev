<template lang="pug">
  div#StoreThemer
    Themer(
      :theme="this.currentTheme"
    )
      slot
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';

import themeStore from '@/store/modules/theme/theme';
import { Theme, Token } from '../../store/modules/theme/theme.types';

import Themer from '../Themer';

/*
This component applies the theme currently applied in the vuex "Theme"
module to everything wrapped in it.
*/

@Component({
  name: 'StoreThemer',
  components: {
    Themer,
  },
})
export default class extends Vue {
  themeModule = getModule(themeStore, this.$store);

  get currentTheme(): Theme {
    return this.themeModule.currentTheme;
  }
}
</script>
