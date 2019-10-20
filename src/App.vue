<template lang="pug">
  div#app
    Themer#mainContainer
      Sidebar(
        :goHomeEnabled="!isHomepage"
      )#sidebar
      router-view#content
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Sidebar from '@/components/Sidebar';
import Themer from '@/components/Themer';

@Component({
  name: 'App',
  components: {
    Sidebar,
    Themer,
  },
})
export default class extends Vue {
  get isHomepage(): boolean {
    return this.$route.name === 'home';
  }
}
</script>

<style lang="sass">
@import './styles/global/typography.sass'
@import './styles/global/breakpoints.sass'

body
  margin: 0
  #app
    #mainContainer
      display: grid
      grid-template-columns: 256px auto
      grid-template-rows: auto
      grid-column-gap: 64px
      grid-template-areas: "sidebar content"
      min-height: 100vh
      padding: 24px 16px
      box-sizing: border-box
      @media(max-width: $tablet)
        grid-template-columns: auto
        grid-template-rows: minmax(min-content, max-content) auto
        grid-template-areas: "menu" "content"
        #sidebar
          grid-area: menu
        #content
          grid-area: content
      @media(min-width: $tablet)
        #sidebar
          grid-area: sidebar
          border-right: 2px solid black
        #content
          grid-area: content
</style>
