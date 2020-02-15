import {
  Module,
  Mutation,
  VuexModule,
  Action,
} from 'vuex-module-decorators';

@Module({
  name: 'loading',
})
export default class extends VuexModule {
  loading: boolean = true;

  get isLoading(): boolean {
    return this.loading;
  }

  @Mutation
  writeLoadingWithTimeout(value: boolean): void {
    setTimeout(() => {
      this.loading = value;
    }, 500);
  }

  @Mutation
  writeLoading(value: boolean): void {
    this.loading = value;
  }

  @Action
  setLoading(value: boolean): void {
    this.context.commit('writeLoading', value);
  }
}
