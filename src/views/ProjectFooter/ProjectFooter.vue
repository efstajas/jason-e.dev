<template lang="pug">
  div#ProjectFooter
    p Keep on reading:
    ProjectListing(
      v-if="nextProject"
      v-bind="nextProject"
      :tokensDark="nextProject.tokens_dark"
    )
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';

import getNextProjectSlug from '@/store/modules/projects/util';
import ProjectListing from '@/components/ProjectListing';
import projectsStore from '@/store/modules/projects/projects';

@Component({
  name: 'ProjectFooter',
  components: {
    ProjectListing,
  },
})
export default class extends Vue {
  nextProject: any = null;

  projectsModule = getModule(projectsStore, this.$store);

  async mounted() {
    const { slug } = this.$route.params;

    this.nextProject = this.getNextProjectFromStore(slug);

    if (!this.nextProject) {
      await this.projectsModule.getProjectsForContext({
        context: 'Listing',
        first: 1,
      });
      this.nextProject = this.getNextProjectFromStore(slug);
    }
  }

  getNextProjectFromStore(slug: string) {
    return this.projectsModule.getProject(
      getNextProjectSlug(
        slug,
        this.projectsModule.getAllProjects,
      ),
    );
  }
}
</script>

<style scoped lang="sass" src="./ProjectFooter.sass">
