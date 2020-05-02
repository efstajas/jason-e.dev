<template lang="pug">
  div#LoadingIndicator(ref="container" :class="{ appear }")
    #line(
      v-if="width"
      :style="{ '--parentWidth': `${width}px`, width: `${secondLineWidth}px` }"
    )
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';

@Component({
  name: 'LoadingIndicator',
})
export default class extends Vue {
  private width: number | null = null;

  private secondLineWidth: number | null = null;

  private appear: boolean = false;

  private mounted() {
    this.calcWidths();
    setTimeout(() => { this.appear = true; }, 500);
  }

  private calcWidths() {
    this.width = (this.$refs.container as HTMLDivElement)
      .getBoundingClientRect().width;

    this.secondLineWidth = this.width / 5;
  }
}
</script>

<style scoped lang="sass" src="./LoadingIndicator.sass">
