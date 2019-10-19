<template lang="pug">
  div#Project(v-if="project")
    VueMarkdown {{project.content}}
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import VueMarkdown from 'vue-markdown';

import project from '@/graphql/queries/project';

@Component({
  name: 'Project',
  components: {
    VueMarkdown,
  },
})
export default class extends Vue {
  project: null | any = null;

  async mounted() {
    const [queryResult] = (await project(this.$route.params.slug)).data.projects;
    this.project = queryResult;
  }
}
</script>

<style scoped lang="sass" src="./Project.sass">
