<template>
  <v-toolbar class="wgu-app-toolbar">
      <v-toolbar-title>{{title}}</v-toolbar-title>
      <v-spacer></v-spacer>

      <!--This <slot> is going to be replaced by the toolbar buttons in the
          app configuration tags (see App.vue) -->
      <slot name="wgu-tb-buttons"></slot>
    </v-toolbar>
</template>

<script>

export default {
  name: 'wgu-app-header',
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

  .wgu-app-toolbar {
    /*background-color: red;*/
    z-index: 1;
  }

</style>
