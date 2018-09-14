<template>

  <v-avatar
     :size="logoSize"
     :tile="true"
     class="wgu-app-logo"
    >
    <img :src="logoSrc" alt="App Logo">
  </v-avatar>

</template>

<script>

export default {
  name: 'wgu-app-logo',
  data () {
    return {
      logoSrc: this.$appConfig.logo,
      logoSize: this.$appConfig.logoSize
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

  .v-avatar.v-avatar--tile.wgu-app-logo {
    position: absolute;
    z-index: 2;
  }

</style>
