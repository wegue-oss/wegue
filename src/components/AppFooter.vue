<template>

  <v-footer :color="color" class="white--text" app>
    <span class="wgu-footer-left" v-html="footerTextLeft"></span>
    <v-spacer></v-spacer>
    <div class="wgu-footer-right">
      <span v-html="footerTextRight"></span>
      <span v-if="showCopyrightYear" >&copy; {{ new Date().getFullYear() }}</span>
    </div>
  </v-footer>

</template>

<script>

export default {
  name: 'wgu-app-footer',
  props: {
    color: {type: String, required: false, default: 'red darken-3'},
    footerTextLeft: {type: String, required: false, default: 'Powered by <a href="https://meggsimum.de/wegue/" target="_blank">Wegue WebGIS</a>'},
    footerTextRight: {type: String, required: false, default: 'meggsimum'},
    showCopyrightYear: {type: Boolean, required: false, default: true}
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
