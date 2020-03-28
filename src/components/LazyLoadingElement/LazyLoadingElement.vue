<template lang="pug">
  div#LazyLoadingElement(ref="root" :style="{ height: desiredHeight }")
    #loading(
      v-if="!saveData && !loaded"
      :style="{ height: `${normalizedInitialHeight}px` }"
    )
    #loadPrompt(v-if="saveData" @click="handleLoadClick")
      span Click to load video
    #progressBar(v-if="!loaded && !saveData" ref="progressBar")
      #progress(v-if="progress" :style="{ width: progressBarWidth }")
      LoadingIndicator(v-else)
    #content(ref="content" :style="{ opacity: contentOpacity }")
      slot(v-if="saveData === false")
</template>

<script lang="ts">
import {
  Component,
  Prop,
  Watch,
  Vue,
} from 'vue-property-decorator';

import LoadingIndicator from '@/components/LoadingIndicator';

const WIDTH_BASE: number = 700;
const INITIAL_HEIGHT: number = 460;

@Component({
  name: 'LazyLoadingElement',
  components: {
    LoadingIndicator,
  },
})
export default class extends Vue {
  intersectionObserver: IntersectionObserver | null = null;

  inViewTimeoutId: number | null = null;

  height: string = `${INITIAL_HEIGHT}px`;

  width: number | null = null;

  saveData: boolean | null = null;

  @Prop({
    required: true,
    type: Boolean,
  }) readonly loaded!: boolean;

  @Prop({
    required: false,
    type: Number,
  }) readonly progress?: number;

  async mounted() {
    window.addEventListener('resize', this.updateHeight);

    window.addEventListener('resize', this.updateWidth);
    this.updateWidth();

    await this.$nextTick;
    this.observeInView();

    /*
    If the client indicates that data should be saved,
    ask the user if they want to load the video first.
    */
    this.saveData = (
      'connection' in window.navigator
      && (window.navigator as any).connection.saveData
    );
  }

  get desiredHeight(): string {
    return !this.loaded
      ? `${this.normalizedInitialHeight}px`
      : this.height;
  }

  get contentOpacity(): 1 | 0 {
    return this.loaded
      ? 1
      : 0;
  }

  get progressBarWidth(): string {
    if (!this.progress || !this.width) return '';

    const fullBarWidth = this.width - 32;
    const width = this.progress * fullBarWidth;

    return `${width}px`;
  }

  get normalizedInitialHeight(): number | null {
    if (!this.width) return null;

    const percentage = this.width / WIDTH_BASE;
    return percentage * INITIAL_HEIGHT;
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
          this.$emit(e[0].isIntersecting ? 'inView' : 'outsideView');
          this.inViewTimeoutId = null;
        }, 300);
      }
    }, {
      root: null,
    });

    this.intersectionObserver.observe(this.$refs.root as HTMLDivElement);
  }

  updateWidth() {
    this.width = (this.$refs.root as HTMLDivElement).clientWidth;
  }

  updateHeight() {
    this.height = `${(this.$refs.content as HTMLElement).offsetHeight - 2}px`;
  }

  handleLoadClick() {
    this.saveData = false;
  }

  @Watch('loaded')
  async onLoad() {
    await this.$nextTick;
    this.updateHeight();
  }
}
</script>

<style scoped lang="sass" src="./LazyLoadingElement.sass">
