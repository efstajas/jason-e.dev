<template lang="pug">
  div#Project
    p {{project}}
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import project from '@/graphql/queries/project';

@Component({
  name: 'Project',
})
export default class extends Vue {
  project: null | any = null;

  async mounted() {
    this.project = (await project(this.$route.params.slug)).data.projects;
  }
}
</script>

<style scoped lang="sass" src="./Project.sass">
