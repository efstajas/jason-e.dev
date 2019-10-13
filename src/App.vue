<template lang="pug">
  div#app
    #mainContainer
      router-view
</template>

<style lang="sass">
@import './styles/global/typography.sass'
body
  margin: 0
  #app
    #mainContainer
      margin: 24px
</style>
