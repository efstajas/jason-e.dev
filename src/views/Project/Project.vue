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
import InlineImage from '@/components/InlineComponents/InlineImage';

import themeStore from '@/store/modules/theme/theme';
import projectsStore from '@/store/modules/projects/projects';
import subChapters from '@/store/modules/subChapters/subChapters';
import getNextProjectSlug from '@/store/modules/projects/util';
import { Chapter } from '../../store/modules/subChapters/subChapters.types';

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
  },
})
export default class extends Vue {
  themeModule = getModule(themeStore, this.$store);

  chaptersModule = getModule(subChapters, this.$store);

  projectsModule = getModule(projectsStore, this.$store);

  project: null | any = null;

  headlines: NodeList | null = null;

  nextProject: any = null;

  async mounted() {
    const { slug } = this.$route.params;

    const project = this.projectsModule.getProject(slug);

    if (project && project.content) {
      this.applyProjectFromStore(slug);
      return;
    }

    await this.projectsModule.fetchProjects({
      query: `
        slug: "${slug}"
      `,
      fields: `
        slug
        name
        date
        role
        subtitle
        tokens
        content
        tokens_dark
        credit
      `,
    });

    this.applyProjectFromStore(slug);
  }

  applyProjectFromStore(slug: string) {
    this.project = this.projectsModule.getProject(slug);
    this.nextProject = getNextProjectSlug(
      this.project.slug,
      this.projectsModule.getAllProjects,
    );
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
