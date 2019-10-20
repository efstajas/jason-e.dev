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

@Module({
  name: 'theme',
})
export default class MyModule extends VuexModule {
  theme: Theme = baseTheme;

  get currentTheme(): Theme {
    return this.theme;
  }

  @Mutation
  writeTheme(theme: Theme): void {
    this.theme = theme;
  }

  @Action
  setTheme(theme: Theme): void {
    this.context.commit('writeTheme', theme);
  }

  @Action
  restoreDefaultTheme(): void {
    this.context.commit('writeTheme', baseTheme);
  }
}
