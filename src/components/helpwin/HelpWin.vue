<template>
  <wgu-module-card v-bind="$attrs"
      :moduleName="moduleName"
      class="wgu-helpwin" 
      :icon="icon" 
      :title="windowTitle"
      max-width="300">
    <v-card-title primary-title>
      <div>
        <h3 class="headline mb-0" v-if="textTitle">{{ textTitle }}</h3>
      </div>
    </v-card-title>
    <v-card-text>
      <div class="text--primary" v-html="htmlContent">
      </div>
    </v-card-text>

    <v-card-actions>
      <a class="info-link red--text darken3"
        :href="infoLinkUrl" target="_blank" v-if="infoLinkUrl">
        {{ infoLinkText || infoLinkUrl }}
        </a>
    </v-card-actions>
  </wgu-module-card>
</template>

<script>
  import ModuleCard from './../modulecore/ModuleCard';

  export default {
    name: 'wgu-helpwin-win',
    inheritAttrs: false,
    components: {
      'wgu-module-card': ModuleCard
    },
    props: {
      icon: {type: String, required: false, default: 'help'}
    },
    data () {
      let config = this.$appConfig.modules['wgu-helpwin'] || {};
      return {
        moduleName: 'wgu-helpwin',
        // TODO change this to 'title' property for conformance
        windowTitle: config.windowTitle || 'About',
        textTitle: config.textTitle || 'About Wegue',
        htmlContent: config.htmlContent || '<h3>WebGIS with OpenLayers and Vue.js</h3>',
        infoLinkUrl: config.infoLinkUrl || 'https://github.com/meggsimum/wegue',
        infoLinkText: config.infoLinkText || 'More info'
      }
    }
  }
</script>

<style>
</style>
