<template lang="pug">
  div#app
    StoreThemer
      #mainContainer(:class="{ loading: loadingModule.isLoading }")
        Sidebar(
          :goHomeEnabled="!isHomepage"
        )#sidebar
        transition(
          name='fade'
          mode="out-in"
          @after-leave="$root.$emit('triggerScroll')"
        )
          router-view(:key="$route.params.slug")#content
      Themer(
        :theme="themeModule.defaultTheme"
        v-if="!$route.meta.hideFooter"
      )#footerContainer
        #footerContent
          transition(
            name='fade'
            mode="out-in"
          )
            router-view(:key="$route.params.slug" name="footer")
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import { getModule } from 'vuex-module-decorators';

import Sidebar from '@/components/Sidebar';
import StoreThemer from '@/components/StoreThemer';
import Themer from '@/components/Themer';
import themeStore from '@/store/modules/theme/theme';
import loadingStore from '@/store/modules/loading/loading';

@Component({
  name: 'App',
  components: {
    Sidebar,
    StoreThemer,
    Themer,
  },
  metaInfo: {
    title: 'Projects',
    titleTemplate: '%s | Jason Efstathiou',
  },
})
export default class extends Vue {
  themeModule = getModule(themeStore, this.$store);

  loadingModule = getModule(loadingStore, this.$store);

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
    background-color: black
    #mainContainer, #footerContainer
      display: grid
      grid-template-columns: 256px auto
      grid-template-rows: auto
      grid-column-gap: 64px
      @media(max-width: $tablet)
        grid-template-columns: auto
        grid-template-rows: minmax(min-content, max-content) auto
    #mainContainer
      grid-template-areas: "sidebar content"
      min-height: 100vh
      padding: 24px 16px 128px 16px
      box-sizing: border-box
      background-color: var(--background)
      transition: background-color .3s
      &.loading
        animation: loading .6 1s infinite
      @media(max-width: $tablet)
        grid-template-areas: "menu" "content"
        #sidebar
          grid-area: menu
          margin-bottom: 32px
        #content
          grid-area: content
        #footer
          grid-area: footer
      @media(min-width: $tablet)
        #sidebar
          grid-area: sidebar
          border-right: 2px solid var(--foreground)
          transition: border .3s
        #content
          grid-area: content
    #footerContainer
      grid-template-areas: ". footerContent"
      background-color: var(--background)
      min-height: 256px
      padding: 128px 16px
      @media(max-width: $tablet)
        grid-template-areas: "footerContent footerContent"
      #footerContent
        grid-area: footerContent
.fade-enter-active, .fade-leave-active
  transition: opacity .3s
.fade-enter, .fade-leave-to
  opacity: 0

@keyframes loading
  0%
    background-color: var(--background)
  50%
    background-color: var(--level1)
    opacity: .5
  100%
    background-color: var(--background)
</style>
