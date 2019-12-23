<template lang="pug">
  #InlineLink(
    @mouseover="handleHover(true)"
    @mouseleave="handleHover(false)"
    :class="{ hovering: hovering }"
  )
    a(:href="to")
      slot
    #ownLine
    #line(
      :style="`width: calc(100% + ${lineLength}px)`"
    )
    a#to(:href="to" :style="`left: ${linkOffset}px`" ref="link") {{ url.host }}
    a#fullLink(:href="to" :style="`left: ${fullUrlOffset}px`") {{ url.pathname }}
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  name: 'InlineLink',
})
export default class extends Vue {
  parentWidth: number | null = null;

  parentX: number | null = null;

  ownWidth: number | null = null;

  ownX: number | null = null;

  lineLength: number | null = null;

  linkOffset: number | null = null;

  linkWidth: number | null = null;

  fullUrlOffset: number | null = null;

  hovering: boolean = false;

  @Prop({
    required: true,
    type: String,
  }) readonly to!: string;

  async mounted() {
    await this.$nextTick();
    this.calculateLineLength();

    window.addEventListener('resize', this.calculateLineLength);
  }

  get url() {
    return new URL(this.to);
  }

  async calculateLineLength() {
    await this.$nextTick();

    this.parentWidth = this.$parent.$el.getBoundingClientRect().width;
    this.parentX = this.$parent.$el.getBoundingClientRect().left;
    this.ownWidth = this.$el.getBoundingClientRect().width;
    this.ownX = this.$el.getBoundingClientRect().left;

    this.lineLength = (
      this.parentWidth
      - this.ownWidth
      - (this.ownX - this.parentX)
      + 48
    );

    this.linkOffset = this.lineLength + this.ownWidth;

    this.linkWidth = (this.$refs.link as Element).getBoundingClientRect().width;

    this.fullUrlOffset = this.linkOffset + this.linkWidth;
  }

  handleHover(inside: boolean) {
    this.hovering = inside;
  }
}
</script>

<style scoped lang="sass" src="./InlineLink.sass">
