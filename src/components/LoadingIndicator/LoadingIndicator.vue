<template lang="pug">
  div#LoadingIndicator(ref="container")
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

  private async mounted() {
    this.calcWidths();
  }

  private calcWidths() {
    this.width = (this.$refs.container as HTMLDivElement)
      .getBoundingClientRect().width;

    this.secondLineWidth = this.width / 5;
  }
}
</script>

<style scoped lang="sass" src="./LoadingIndicator.sass">
