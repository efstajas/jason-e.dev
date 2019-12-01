<template lang="pug">
  div#Error
    h1 Error 404
    p Sorry, but it looks like you found a dead link.
</template>

<script lang="ts">
import { Component, Vue } from 'vue-property-decorator';
import Meta from '@/decorators/meta';

@Component({
  name: 'Error',
})
export default class extends Vue {
  @Meta
  // eslint-disable-next-line class-methods-use-this
  metaConfig() {
    return {
      meta: [
        {
          name: 'robots',
          content: 'noindex',
        },
      ],
    };
  }
}
</script>

<style scoped lang="sass" src="./Error.sass">
