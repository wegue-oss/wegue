<template>

  <div class="">

    <v-btn icon @click="toggleUi">
      <v-icon medium>{{icon}}</v-icon>
      {{text}}
    </v-btn>

    <wgu-layerlist
      ref="layerlist"
      :icon="icon"
      :left="left"
      :top="top"
    />

  </div>

</template>

<script>

import LayerListWin from './LayerList'

export default {
  name: 'v-webgis-toggle-layerlist-button',
  components: {
    'wgu-layerlist': LayerListWin
  },
  data: function () {
    return {
      show: false,
      icon: 'layers',
      text: '',
      left: '30px',
      top: '30px'
    }
  },
  methods: {
    toggleUi () {
      // TODO move to a father class
      this.$refs.layerlist.show = !this.$refs.layerlist.show;
      this.show = this.$refs.layerlist.show;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
