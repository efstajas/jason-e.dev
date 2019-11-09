<template lang="pug">
  div#Sidebar(ref="container")
    #titleSection(
      @click="handleTitleClick"
    )
      #content(:style="{ width: width }")
        .goBack(
          :class="{ shown: goHomeEnabled }"
          ) <-
        .title(:class="{ nudged: goHomeEnabled }") Jason Efstathiou
    scrollactive#chapters(:style="{ width: width }")
      a(
        class="scrollactive-item"
        v-for="chapter, index in currentChapters"
        :key="index"
        :href="`#${chapter.hash}`"
      ) {{ chapter.text }}
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';

import subChapters from '@/store/modules/subChapters/subChapters';

import { Chapter } from '@/store/modules/subChapters/subChapters.types';

@Component({
  name: 'Sidebar',
})
export default class extends Vue {
  chaptersModule = getModule(subChapters, this.$store);

  width: string | null = null;

  @Prop({
    required: true,
    type: Boolean,
    default: false,
  }) readonly goHomeEnabled!: boolean;

  mounted() {
    this.width = `${(this.$refs.container as HTMLElement).offsetWidth}px`;
  }

  get currentChapters(): Chapter[] | null {
    return this.chaptersModule.currentChapters;
  }

  handleTitleClick():void {
    console.log('ayy');
    if (this.goHomeEnabled) this.$router.push('/');
  }
}
</script>

<style scoped lang="sass" src="./Sidebar.sass">
