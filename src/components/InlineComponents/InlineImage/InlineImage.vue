<template lang="pug">
  div#InlineImage
    #image(:style="{ height: desiredHeight }")
      #loading(
        v-if="loading"
      )
      img(
        ref="img"
        :class="{ hidden: loading, withPadding: padding }"
        :src="src"
        @load="handleLoad"
      )
    #subtitle(v-if="subtitle")
      p {{ subtitle }}
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  name: 'InlineImage',
})
export default class extends Vue {
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
  }) readonly padding!: boolean;

  get desiredHeight(): string {
    return this.loading
      ? '256px'
      : this.height;
  }

  mounted() {
    window.addEventListener('resize', this.setHeightFromImage);
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
