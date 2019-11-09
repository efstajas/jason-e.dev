import {
  Module,
  Mutation,
  VuexModule,
  Action,
} from 'vuex-module-decorators';
import { Chapter } from './subChapters.types';

@Module({
  name: 'SubChapters',
})
export default class extends VuexModule {
  chapters: Chapter[] | null = null;

  get currentChapters(): Chapter[] | null {
    return this.chapters;
  }

  @Mutation
  writeChapters(chapters: Chapter[]): void {
    this.chapters = chapters;
  }

  @Action
  setChapters(chapters: Chapter[]): void {
    this.context.commit('writeChapters', chapters);
  }

  @Action
  clearChapters(): void {
    this.context.commit('writeChapters', []);
  }
}
