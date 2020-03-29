<template lang="pug">
  div#Project(v-if="project && projectContent")
    ProjectListing(v-bind="project" :tokensDark="project.tokens_dark" :disableHover="true")#intro
    .credit {{ project.credit }}
    #headlines
      .headline(v-for="headline, index in headlines" :key="index")
        a(:href="`#${headline.id}`") {{ headline.innerHTML }}
    #text
      transition(name='fade' mode="out-in")
        RichText(:template="projectContent" v-if="!isLoading && projectContent")
        LoadingIndicator(v-else)
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import MarkdownIt from 'markdown-it';
import MarkdownItDecorate from 'markdown-it-decorate';
import { getModule } from 'vuex-module-decorators';

import ProjectListing from '@/components/ProjectListing';
import LoadingIndicator from '@/components/LoadingIndicator';
import RichText from '@/components/RichText';

import themeStore from '@/store/modules/theme/theme';
import loadingStore from '@/store/modules/loading/loading';
import projectsStore from '@/store/modules/projects/projects';
import subChapters from '@/store/modules/subChapters/subChapters';
import { Chapter } from '../../store/modules/subChapters/subChapters.types';

import Meta from '@/decorators/meta';

import setThemeColor from '@/util/setThemeColor';

const md = new MarkdownIt({
  html: true,
  typographer: true,
}).use(MarkdownItDecorate);

@Component({
  name: 'Project',
  components: {
    RichText,
    LoadingIndicator,
    ProjectListing,
  },
})
export default class extends Vue {
  themeModule = getModule(themeStore, this.$store);

  loadingModule = getModule(loadingStore, this.$store);

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

    setThemeColor(this.themeModule.currentTheme.background);
  }

  @Meta
  metaConfig() {
    return {
      title: this.project ? this.project.name : undefined,
      meta: [
        { name: 'description', content: this.project ? this.project.subtitle : undefined },
      ],
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

  get isLoading() {
    return this.loadingModule.isLoading;
  }

  get projectContent(): string | null {
    if (!this.project) return null;

    const rendered = md.render(this.project.content);
    const div = document.createElement('div');
    div.innerHTML = rendered;

    this.updateHeadlines(div);

    return div.innerHTML;
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
