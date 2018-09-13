<template>

  <v-dialog v-model="show" max-width="300" :hide-overlay="false">

    <v-btn icon slot="activator" dark>
      <v-icon medium>{{icon}}</v-icon>
      {{text}}
    </v-btn>

    <wgu-helpwin
      ref="helpwin"
      :icon="icon"
      :headline="headline"
      :content="content"
      :infoLink="infoLink"
      :infoLinkText="infoLinkText"
      v-on:winxclose="show=false"
    />

  </v-dialog>

</template>

<script>

import HelpWin from './HelpWin'

export default {
  name: 'wgu-helpwin-btn',
  components: {
    'wgu-helpwin': HelpWin
  },
  data: function () {
    return {
      show: false,
      icon: 'help',
      text: '',
      headline: 'About Wegue',
      content: '<h3>WebGIS with OpenLayers and Vue.js</h3> Template and re-usable components for webmapping applications with OpenLayers and Vue.js',
      infoLink: 'https://github.com/meggsimum/wegue',
      infoLinkText: 'More info'
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
