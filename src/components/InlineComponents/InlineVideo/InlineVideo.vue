<template lang="pug">
  div.InlineVideo
    LazyLoadingElement(
      @inView="handleInView(true)"
      @outsideView="handleInView(false)"
      :loaded="loaded"
    )
      video(
        ref="player"
        playsinline
        @canplaythrough="handleCanPlayThrough"
        loop
        muted
        :controls="isiOS"
      )
       source(:src="`https://res.cloudinary.com/jason-e/video/upload/q_auto:good,w_2000,f_auto/${cloudinaryid}.mp4`" type="video/mp4")
    .subtitle(v-if="subtitle")
      p {{ subtitle }}
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import LazyLoadingElement from '@/components/LazyLoadingElement';

function isIOS() {
  if (/iPad|iPhone|iPod/.test(navigator.platform)) {
    return true;
  }
  return Boolean(navigator.maxTouchPoints
    && navigator.maxTouchPoints > 2
    && /MacIntel/.test(navigator.platform));
}


@Component({
  name: 'InlineVideo',
  components: {
    LazyLoadingElement,
  },
})
export default class extends Vue {
  loaded: boolean = false;

  isInView: boolean = false;

  isiOS: boolean = isIOS();

  @Prop({
    required: true,
    type: String,
  }) readonly cloudinaryid!: string;

  @Prop({
    required: false,
    type: String,
  }) readonly subtitle?: string;

  handleInView(isInView: boolean) {
    const player = this.$refs.player as HTMLMediaElement;

    if (isInView) {
      this.isInView = true;
      if (this.loaded) {
        player.play();
      } else if (this.isiOS) {
        /*
        Remove the lazy loading overlay on iOS when in view so that the user can
        tap the video and actually cause it to be loaded.
        */
        this.loaded = true;
      }
    } else {
      this.isInView = false;
      player.pause();
    }
  }

  handleCanPlayThrough() {
    const player = this.$refs.player as HTMLMediaElement;

    this.loaded = true;

    if (this.isInView) {
      player.play();
    }
  }
}
</script>

<style scoped lang="sass" src="./InlineVideo.sass">
