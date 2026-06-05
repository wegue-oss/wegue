<template>
    <!-- Remarks:
    As we need none of the responsive functionality of v-img, we use a simple
    HTML img to stop the component from flickering when the image is re-requested.
    -->
    <img v-if="legendURL" :src="legendURL">
</template>

<script>
import LayerLegend from '@/util/LayerLegend';

/**
 * Component rendering a legend image for a layer.
 * It reacts to:
 *  - map view resolution changes
 *  - layer source changes (e.g. WMS params updates)
 */
export default {
  name: 'wgu-layerlegendimage',
  props: {
    mapView: { type: Object, required: true },
    layer: { type: Object, required: true }
  },
  data () {
    return {
      resolution: this.mapView.getResolution(),
      viewResolutionChanged: undefined,
      sourceRevision: 0,
      sourceChanged: undefined
    }
  },
  /**
   * Register event listeners.
   */
  created () {
    this.registerViewResolutionChanged(this.mapView);
    this.registerSourceChanged(this.layer?.getSource());
  },
  /**
   * Unregister event listeners.
   */
  unmounted () {
    this.unregisterViewResolutionChanged(this.mapView);
    this.unregisterSourceChanged(this.layer?.getSource());
  },
  methods: {
    /**
     * Registers a listener for map view resolution changes.
     */
    registerViewResolutionChanged (view) {
      if (!view) return;

      this.viewResolutionChanged = (event) => {
        this.resolution = event.target.getResolution();
      };

      view.on('change:resolution', this.viewResolutionChanged);
    },
    /**
     * Unregisters the resolution change listener.
     */
    unregisterViewResolutionChanged (view) {
      if (view && this.viewResolutionChanged) {
        view.un('change:resolution', this.viewResolutionChanged);
      }
    },
    /**
     * Registers a listener for source changes.
     */
    registerSourceChanged (source) {
      if (!source) return;

      this.sourceChanged = () => {
        this.sourceRevision++;
      };

      source.on('change', this.sourceChanged)
    },
    /**
     * Unregisters the source change listener.
     */
    unregisterSourceChanged (source) {
      if (source && this.sourceChanged) {
        source.un('change', this.sourceChanged);
      }
    }
  },
  computed: {
    /**
     * Returns a URL to the layers legend image.
     */
    legendURL () {
      // Remarks: No-op to force dependency tracking on the sourceRevision
      //  counter to recompute the legendURL whenever the source changes.
      const trackRevision = () => { return this.sourceRevision };
      trackRevision();

      const legendUtil = new LayerLegend(this.$appConfig?.legend);
      const options = {
        language: this.$i18n.locale,
        ...this.layer.get('legendOptions')
      };
      return legendUtil.getUrl(
        this.layer.toRaw(), this.resolution, options,
        this.layer.get('legendUrl'));
    }
  },
  watch: {
    /**
     * Reacts to layer replacement and rebinds source listeners.
     */
    layer: {
      handler (newLayer, oldLayer) {
        const newSource = newLayer?.getSource?.();
        const oldSource = oldLayer?.getSource?.();

        if (newSource !== oldSource) {
          this.unregisterSourceChanged(oldSource);
          this.registerSourceChanged(newSource);
        }
      }
    }
  }
};
</script>
