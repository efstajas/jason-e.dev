<template lang="pug">
  div#Home
    #intro
      p I'm a Product Owner, full-stack developer & UX designer.
      br
      p I'm currently working at Grover.
      p#haveALook Have a look at some selected projects:
    transition(name='fade' mode="out-in")
      #projectsAndPages(v-if="projects" :key="currentPage")
        #projects
            ProjectListing(
              v-for="(project, index) in projects"
              :key="index"
              v-bind="project"
              :tokensDark="project.tokens_dark"
            )
        #pages
          Paginator(
            :totalCount="count"
            :pageSize="pageSize"
            :currentPage="currentPage"
            :onScreen="Object.keys(projects).length"
            @forward="handlePageEvent('forward')"
            @back="handlePageEvent('back')"
          )
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import projects from '@/graphql/queries/projects';
import ProjectListing from '@/components/ProjectListing';
import Paginator from '@/components/Paginator';

import projectsStore from '@/store/modules/projects/projects';
import { sortProjectsByDate } from '@/store/modules/projects/util';

const PAGE_SIZE = 2;

@Component({
  name: 'Home',
  components: {
    ProjectListing,
    Paginator,
  },
})
export default class extends Vue {
  projectsModule = getModule(projectsStore, this.$store);

  projects: null | any = null;

  count: null | number = null;

  pageSize: number = PAGE_SIZE;

  get currentPage(): number {
    console.log('currentPage', this.$route.query.page);
    return this.$route.query.page
      ? parseInt(this.$route.query.page[0] || '0', 10)
      : 1;
  }

  async mounted() {
    await this.projectsModule.fetchProjectAmount();
    await this.fetchProjects();
  }

  applyProjectsFromStore(): void {
    console.log('applying, page: ', this.currentPage);
    console.log();
    this.projects = this.projectsModule.getAllProjectsOnPage(this.currentPage);
    this.count = this.projectsModule.projectCount;
    this.$root.$emit('loadedProjects');
  }

  async fetchProjects(): Promise<void> {
    console.log('page size', PAGE_SIZE);
    console.log('fetching, start: ', (this.currentPage - 1) * PAGE_SIZE);
    await this.projectsModule.getProjectsForContext({
      sort: 'date:desc',
      projects: 'all',
      first: PAGE_SIZE,
      context: 'Listing',
      start: (this.currentPage - 1) * PAGE_SIZE,
      page: this.currentPage,
    });

    this.applyProjectsFromStore();
  }

  clearProjects(): void {
    this.projects = null;
  }

  async refreshProjects(): Promise<void> {
    this.clearProjects();
    await this.fetchProjects();
  }

  async handlePageEvent(direction: 'forward' | 'back'): Promise<void> {
    let page = this.currentPage;

    switch (direction) {
      case 'forward':
        page += 1;
        break;
      case 'back':
        page -= 1;
        break;
      default:
        throw new Error('tried to go in unknown direction');
    }

    this.$router.push({
      name: 'home',
      query: {
        page: page.toString(),
      },
    });

    await this.refreshProjects();
  }
}
</script>

<style lang="sass" scoped>
#intro
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
</style>
