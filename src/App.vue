<template lang="pug">
  div#app
    StoreThemer
      #mainContainer
        Sidebar(
          :goHomeEnabled="!isHomepage"
        )#sidebar
        transition(name='fade' mode="out-in")
          router-view#content
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Sidebar from '@/components/Sidebar';
import StoreThemer from '@/components/StoreThemer';

@Component({
  name: 'App',
  components: {
    Sidebar,
    StoreThemer,
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
      background-color: var(--background)
      transition: background-color .3s
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
          border-right: 2px solid var(--foreground)
          transition: border .3s
        #content
          grid-area: content
.fade-enter-active, .fade-leave-active
  transition: opacity .3s
.fade-enter, .fade-leave-to
  opacity: 0
</style>
