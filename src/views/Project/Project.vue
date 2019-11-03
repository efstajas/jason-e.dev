<template lang="pug">
  div#Project(v-if="project && projectContent")
    ProjectListing(v-bind="project" :tokensDark="project.tokens_dark" :disableHover="true")#intro
    .credit {{ project.credit }}
    #text
      VRuntimeTemplate(:template="projectContent")
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import MarkdownIt from 'markdown-it';
import VRuntimeTemplate from 'v-runtime-template';
import { getModule } from 'vuex-module-decorators';

import ProjectListing from '@/components/ProjectListing';

import themeStore from '@/store/modules/theme/theme';
import projectsStore from '@/store/modules/projects/projects';

const md = new MarkdownIt({
  html: true,
});

@Component({
  name: 'Project',
  components: {
    ProjectListing,
    VRuntimeTemplate,
  },
})
export default class extends Vue {
  themeModule = getModule(themeStore, this.$store);

  projectsModule = getModule(projectsStore, this.$store);

  project: null | any = null;

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
    this.themeModule.setTheme({
      light: this.project.tokens,
      dark: this.project.tokens_dark,
    });
  }

  get projectContent(): string | null {
    return this.project
      ? `<div>${md.renderInline(this.project.content)}</div>`
      : null;
  }

  beforeDestroy() {
    this.themeModule.restoreDefaultTheme();
  }
}
</script>

<style scoped lang="sass" src="./Project.sass">
