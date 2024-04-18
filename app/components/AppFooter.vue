<template>

  <v-footer color="primary" class="onprimary--text" app>
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
    footerTextLeft: { type: String, required: true },
    footerTextRight: { type: String, required: true },
    showCopyrightYear: { type: Boolean, required: false, default: true }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

  /* vuetify breakpoint xs */
  @media only screen and (max-width: 600px) {
    .v-footer {
      font-size: 14px;
    }
  }
  /* avoid special color for links in footer */
  .v-footer a {
    color: inherit !important;
  }

</style>
