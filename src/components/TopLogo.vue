<template>

  <v-avatar
     :size={logoSize}
     tile="false"
     class="wgu-top-logo"
    >
    <img src="http://via.placeholder.com/100x100?text=A%20Logo" alt="App Logo">
  </v-avatar>

</template>

<script>

export default {
  name: 'wgu-top-logo',
  props: {
    logoSrc: {type: String, required: true},
    logoSize: {type: Number, required: false}
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

  .wgu-top-logo {
    position: absolute;
    z-index: 1000;
    border: 2px solid white;
  }

</style>
