<template>

  <div class="">

    <v-btn icon @click="onClick">
      <v-icon medium>{{icon}}</v-icon>
      {{text}}
    </v-btn>

  </div>

</template>

<script>

import { Mapable } from '../../mixins/Mapable';

export default {
  name: 'wgu-zoomtomaxextent-button',
  mixins: [Mapable],
  props: {
    icon: {type: String, required: false},
    text: {type: String, required: false}
  },
  methods: {
    onClick () {
      // derive correct initial zoom and center
      const initialCenter = this.$appConfig.mapCenter;
      const initalZoom = this.$appConfig.mapZoom
      this.map.getView().setCenter(initialCenter);
      this.map.getView().setZoom(initalZoom);
    }
  }
}

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
