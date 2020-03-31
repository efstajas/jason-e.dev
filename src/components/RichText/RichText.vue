<template lang="pug">
  article#RichText
    VRuntimeTemplate(:template="wrappedTemplate")#template
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import VRuntimeTemplate from 'v-runtime-template';

@Component({
  name: 'RichText',
  components: {
    InlineImage: () => import('@/components/InlineComponents/InlineImage'),
    InlineLink: () => import('@/components/InlineComponents/InlineLink'),
    InlineVideo: () => import('@/components/InlineComponents/InlineVideo'),
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
