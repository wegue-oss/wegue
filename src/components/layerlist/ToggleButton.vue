<template>

  <div class="">

    <v-btn icon @click="toggleUi">
      <v-icon>{{icon}}</v-icon>
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
      // TODO check how to call the super method
      this.show = !this.show;
      // forward property 'show' to window child componnet
      this.$refs.layerlist.show = this.show;
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
