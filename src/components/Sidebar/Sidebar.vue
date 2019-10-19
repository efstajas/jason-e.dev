<template lang="pug">
  div#Sidebar
    #titleSection(
      @click="handleTitleClick"
    )
      #content
        transition(name="arrow")
          .goBack(v-if="goHomeEnabled") <-
        .title(:class="{ nudged: goHomeEnabled }") Jason Efstathiou
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component({
  name: 'Sidebar',
})
export default class extends Vue {
  @Prop({
    required: true,
    type: Boolean,
    default: false,
  }) readonly goHomeEnabled!: boolean;

  handleTitleClick():void {
    if (this.goHomeEnabled) this.$router.push('/');
  }
}
</script>

<style scoped lang="sass" src="./Sidebar.sass">
