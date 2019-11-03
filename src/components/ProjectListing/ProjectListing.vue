<template lang="pug">
  #ProjectListing(
    @click="goToProject()"
    @mouseover="hover = true"
    @mouseleave="hover = false"
  )
    #main(:class="{ hoverEnabled: !disableHover }")
      div#line(
        :class="{ shown: isHovering }"
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
        :theme="desiredTokens"
      )
        #tokens
          .token(
            v-for="(t, index) in desiredTokens"
            :key="index"
            :style="{ backgroundColor: `rgba(${t[0]},${t[1]},${t[2]},${t[3]})`}"
          )
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';

import themeStore from '@/store/modules/theme/theme';

import Themer from '@/components/Themer';
import { Theme } from '../../store/modules/theme/theme.types';

@Component({
  name: 'ProjectListing',
  components: {
    Themer,
  },
})
export default class extends Vue {
  hover: boolean = false;

  themeModule = getModule(themeStore, this.$store);

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
  }) readonly tokens!: Theme;

  @Prop({
    type: Object,
    required: true,
  }) readonly tokensDark!: Theme;

  @Prop({
    type: Boolean,
    required: false,
    default: false,
  }) readonly disableHover!: boolean;

  imgBg: Array<number> = this.desiredTokens.background || [0, 0, 0, 1];

  get isHovering(): boolean {
    return this.disableHover
      ? false
      : this.hover;
  }

  get desiredTokens(): Theme {
    return this.themeModule.isDarkMode
      ? this.tokensDark
      : this.tokens;
  }

  parseDate = (input: string): string => {
    const date = new Date(Date.parse(input));
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  goToProject(): void {
    if (!this.disableHover) this.$router.push(`/${this.slug}`);
  }
}
</script>

<style scoped lang="sass" src="./ProjectListing.sass" />
