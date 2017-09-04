<template>

  <v-avatar
     :tile="true"
     size="12"
     class="grey lighten-4 v-webgis-top-logo"
   >
     <img v-bind:src="logoSrc" alt="avatar">
   </v-avatar>

</template>

<script>

export default {
  name: 'v-webgis-top-logo',
  props: {
    logoSrc: {type: String, required: true}
  },
  mounted () {
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

  .v-webgis-top-logo {
    position: absolute;
    left: 25px;
    top: 50px;
    z-index: 1;
    padding: 5px;
  }

</style>
