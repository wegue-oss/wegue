<template>
  <wgu-module-card v-bind="$attrs"
      :moduleName="moduleName"
      class="wgu-helpwin" 
      :icon="icon"
      :title="title"
      :width="width">
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
      icon: {type: String, required: false, default: 'help'},
      title: {type: String, required: false, default: 'About'},
      textTitle: {type: String, required: false, default: 'About Wegue'},
      htmlContent: {type: String, required: false, default: '<h3>WebGIS with OpenLayers and Vue.js</h3>'},
      infoLinkUrl: {type: String, required: false, default: 'https://github.com/meggsimum/wegue'},
      infoLinkText: {type: String, required: false, default: 'More info'},
      width: {type: Number, required: false, default: 300}
    },
    data () {
      return {
        moduleName: 'wgu-helpwin'
      }
    }
  }
</script>

<style scoped>
  /* TODO 
    Generalize the positioning concept for windows,
    this interferes with positioning and draggable settings in the app.conf */
  .wgu-helpwin.wgu-floating {
    left: 50% !important;
    top: 50% !important;
    transform: translate(-50%, -50%);
  }
</style>
