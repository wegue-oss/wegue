<template>
  <v-toolbar class="vt-webgis-tb">
      <v-toolbar-title>{{title}}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-side-icon class="hidden-md-and-up"></v-toolbar-side-icon>
      <v-toolbar-items class="hidden-sm-and-down">
        <v-btn flat>Link One</v-btn>
        <v-btn flat>Link Two</v-btn>
        <v-btn flat>Link Three</v-btn>
      </v-toolbar-items>
    </v-toolbar>
</template>

<script>

export default {
  name: 'app-header',
  props: {
    title: {type: String, required: false, default: ''}
  },
  data () {
    return {
    }
  },
  mounted () {
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

  .vt-webgis-tb {
    /*background-color: red;*/
    z-index: 1;
  }

</style>
