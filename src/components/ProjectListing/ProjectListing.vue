<template lang="pug">
  #ProjectListing(
    @click="goToProject()"
    @mouseover="hover = true"
    @mouseleave="hover = false"
  )
    #main
      div#line(
        :class="{ shown: hover }"
      )
      p#name
        span {{name}}
      p#date
        span {{parseDate(date)}}
      p#role
        span {{role}}
      p#subtitle {{subtitle}}
      Themer#image(
        :style="{ backgroundColor: `rgba(${imgBg[0]},${imgBg[1]},${imgBg[2]},${imgBg[3]})`}"
        :theme="tokens"
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

import Themer from '@/components/Themer';

@Component({
  name: 'ProjectListing',
  components: {
    Themer,
  },
})
export default class extends Vue {
  hover: boolean = false;

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
