<template>
    <v-badge overlap color="blue">
          <template v-slot:badge v-if="filteredFeatures.length > 0">
            <span>{{filteredFeatures.length}}</span>
          </template>
          <v-menu 
            :close-on-content-click="false" 
            :close-on-click="true"
            :nudge-left="250"  offset-x offset-y>
              <v-btn icon dark slot="activator">
              <v-icon medium>{{icon}}</v-icon>
              </v-btn>
              <wgu-search-items v-on:filterUpdated="updateBadgeNumber"> </wgu-search-items>
          </v-menu>
    </v-badge>
</template>

<script>
import SearchItems from './SearchItems'
import { WguEventBus } from '../../WguEventBus'

export default {
  name: 'wgu-searchitems-btn',
  components: {
    'wgu-search-items': SearchItems
  },
  props: {
    icon: {type: String, required: false, default: 'filter_alt'}
  },
  data () {
    return {
      filteredFeatures: []
    }
  },
  created () {
    var me = this;
    WguEventBus.$on('ol-map-mounted', olMap => {
      me.map = olMap;
    });
  },
  methods: {
    zoomToDataExtend () {
      let me = this;
      let itemLayer = me.map.getLayers().getArray().filter(layer => layer.get('lid') === 'Verkaufsstellen')[0];

      let actualExtent = itemLayer.getSource().getExtent();
      me.map.getView().fit(actualExtent, {
        duration: 1600,
        padding: [50, 50, 50, 50]
      });
    },
    updateBadgeNumber (selectedObjects) {
      let me = this;
      me.filteredFeatures = selectedObjects;
      me.$emit('filterUpdatedToMain', selectedObjects);
    }
  }
}
</script>

<style>

</style>