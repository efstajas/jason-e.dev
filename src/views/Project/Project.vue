<template lang="pug">
  div#Project(v-if="project && projectContent")
    ProjectListing(v-bind="project" :tokensDark="project.tokens_dark" :disableHover="true")#intro
    .credit {{ project.credit }}
    #headlines
      .headline(v-for="headline, index in headlines" :key="index")
        a(:href="`#${headline.id}`") {{ headline.innerHTML }}
    #text
      VRuntimeTemplate(:template="projectContent")
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import MarkdownIt from 'markdown-it';
import MarkdownItDecorate from 'markdown-it-decorate';
import VRuntimeTemplate from 'v-runtime-template';
import { getModule } from 'vuex-module-decorators';

import ProjectListing from '@/components/ProjectListing';
import { InlineImage, InlineLink } from '@/components/InlineComponents';

import themeStore from '@/store/modules/theme/theme';
import projectsStore from '@/store/modules/projects/projects';
import subChapters from '@/store/modules/subChapters/subChapters';
import { Chapter } from '../../store/modules/subChapters/subChapters.types';

import Meta from '@/decorators/meta';

const md = new MarkdownIt({
  html: true,
  typographer: true,
}).use(MarkdownItDecorate);

@Component({
  name: 'Project',
  components: {
    ProjectListing,
    VRuntimeTemplate,
    InlineImage,
    InlineLink,
  },
})
export default class extends Vue {
  themeModule = getModule(themeStore, this.$store);

  chaptersModule = getModule(subChapters, this.$store);

  projectsModule = getModule(projectsStore, this.$store);

  project: null | any = null;

  headlines: NodeList | null = null;

  async mounted() {
    const { slug } = this.$route.params;

    await this.projectsModule.getProjectsForContext({
      projects: [slug],
      context: 'View',
    });

    this.applyProjectFromStore(slug);
  }

  @Meta
  // eslint-disable-next-line class-methods-use-this
  metaConfig() {
    return {
      title: this.project ? this.project.name : '',
      meta: [{
        name: 'theme-color',
        content: this.project ? this.project.tokens : '#FFFFFF',
      }],
    };
  }

  applyProjectFromStore(slug: string) {
    this.project = this.projectsModule.getProject(slug);

    if (!this.project) {
      this.$router.push({
        path: '/error',
      });
    }

    this.themeModule.setTheme({
      light: this.project.tokens,
      dark: this.project.tokens_dark,
    });
  }

  get projectContent(): string | null {
    if (!this.project) return null;

    const rendered = md.render(this.project.content);
    const div = document.createElement('div');
    div.innerHTML = rendered;

    this.updateHeadlines(div);

    return `<div>${div.innerHTML}</div>`;
  }

  updateHeadlines(div: HTMLDivElement) {
    const chapters: Chapter[] = [];

    div.querySelectorAll('.addToNav').forEach((headline) => {
      chapters.push({
        text: headline.innerHTML,
        hash: headline.id,
      });
    });

    this.chaptersModule.setChapters(chapters);
  }

  beforeDestroy() {
    this.chaptersModule.clearChapters();
    this.themeModule.restoreDefaultTheme();
  }
}
</script>

<style scoped lang="sass" src="./Project.sass">
