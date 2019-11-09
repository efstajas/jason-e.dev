import {
  Module,
  Mutation,
  VuexModule,
  Action,
} from 'vuex-module-decorators';

import { Theme, ThemePair } from './theme.types';

const baseTheme = {
  background: [255, 255, 255, 1],
  level1: [0, 0, 0, 0.2],
  level2: [0, 0, 0, 0.5],
  level3: [0, 0, 0, 0.7],
  foreground: [0, 0, 0, 1],
  highlight: [255, 0, 0, 1],
} as Theme;

const baseThemeDark = {
  background: [0, 0, 0, 1],
  level1: [255, 255, 255, 0.2],
  level2: [255, 255, 255, 0.5],
  level3: [255, 255, 255, 0.7],
  foreground: [255, 255, 255, 1],
  highlight: [255, 0, 0, 1],
} as Theme;

const defaultTheme = {
  light: baseTheme,
  dark: baseThemeDark,
} as ThemePair;

@Module({
  name: 'theme',
})
export default class extends VuexModule {
  isDarkMode = false;

  theme: ThemePair | null = null;

  get currentTheme(): Theme {
    if (this.theme) {
      return this.isDarkMode
        ? this.theme.dark
        : this.theme.light;
    }
    return this.isDarkMode
      ? defaultTheme.dark
      : defaultTheme.light;
  }

  @Mutation
  writeTheme(theme: ThemePair): void {
    this.theme = theme;
  }

  @Mutation
  writeIsDarkMode(darkMode: boolean): void {
    this.isDarkMode = darkMode;
  }

  @Action
  setTheme(theme: ThemePair): void {
    this.context.commit(
      'writeTheme',
      theme,
    );
  }

  @Action
  setIsDarkMode(darkMode: boolean): void {
    this.context.commit('writeIsDarkMode', darkMode);
  }

  @Action
  restoreDefaultTheme(): void {
    this.context.commit('writeTheme', defaultTheme);
  }
}
