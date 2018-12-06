<template>

  <v-card class="wgu-helpwin">
    <v-toolbar class="red darken-3 white--text" dark>
      <v-toolbar-side-icon><v-icon>{{ icon }}</v-icon></v-toolbar-side-icon>
      <v-toolbar-title>{{ title }}</v-toolbar-title>
      <v-spacer></v-spacer>
      <v-toolbar-side-icon @click="onWinXClose"><v-icon>close</v-icon></v-toolbar-side-icon>
    </v-toolbar>

    <v-card-title primary-title>
      <div>
        <h3 class="headline mb-0">{{ headline }}</h3>
        <div class="">
          <span v-html="content"></span>
        </div>
      </div>
    </v-card-title>

    <v-card-actions>
      <a class="info-link red--text darken3"
        :href="infoLink" target="_blank">{{ infoLinkText }}</a>
    </v-card-actions>
  </v-card>

</template>

<script>
  export default {
    props: {
      icon: {type: String, required: false, default: 'help'},
      title: {type: String, required: false, default: 'About'},
      headline: {type: String, required: false, default: 'About Wegue'},
      content: {type: String, required: false, default: '<h3>WebGIS with OpenLayers and Vue.js</h3> Template and re-usable components for webmapping applications with OpenLayers and Vue.js'},
      infoLink: {type: String, required: false, default: 'https://github.com/meggsimum/wegue'},
      infoLinkText: {type: String, required: false, default: 'More info'}
    },
    data () {
      return {
        show: false
      }
    },
    methods: {
      onWinXClose: function () {
        this.$emit('winxclose');
      }
    }
  }
</script>

<style>

</style>
