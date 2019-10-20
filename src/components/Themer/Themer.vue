<template lang="pug">
  div#Themer(
    :style="currentThemeAsString"
  )
    slot
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';

import themeStore from '@/store/modules/theme/theme';
import { Theme, Token } from '../../store/modules/theme/theme.types';

/*
This component applies the theme currently applied in the vuex "Theme"
module to everything wrapped in it.
It converts tokens to css variables and passes them down the DOM.
*/

const makeRgbaStringFromToken = (
  token: Token,
): string => `rgba(${token[0]},${token[1]},${token[2]},${token[3]})`;

const makeVariableFromToken = (
  name: string,
  token: Token,
): string => `--${name}: ${makeRgbaStringFromToken(token)};`;

const makeVariablesFromTheme = (
  theme: Theme,
): string => {
  let result: string = '';

  Object.keys(theme).forEach((tokenName: string) => {
    result += makeVariableFromToken(tokenName, (theme as any)[tokenName]);
  });

  return result;
};

@Component({
  name: 'Themer',
})
export default class extends Vue {
  themeModule = getModule(themeStore, this.$store);

  get currentTheme(): Theme {
    return this.themeModule.currentTheme;
  }

  get currentThemeAsString(): string {
    return makeVariablesFromTheme(this.currentTheme);
  }
}
</script>

<style scoped lang="sass" src="./Themer.sass">
