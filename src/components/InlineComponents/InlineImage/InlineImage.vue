<template lang="pug">
  div#InlineImage(ref="root")
    #image(:style="{ height: desiredHeight, backgroundColor: forcedbackground }")
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
        v-if="inView"
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

  intersectionObserver: IntersectionObserver | null = null;

  inView: boolean = false;

  inViewTimeoutId: number | null = null;

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
  }) readonly padding?: boolean;

  @Prop({
    type: String,
    required: false,
  }) readonly forcedbackground?: string;

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

  async mounted() {
    window.addEventListener('resize', this.setHeightFromImage);

    await this.$nextTick;
    this.observeInView();
  }

  destroyed() {
    window.removeEventListener('resize', this.setHeightFromImage);
    if (this.intersectionObserver) this.intersectionObserver.disconnect();
  }

  observeInView() {
    this.intersectionObserver = new IntersectionObserver((e) => {
      /*
      Debouncing mechanism so that using the sidebar to jump to a specific
      section doesn't trigger all images in between to load.
      */
      if (this.inViewTimeoutId && e[0].isIntersecting === false) {
        clearTimeout(this.inViewTimeoutId);
        this.inViewTimeoutId = null;
      } else {
        this.inViewTimeoutId = setTimeout(() => {
          this.inView = e[0].isIntersecting;
          this.inViewTimeoutId = null;
        }, 300);
      }
    }, {
      root: null,
    });

    this.intersectionObserver.observe(this.$refs.root as HTMLDivElement);
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
