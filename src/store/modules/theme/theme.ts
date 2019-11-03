import {
  Module,
  Mutation,
  VuexModule,
  Action,
} from 'vuex-module-decorators';

import { Theme } from './theme.types';

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

@Module({
  name: 'theme',
})
export default class extends VuexModule {
  isDarkMode = false;

  theme: Theme | null = null;

  get currentTheme(): Theme {
    if (this.theme) return this.theme;
    return this.isDarkMode
      ? baseThemeDark
      : baseTheme;
  }

  @Mutation
  writeTheme(theme: Theme): void {
    this.theme = theme;
  }

  @Mutation
  writeIsDarkMode(darkMode: boolean): void {
    this.isDarkMode = darkMode;
  }

  @Action
  setTheme(theme: {
    light: Theme,
    dark: Theme,
  }): void {
    this.context.commit(
      'writeTheme',
      this.isDarkMode ? theme.dark : theme.light,
    );
  }

  @Action
  setIsDarkMode(darkMode: boolean): void {
    this.context.commit('writeIsDarkMode', darkMode);
  }

  @Action
  restoreDefaultTheme(): void {
    this.context.commit('writeTheme', this.isDarkMode
      ? baseThemeDark
      : baseTheme);
  }
}
