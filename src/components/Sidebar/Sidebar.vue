<template lang="pug">
  nav.Sidebar(
    ref="container"
  )
    .titleSection(
      @click="handleTitleClick"
      :class="{ extended: goHomeEnabled }"
    )
      .content()
        .inner
          .goBack(
            :class="{ shown: goHomeEnabled }"
            ) <-
          .title(:class="{ nudged: goHomeEnabled }") Jason Efstathiou
        .line
    scrollactive.chapters(
      @itemchanged="handleItemChanged"
    )
      .progressBall(
        :style="{ transform: `translateY(${ballYOffset}px) scale(${activeChapter ? 1 : 0})` }"
      )
      .inner(
        name="fade"
        :style="{ width: width }"
      )
        a(
          class="scrollactive-item"
          :class="{ 'is-active': !activatedChapter, scrolledDown }"
          v-for="chapter, index in currentChapters"
          :key="chapter.hash"
          :href="`#${chapter.hash}`"
          :ref="chapter.hash"
          :data-index="index"
          :data-ref="chapter.hash"
          @click="currentlyAutoscrolling = true"
        )
          .progressBar
          span {{ chapter.text }}
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';

import subChapters from '@/store/modules/subChapters/subChapters';

import { Chapter } from '@/store/modules/subChapters/subChapters.types';

function getChapterElements(el: Element, res: Element[] = []): Element[] {
  const sibling = el.nextElementSibling;

  if (!sibling) return res;
  if (sibling.nodeName === 'H1') return res;

  const newRes = [...res, sibling];

  return getChapterElements(sibling, newRes);
}

function calculateChapterHeight(el: Element): number {
  const chapterSiblings = getChapterElements(el);

  const topPos = chapterSiblings[0].getBoundingClientRect().top;
  const bottomPos = chapterSiblings.slice(-1)[0].getBoundingClientRect().bottom;

  return bottomPos - topPos;
}

@Component({
  name: 'Sidebar',
})
export default class extends Vue {
  chaptersModule = getModule(subChapters, this.$store);

  width: string | null = '320px';

  activatedChapter: boolean = false;

  scrollY: number = 0;

  activeChapter: HTMLAnchorElement | null = null;

  activeChapterHeight: number | null = null;

  activeChapterPos: number | null = null;

  activeChapterScrollPercentage: number | null = null;

  currentlyAutoscrolling: boolean = false;

  @Prop({
    required: true,
    type: Boolean,
    default: false,
  }) readonly goHomeEnabled!: boolean;

  get currentChapters(): Chapter[] | null {
    return this.chaptersModule.currentChapters;
  }

  handleTitleClick(): void {
    if (this.goHomeEnabled) this.$router.push({ name: 'projects' });
  }

  get scrolledDown(): boolean {
    return this.scrollY > 0;
  }

  get ballYOffset(): number {
    if (!this.activeChapter) return 0;

    const isFirstChapter = parseInt(this.activeChapter.getAttribute('data-index')!, 10) === 0;
    const isLastChapter = parseInt(this.activeChapter.getAttribute('data-index')!, 10) === this.currentChapters!.length - 1;

    return this.activeChapter.offsetTop
      + this.activeChapter.offsetHeight
      * (isFirstChapter || isLastChapter
        ? this.activeChapterScrollPercentage! / 2 + (isFirstChapter ? 0.5 : 0)
        : this.activeChapterScrollPercentage!
      ) - 5;
  }

  private updateScroll() {
    if (!this.currentlyAutoscrolling) {
      this.scrollY = window.scrollY;

      if (this.activeChapter) {
        this.activeChapterScrollPercentage = (
          this.scrollY - this.activeChapterPos!
        ) / this.activeChapterHeight!;
      }
    }
  }

  updateCurrentChapterHeightAndPos() {
    if (!this.activeChapter) return;
    const chapter = document.getElementById(this.activeChapter.getAttribute('data-ref')!)!;

    this.activeChapterHeight = calculateChapterHeight(chapter);
    this.activeChapterPos = chapter.offsetTop;
  }

  // eslint-disable-next-line class-methods-use-this
  registerNewChapter(el: HTMLElement) {
    el.setAttribute('style', 'background-color: red;');
    this.updateCurrentChapterHeightAndPos();
  }

  handleItemChanged(e: Event, n: HTMLAnchorElement | null, p: HTMLAnchorElement | null) {
    this.activatedChapter = true;
    this.activeChapter = n;
    this.currentlyAutoscrolling = false;
    this.updateCurrentChapterHeightAndPos();
    this.updateScroll();
  }

  async mounted() {
    this.updateScroll();

    await this.$nextTick();

    const observer = new MutationObserver(() => {
      this.updateCurrentChapterHeightAndPos();
    });

    window.addEventListener('scroll', this.updateScroll);
  }

  destroyed() {
    window.removeEventListener('scroll', this.updateScroll);
  }
}
</script>

<style scoped lang="sass" src="./Sidebar.sass">
