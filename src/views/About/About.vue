<template lang="pug">
  div#About
    RichText(:template="template")#text
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import MarkdownIt from 'markdown-it';
import MarkdownItDecorate from 'markdown-it-decorate';

import RichText from '@/components/RichText';

import Meta from '@/decorators/meta';
import query from '@/graphql/queries/aboutPage';

const md = new MarkdownIt({
  html: true,
  typographer: true,
}).use(MarkdownItDecorate);

@Component({
  name: 'About',
  components: {
    RichText,
  },
})
export default class extends Vue {
  content: string = '';

  async mounted() {
    this.content = (await query()).content;
  }

  get template(): string {
    return md.render(this.content);
  }

  @Meta
  // eslint-disable-next-line class-methods-use-this
  metaConfig() {
    return {
      title: 'About',
    };
  }
}
</script>

<style scoped lang="sass" src="./About.sass">
