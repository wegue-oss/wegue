<template>
  <v-img
     v-if="!!logoSrc"
     :src="logoSrc"
     :width="logoWidth"
     :height="logoHeight"
     :alt="$t('app.logo')"
     class="position-absolute wgu-app-logo"
     cover
  >
  </v-img>
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
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

  .v-avatar.wgu-app-logo {
    position: absolute;
    z-index: 2;
  }

</style>
