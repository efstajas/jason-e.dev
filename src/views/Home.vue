<template lang="pug">
  div#Home
    #intro
      p I'm a Product Owner, full-stack developer & UX designer.
      br
      p I'm currently working at Grover.
      p#haveALook Have a look at some selected projects:
    #projects
      ProjectListing(
        title="Grover Loop"
        date="March 2019"
        role="System Architect & Product Manager"
        subtitle="An endlessly flexible end-to-end subscription management platform."
      )
</template>

<script>
import { Component, Vue } from 'vue-property-decorator';
import ProjectListing from '@/components/ProjectListing';

@Component({
  name: 'Home',
  components: {
    ProjectListing,
  },
})
export default class extends Vue {}
</script>

<style lang="sass" scoped>
#intro
  margin-bottom: 128px
  #haveALook
    margin-top: 64px
#projects
</style>
