<template>
  <div>
    <!-- Logo content maybe either avatar and/or text -->
    <v-avatar
       v-if="logoSrc"
       :size="logoSize"
       :tile="true"
       class="wgu-app-logo"
      >
      <img :src="logoSrc" alt="App Logo">
    </v-avatar>

    <div
       v-if="logoText"
       class="wgu-app-logo"
      >
      <span v-html="logoText"/>
    </div>
  </div>

</template>

<script>

export default {
  name: 'wgu-app-logo',
  data () {
    return {
      logoSrc: this.$appConfig.logo,
      logoSize: this.$appConfig.logoSize,
      logoText: this.$appConfig.logoText
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

  .v-avatar.v-avatar--tile.wgu-app-logo, div.wgu-app-logo {
    position: absolute;
    z-index: 2;
  }

</style>
