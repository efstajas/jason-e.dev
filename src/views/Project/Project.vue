<template lang="pug">
  div#Project(v-if="project")
    ProjectListing(v-bind="project" :tokensDark="project.tokens_dark" :disableHover="true")#intro
    VueMarkdown#text {{project.content}}
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import VueMarkdown from 'vue-markdown';
import { getModule } from 'vuex-module-decorators';

import ProjectListing from '@/components/ProjectListing';

import themeStore from '@/store/modules/theme/theme';
import projectsStore from '@/store/modules/projects/projects';

@Component({
  name: 'Project',
  components: {
    VueMarkdown,
    ProjectListing,
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

  beforeDestroy() {
    this.themeModule.restoreDefaultTheme();
  }
}
</script>

<style scoped lang="sass" src="./Project.sass">
