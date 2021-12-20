<template>
  <v-btn icon color="onprimary" @click="onClick"
    :title="$t('wgu-zoomtomaxextent.title')">
    <v-icon medium>{{icon}}</v-icon>
  </v-btn>
</template>

<script>

import { Mapable } from '../../mixins/Mapable';
import ViewAnimationUtil from '../../util/ViewAnimation';

export default {
  name: 'wgu-zoomtomaxextent-btn',
  mixins: [Mapable],
  props: {
    icon: { type: String, required: false, default: 'zoom_out_map' }
  },
  methods: {
    onClick () {
      // derive correct initial zoom and center
      const initialCenter = this.$appConfig.mapCenter;
      const initalZoom = this.$appConfig.mapZoom;
      ViewAnimationUtil.to(this.map.getView(), initialCenter, null, {
        zoom: initalZoom,
        maxZoom: initalZoom
      });
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
