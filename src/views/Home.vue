<template lang="pug">
  main#Home
    #skipLinkTarget
      #intro
        p I'm a Product Manager, full-stack developer & UX designer.
        p I'm currently working on building the future of crowdfunding for FOSS at
          a(href="https://drips.network" target="_blank" rel="noopener noreferrer") drips.network
          |  in Berlin.
        br
        p This page used to host my portfolio. Unfortunately, Heroku deleted my blog database
          |  without warning (yes, really). I'm in the process of restoring everything and moving
          |  to a different host.
      transition(name='fade' mode="out-in")
        router-view
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';

import themeStore from '@/store/modules/theme/theme';
import Meta from '@/decorators/meta';
import setThemeColor from '@/util/setThemeColor';

@Component({
  name: 'Home',
})
export default class extends Vue {
  themeModule = getModule(themeStore, this.$store);

  async mounted() {
    setThemeColor(this.themeModule.currentTheme.background);
    if (this.$route.name === 'home') this.$router.push({ name: 'projects' });
  }

  get route() {
    return this.$route;
  }

  @Meta
  // eslint-disable-next-line class-methods-use-this
  metaConfig() {
    return {
      meta: [
        {
          name: 'description',
          content: 'Jason Efstathiou is a Proudct Owner, full-stack developer & UX designer from Berlin.',
        },
      ],
    };
  }
}
</script>

<style lang="sass" scoped>
#intro
  margin-top: 64px
  margin-bottom: 128px
  #haveALook
    margin-top: 64px
a
  text-decoration: underline
  cursor: pointer
</style>
