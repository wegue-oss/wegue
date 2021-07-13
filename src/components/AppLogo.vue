<template>

  <v-avatar
     v-if="!!logoSrc"
     :width="logoWidth"
     :height="logoHeight"
     :tile="true"
     class="wgu-app-logo"
    >
    <img :src="logoSrc" :alt="$t('app.logo')">
  </v-avatar>

</template>

<script>

export default {
  name: 'wgu-app-logo',
  data () {
    return {
      logoSrc: this.$appConfig.logo,
      logoSize: this.$appConfig.logoSize,
      logoWidth: this.$appConfig.logoWidth,
      logoHeight: this.$appConfig.logoHeight
    }
  },
  created () {
    // for backwards compat we use logoSize if width and height are missing
    if (this.logoSize && !this.logoWidth && !this.logoHeight) {
      this.logoWidth = this.logoSize;
      this.logoHeight = this.logoSize;
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
