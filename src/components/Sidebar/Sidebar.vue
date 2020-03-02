<template lang="pug">
  div#Sidebar(
    ref="container"
  )
    #titleSection(
      @click="handleTitleClick"
      :class="{ extended: goHomeEnabled }"
    )
      #content(:style="{ width: width }")
        .goBack(
          :class="{ shown: goHomeEnabled }"
          ) <-
        .title(:class="{ nudged: goHomeEnabled }") Jason Efstathiou
    scrollactive#chapters(
      @itemchanged="activatedChapter = true"
    )
      #inner(
        name="fade"
        :style="{ width: width }"
      )
        a(
          class="scrollactive-item"
          :class="{ 'is-active': !activatedChapter }"
          v-for="chapter, index in currentChapters"
          :key="chapter.hash"
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

  width: string | null = '320px';

  activatedChapter: boolean = false;

  @Prop({
    required: true,
    type: Boolean,
    default: false,
  }) readonly goHomeEnabled!: boolean;

  get currentChapters(): Chapter[] | null {
    return this.chaptersModule.currentChapters;
  }

  handleTitleClick():void {
    if (this.goHomeEnabled) this.$router.push({ name: 'home' });
  }
}
</script>

<style scoped lang="sass" src="./Sidebar.sass">
