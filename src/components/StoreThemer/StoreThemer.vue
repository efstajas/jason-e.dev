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
import { Theme, Token } from '@/store/modules/theme/theme.types';

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

  // Keeps store module updated about dark mode. This a very awkward place to do this.
  // Need to find a better solution.
  mounted() {
    const media = window.matchMedia('(prefers-color-scheme: dark)');

    this.themeModule.setIsDarkMode(media.matches);

    media.addListener(() => {
      this.themeModule.setIsDarkMode(media.matches);
    });
  }

  get currentTheme(): Theme {
    return this.themeModule.currentTheme;
  }
}
</script>
