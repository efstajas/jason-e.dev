<template lang="pug">
  intersect(@enter="startAnimation" :threshold="[0.8]")
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
          #illustration
            svg(
              id="animate"
              :class="{ animateIn: shouldAnimate }"
              :viewBox="illustrationViewbox || defaultViewbox"
              v-html="illustration"
            )
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';
import Intersect from 'vue-intersect';

import themeStore from '@/store/modules/theme/theme';

import Themer from '@/components/Themer';
import { Theme, Token } from '../../store/modules/theme/theme.types';

const DEFAULT_VIEWBOX = '0 0 327 86';

@Component({
  name: 'ProjectListing',
  components: {
    Themer,
    Intersect,
  },
})
export default class extends Vue {
  hover: boolean = false;

  themeModule = getModule(themeStore, this.$store);

  shouldAnimate: boolean = false;

  defaultViewbox: string = DEFAULT_VIEWBOX;

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
    type: String,
    required: false,
  }) readonly illustration!: string;

  @Prop({
    type: String,
    required: false,
  }) readonly illustrationViewbox!: string;

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

  get imgBg(): Token {
    return this.desiredTokens.background;
  }

  async mounted() {
    await this.$nextTick;

    const paths = document.querySelectorAll('#animate path');

    paths.forEach((path) => {
      const length = (path as SVGGeometryElement).getTotalLength();
      path.setAttribute('style', `stroke-dasharray: ${length}; stroke-dashoffset: ${length}`);
    });
  }

  parseDate = (input: string): string => {
    const date = new Date(Date.parse(input));
    return new Intl.DateTimeFormat('en-US', {
      month: 'long',
      year: 'numeric',
    }).format(date);
  };

  goToProject(): void {
    if (!this.disableHover) {
      this.$router.push({
        name: 'project',
        params: {
          slug: this.slug,
        },
      });
    }
  }

  startAnimation(): void {
    this.shouldAnimate = true;
  }
}
</script>

<style lang="sass" src="./ProjectListing.sass" />
