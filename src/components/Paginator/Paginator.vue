<template lang="pug">
  div#Paginator
    div#box(ref="box")
      div#innerBox(:style="{ width: width }")
    #annotation
      p Displaying projects {{ firstProject }} through {{ lastProject }}.
      p {{ remainingProjects }} more to go.
    #links
      a(@click="handleClick('back')" v-if="previousPage > 0") <- View Page {{ previousPage }}
      a(@click="handleClick('forward')" v-if="nextPage") View Page {{ nextPage }} ->
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  name: 'Paginator',
})
export default class extends Vue {
  width: string | null = null;

  @Prop({
    type: Number,
    required: true,
  }) readonly totalCount!: number;

  @Prop({
    type: Number,
    required: true,
  }) readonly currentPage!: number;

  @Prop({
    type: Number,
    required: true,
  }) readonly pageSize!: number;

  @Prop({
    type: Number,
    required: true,
  }) readonly onScreen!: number;

  async mounted() {
    this.updateWidth();
  }

  get firstProject(): number {
    return (this.currentPage * this.pageSize) - this.pageSize + 1;
  }

  get lastProject(): number {
    return ((this.currentPage - 1) * this.pageSize + this.onScreen);
  }

  get remainingProjects(): number {
    return (this.totalCount - this.lastProject);
  }

  get nextPage(): number | null {
    // We're already on the last page.
    if (((this.currentPage) * this.pageSize) >= this.totalCount) return null;

    return (Math.round((this.totalCount / this.pageSize)) - this.currentPage + 1);
  }

  get previousPage(): number {
    return Math.abs((Math.round((this.totalCount / this.pageSize)) - this.currentPage - 1));
  }

  updateWidth() {
    const width = (this.$refs.box as HTMLElement).clientWidth;
    const atProject = this.lastProject;
    const percentage = atProject / this.totalCount;

    this.width = `${width * percentage}px`;
  }

  handleClick(direction: 'forward' | 'back') {
    this.$emit(direction);
  }
}
</script>

<style scoped lang="sass" src="./Paginator.sass">
