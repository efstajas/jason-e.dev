<template lang="pug">
  div#Projects
    transition(name="fade" mode="out-in")
      #projects(key="projects" v-if="!isLoading && projects")
        ProjectListing(
          v-for="(project, index) in sortedProjects"
          :key="index"
          v-bind="project"
          :tokensDark="project.tokens_dark"
        )
      LoadingIndicator#loading(key="loading" v-else)
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';

import loadingStore from '@/store/modules/loading/loading';
import projects from '@/graphql/queries/projects';
import projectsStore from '@/store/modules/projects/projects';
import ProjectListing from '@/components/ProjectListing';
import LoadingIndicator from '@/components/LoadingIndicator';
import { sortProjectsByDate } from '@/store/modules/projects/util';

@Component({
  name: 'Projects',
  components: {
    LoadingIndicator,
    ProjectListing,
  },
})
export default class extends Vue {
  projectsModule = getModule(projectsStore, this.$store);

  loadingModule = getModule(loadingStore, this.$store);

  projects: null | any = null;

  async mounted() {
    await this.projectsModule.getProjectsForContext({
      sort: 'date:desc',
      projects: 'all',
      first: 10,
      context: 'Listing',
    });

    this.applyProjectsFromStore();
  }

  get isLoading() {
    return this.loadingModule.isLoading;
  }

  applyProjectsFromStore(): void {
    this.projects = this.projectsModule.getAllProjects;
    this.$root.$emit('loadedProjects');
  }

  get sortedProjects() {
    return sortProjectsByDate(this.projectsModule.getAllProjects);
  }
}
</script>

<style scoped lang="sass" src="./Projects.sass">
