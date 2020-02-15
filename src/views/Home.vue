<template lang="pug">
  div#Home
    #intro
      p I'm a Product Owner, full-stack developer & UX designer.
      p I'm currently working at Grover.
      br
      router-link(to="/about") Read some more about me & my work here.
      p#haveALook Or, have a look at some selected projects:
    transition(name='fade' mode='out-in')
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
import projects from '@/graphql/queries/projects';
import ProjectListing from '@/components/ProjectListing';
import LoadingIndicator from '@/components/LoadingIndicator';

import loadingStore from '@/store/modules/loading/loading';
import projectsStore from '@/store/modules/projects/projects';
import { sortProjectsByDate } from '@/store/modules/projects/util';

@Component({
  name: 'Home',
  components: {
    ProjectListing,
    LoadingIndicator,
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

  get sortedProjects() {
    return sortProjectsByDate(this.projectsModule.getAllProjects);
  }

  applyProjectsFromStore(): void {
    this.projects = this.projectsModule.getAllProjects;
    this.$root.$emit('loadedProjects');
  }
}
</script>

<style lang="sass" scoped>
#intro
  margin-top: 64px
  margin-bottom: 128px
  #haveALook
    margin-top: 64px
#projects
  > *
    margin-bottom: 128px
.fade-enter-active, .fade-leave-active
  transition: opacity .3s
.fade-enter, .fade-leave-to
  opacity: 0
a
  text-decoration: underline
  cursor: pointer
</style>
