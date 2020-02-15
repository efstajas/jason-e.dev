<template lang="pug">
  div#About
    transition(
      name='fade'
      mode="out-in"
    )
      RichText(:template="template" v-if="!loading")#text
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
  private content: string = '';

  private loading: boolean = true;

  private async mounted() {
    this.content = (await query()).content;
    this.loading = false;
  }

  private get template(): string {
    return md.render(this.content);
  }

  @Meta
  // eslint-disable-next-line class-methods-use-this
  private metaConfig() {
    return {
      title: 'About',
    };
  }
}
</script>

<style scoped lang="sass" src="./About.sass">
