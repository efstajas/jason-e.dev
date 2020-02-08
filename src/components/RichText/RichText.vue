<template lang="pug">
  div#RichText
    VRuntimeTemplate(:template="wrappedTemplate")#template
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import VRuntimeTemplate from 'v-runtime-template';

import { InlineImage, InlineLink } from '@/components/InlineComponents';

@Component({
  name: 'RichText',
  components: {
    InlineImage,
    InlineLink,
    VRuntimeTemplate,
  },
})
export default class extends Vue {
  @Prop({
    type: String,
    required: true,
  }) readonly template!: string;

  get wrappedTemplate(): string {
    return `<div>
      ${this.template}
    </div>`;
  }
}
</script>

<style scoped lang="sass" src="./RichText.sass">
