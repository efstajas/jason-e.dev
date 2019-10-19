<template lang="pug">
  #ProjectListing
    #main
      p#title {{title}}
      p#date {{date}}
      p#role {{role}}
      p#subtitle {{subtitle}}
      #image
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  name: 'ProjectListing',
})
export default class extends Vue {
  @Prop({
    type: String,
    required: true,
  }) readonly title!: string;

  @Prop({
    type: String,
    required: true,
  }) readonly date!: string;

  @Prop({
    type: String,
    required: true,
  }) readonly role!: string;

  @Prop({
    type: String,
    required: true,
  }) readonly subtitle!: string;
}
</script>

<style scoped lang="sass" src="./ProjectListing.sass">
