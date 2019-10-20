<template lang="pug">
  div#Project(v-if="project")
    VueMarkdown {{project.content}}
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import VueMarkdown from 'vue-markdown';
import { getModule } from 'vuex-module-decorators';

import themeStore from '@/store/modules/theme/theme';
import project from '@/graphql/queries/project';

@Component({
  name: 'Project',
  components: {
    VueMarkdown,
  },
})
export default class extends Vue {
  themeModule = getModule(themeStore);

  project: null | any = null;

  async mounted() {
    const [queryResult] = (await project(this.$route.params.slug)).data.projects;
    this.project = queryResult;

    this.themeModule.setTheme(this.project.tokens);
  }

  beforeDestroy() {
    this.themeModule.restoreDefaultTheme();
  }
}
</script>

<style scoped lang="sass" src="./Project.sass">
