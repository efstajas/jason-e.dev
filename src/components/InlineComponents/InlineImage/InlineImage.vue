<template lang="pug">
  div#InlineImage
    #image(:style="{ height: desiredHeight }")
      #loading(
        v-if="loading"
      )
      svg(
        height="0"
        width="0"
        v-if="refillwithforeground"
      )
        defs
          filter(:id="`recolorme-${_uid}`")
            feColorMatrix(
              type="matrix"
              :values="colorMatrix"
            )
      img(
        ref="img"
        :class="{ hidden: loading, withPadding: padding }"
        :src="src"
        :style="{ filter: `url(#recolorme-${_uid})` }"
        @load="handleLoad"
      )
    #subtitle(v-if="subtitle")
      p {{ subtitle }}
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';

import themeStore from '@/store/modules/theme/theme';

import calculateColorMatrix from './calculateColorMatrix';

@Component({
  name: 'InlineImage',
})
export default class extends Vue {
  themeModule = getModule(themeStore, this.$store);

  loading: boolean = true;

  height: string = '256px';

  @Prop({
    type: String,
    required: true,
  }) readonly src!: string;

  @Prop({
    type: String,
    required: false,
  }) readonly subtitle!: string;

  @Prop({
    type: Boolean,
    required: false,
    default: false,
  }) readonly refillwithforeground!: boolean;

  @Prop({
    type: Boolean,
    required: false,
  }) readonly padding!: boolean;

  get desiredHeight(): string {
    return this.loading
      ? '256px'
      : this.height;
  }

  get foregroundToken() {
    return this.themeModule.currentTheme.foreground;
  }

  get colorMatrixValues() {
    return calculateColorMatrix(...this.foregroundToken);
  }

  get colorMatrix() {
    return `
      0 0 0 0 ${this.colorMatrixValues.r}
      0 0 0 0 ${this.colorMatrixValues.g}
      0 0 0 0 ${this.colorMatrixValues.b}
      0 0 0 ${this.colorMatrixValues.a} 0
    `;
  }

  mounted() {
    window.addEventListener('resize', this.setHeightFromImage);
    console.log(this.colorMatrix);
  }

  destroyed() {
    window.removeEventListener('resize', this.setHeightFromImage);
  }

  handleLoad() {
    this.loading = false;
    this.setHeightFromImage();
  }

  setHeightFromImage() {
    this.height = `${(this.$refs.img as HTMLElement).offsetHeight}px`;
  }
}
</script>

<style scoped lang="sass" src="./InlineImage.sass">
