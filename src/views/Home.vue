<template lang="pug">
  div#Home
    #intro
      p I'm a Product Owner, full-stack developer & UX designer.
      br
      p I'm currently working at Grover.
      p#haveALook Have a look at some selected projects:
    #projects(v-if="projects")
      ProjectListing(
        v-for="(project, index) in projects"
        :key="index"
        v-bind="project"
      )
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import projects from '@/graphql/queries/projects';
import ProjectListing from '@/components/ProjectListing';

@Component({
  name: 'Home',
  components: {
    ProjectListing,
  },
})
export default class extends Vue {
  projects: null | any = null;

  async mounted() {
    this.projects = (await projects).data.projects;
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
</style>
