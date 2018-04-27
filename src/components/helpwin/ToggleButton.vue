<template>

  <div class="">

    <v-btn icon @click="toggleUi">
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
      :left="left"
      :top="top"
    />

  </div>

</template>

<script>

import HelpWin from './HelpWin'

export default {
  name: 'wgu-toggle-helpwin-button',
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
      infoLinkText: 'More info',
      left: '300px',
      top: '300px'
    }
  },
  methods: {
    toggleUi () {
      // TODO move to a father class
      this.$refs.helpwin.show = !this.$refs.helpwin.show;
      this.show = this.$refs.helpwin.show;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

</style>
