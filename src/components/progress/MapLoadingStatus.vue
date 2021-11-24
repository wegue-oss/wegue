<template>

  <v-progress-circular
    v-if="visible"
    class="wgu-maploading-status"
    :value="80"
    indeterminate
    color="secondary"
    >
  </v-progress-circular>

</template>

<script>

import { Mapable } from '../../mixins/Mapable';
import { Image as ImageSource, TileImage as TileImageSource,
  Vector as VectorSource, Cluster as ClusterSource } from 'ol/source/';
import LayerGroup from 'ol/layer/Group';

export default {
  name: 'wgu-maploading-status',
  mixins: [Mapable],
  data () {
    return {
      loading: 0,
      visible: false
    }
  },
  methods: {
    /**
     * This function is executed, after the map is bound (see mixins/Mapable)
     * and registers the current map layers.
     */
    onMapBound () {
      const me = this;
      me.registerLayers(me.map.getLayerGroup());
    },

    /**
     * Registers the needed events for the passed layer and takes care
     * of layer groups by calling itself recursively.
     *
     * @param  {ol/layer/Base | ol/layer/Group} layer Layer or group to register
     */
    registerLayers (layer) {
      const me = this;

      if (layer instanceof LayerGroup) {
        // call ourself recursively
        const layers = layer.getLayers();
        layers.forEach(function (child) {
          me.registerLayers(child);
        });
        // handle future changes to this group or stop doing so
        layers.on('add', me.onLayerAddedToGroup, me);
        layers.on('remove', me.onLayerRemovedFromGroup, me);
      } else {
        const source = layer.getSource();
        me.bindLoadHandlers(source, true);
        // reacting on a changed source in a layer
        layer.on('change:source', function (evt) {
          me.bindLoadHandlers(evt.target.getSource(), true);
          me.bindLoadHandlers(evt.oldValue, false);
        });
      }
    },

    /**
     * Registers needed events for the passed source and takes care
     * of sources which do not naturally support load events (`vector`-sources).
     *
     * @param  {ol/source/Source} source The layer source to register
     */
    bindLoadHandlers (source, register) {
      const me = this;
      let eventPrefix = '';
      const method = register ? 'on' : 'un';

      if (source instanceof ImageSource) {
        // includes ImageWms, also e.g. ImageArcGISRest, OSM …
        eventPrefix = 'image';
      } else if (source instanceof TileImageSource) {
        // includes TileWMS, Bing and more
        eventPrefix = 'tile';
      } else if (source instanceof VectorSource) {
        if (source instanceof ClusterSource) {
          source = source.getSource();
        }
        eventPrefix = 'vector';
      }

      if (eventPrefix) {
        source[method](eventPrefix + 'loadstart', me.incrementLoading, me);
        source[method](eventPrefix + 'loadend', me.decrementLoading, me);
        source[method](eventPrefix + 'loaderror', me.decrementLoading, me);
      }
    },

    /**
     * Called whenever loading of a layer starts.
     * This will increment the internal counter and show this loading indicator.
     */
    incrementLoading () {
      const me = this;
      me.loading++;
      me.visible = true;
    },

    /**
     * Called whenever loading stops or errors.
     * This will decrement the internal counter and if nothing is currently
     * loading the counter is reset and the loading indicator is hidden.
     */
    decrementLoading () {
      const me = this;
      me.loading--;

      if (me.loading <= 0) {
        me.visible = false;
        me.resetLoading();
      }
    },

    /**
     * Helper method to reset the internal loading counter.
     */
    resetLoading () {
      this.loading = 0;
    },

    /**
     * Takes care of added layers to any `ol/layer/Group`. These need to get
     * registered to the appropriate handlers.
     *
     * @param {ol/events/Event} evt The add event of the `ol/layer/Group`.
     */
    onLayerAddedToGroup: function (evt) {
      this.registerLayers(evt.element);
    },

    /**
     * Takes care of removed layers to any `ol/layer/Group`. These need to get
     * unregistered from the appropriate handlers.
     *
     * @param {ol/events/Event} evt The remove event of the `ol/layer/Group`.
     */
    onLayerRemovedFromGroup: function (evt) {
      this.registerLayers(evt.element);
    }
  }
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

  .v-progress-circular.wgu-maploading-status {
    position: fixed;
    bottom: 5em;
    right: 4em;
    z-index: 1;
  }

</style>
