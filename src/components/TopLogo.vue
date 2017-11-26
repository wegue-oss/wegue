<template>

  <v-avatar
     :tile="true"
     size="12"
     class="grey lighten-4 wgu-top-logo"
   >
     <img v-bind:src="logoSrc" alt="top-logo">
   </v-avatar>

</template>

<script>

export default {
  name: 'wgu-top-logo',
  props: {
    logoSrc: {type: String, required: true}
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

  .wgu-top-logo {
    position: absolute;
    left: 25px;
    top: 50px;
    z-index: 1;
    padding: 5px;
  }

</style>
