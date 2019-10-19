<template lang="pug">
  #ProjectListing(
    @click="goToProject()"
  )
    #main
      p#name {{name}}
      p#date {{parseDate(date)}}
      p#role {{role}}
      p#subtitle {{subtitle}}
      #image(
        :style="{ backgroundColor: `rgba(${imgBg[0]},${imgBg[1]},${imgBg[2]},${imgBg[3]})`}"
      )
        #tokens
          .token(
            v-for="(t, index) in tokens"
            :key="index"
            :style="{ backgroundColor: `rgba(${t[0]},${t[1]},${t[2]},${t[3]})`}"
          )
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
  }) readonly name!: string;

  @Prop({
    type: String,
    required: true,
  }) readonly date!: string;

  @Prop({
    type: String,
    required: true,
  }) readonly slug!: string;

  @Prop({
    type: String,
    required: true,
  }) readonly role!: string;

  @Prop({
    type: String,
    required: true,
  }) readonly subtitle!: string;

  @Prop({
    type: Object,
    required: true,
  }) readonly tokens!: any;

  imgBg: Array<number> = this.tokens.background || [0, 0, 0, 1];

  parseDate = (input: string): string => {
    const date = new Date(Date.parse(input));
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  goToProject(): void {
    this.$router.push(`/${this.slug}`);
  }
}
</script>

<style scoped lang="sass" src="./ProjectListing.sass" />
