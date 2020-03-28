<template lang="pug">
  div#InlineVideo
    LazyLoadingElement(
      @inView="handleInView(true)"
      @outsideView="handleInView(false)"
      :loaded="loaded"
      :progress="progress"
    )
      video(
        ref="player"
        playsinline
        @canplaythrough="handleCanPlayThrough"
        loop
        muted
      )
       source(:src="src" type="video/mp4")
    #subtitle(v-if="subtitle")
      p {{ subtitle }}
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import LazyLoadingElement from '@/components/LazyLoadingElement';

@Component({
  name: 'InlineVideo',
  components: {
    LazyLoadingElement,
  },
})
export default class extends Vue {
  loaded: boolean = false;

  progress: number = 0;

  isInView: boolean = false;

  @Prop({
    required: true,
    type: String,
  }) readonly src!: string;

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
