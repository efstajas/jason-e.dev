<!-- TODO: Refactor using "LazyLoadingElement" component -->

<template lang="pug">
  div.InlineImage(ref="root")
    .image(:style="{ height: desiredHeight, backgroundColor: background }")
      .loading(
        v-if="loading"
        :style="{ height: `${normalizedInitialHeight}px` }"
      )
      svg(
        height="0"
        width="0"
        v-if="refillwithforeground"
      )
        defs
          filter(:id="`recolorme-${_uid}`")
            feColorMatrix(
              color-interpolation-filters="sRGB"
              type="matrix"
              :values="colorMatrix"
            )
      img(
        v-if="inView || (loading === false)"
        ref="img"
        :class="{ hidden: loading, withPadding: padding }"
        :src="`https://res.cloudinary.com/jason-e/image/upload/f_auto,q_auto,w_2000/${cloudinaryid}`"
        :style="{ filter: refillwithforeground ? `url(#recolorme-${_uid})` : null }"
        @load="handleLoad"
      )
    .subtitle(v-if="subtitle")
      p {{ subtitle }}
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';

import themeStore from '@/store/modules/theme/theme';

import calculateColorMatrix from './calculateColorMatrix';
import { Theme } from '../../../store/modules/theme/theme.types';

const WIDTH_BASE: number = 700;
const INITIAL_HEIGHT: number = 460;

@Component({
  name: 'InlineImage',
})
export default class extends Vue {
  themeModule = getModule(themeStore, this.$store);

  loading: boolean = true;

  width: number | null = null;

  height: string = `${INITIAL_HEIGHT}px`;

  intersectionObserver: IntersectionObserver | null = null;

  inView: boolean = false;

  inViewTimeoutId: number | null = null;

  @Prop({
    type: String,
    required: true,
  }) readonly cloudinaryid!: string;

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

  get normalizedInitialHeight(): number | null {
    if (!this.width) return null;

    const percentage = this.width / WIDTH_BASE;
    return percentage * INITIAL_HEIGHT;
  }

  get desiredHeight(): string {
    return this.loading
      ? `${this.normalizedInitialHeight}px`
      : this.height;
  }

  get foregroundToken() {
    return this.themeModule.currentTheme.foreground;
  }

  get colorMatrixValues() {
    return calculateColorMatrix(...this.foregroundToken);
  }

  get background() {
    if (!this.forcedbackground || this.loading) return '';

    const token = this.themeModule.currentTheme[this.forcedbackground as keyof Theme];
    let color = '';

    if (token) {
      color = `rgba(${token[0]}, ${token[1]}, ${token[2]}, ${token[3]}`;
    } else {
      color = this.forcedbackground;
    }

    return color;
  }

  get colorMatrix() {
    return `0 0 0 0 ${this.colorMatrixValues.r}
      0 0 0 0 ${this.colorMatrixValues.g}
      0 0 0 0 ${this.colorMatrixValues.b}
      0 0 0 ${this.colorMatrixValues.a} 0
    `.replace(/\s\s+/g, ' ').trim();
  }

  async mounted() {
    window.addEventListener('resize', () => {
      this.updateHeight();
      this.updateWidth();
    });

    this.updateWidth();

    await this.$nextTick;
    this.observeInView();
  }

  destroyed() {
    window.removeEventListener('resize', () => {
      this.updateHeight();
      this.updateWidth();
    });

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
    this.updateHeight();
  }

  updateWidth() {
    this.width = (this.$refs.root as HTMLDivElement).clientWidth;
  }

  updateHeight() {
    this.height = `${(this.$refs.img as HTMLElement).offsetHeight}px`;
  }
}
</script>

<style scoped lang="sass" src="./InlineImage.sass">
