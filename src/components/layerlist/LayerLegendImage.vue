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
 * Module for one legend element.
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
      viewResolutionChanged: undefined
    }
  },
  /**
   * Register for an event to update the legend on resolution change.
   */
  created () {
    const viewResolutionChanged = function (event) {
      this.resolution = event.target.getResolution();
    }.bind(this);

    this.mapView.on('change:resolution', viewResolutionChanged);
    this.viewResolutionChanged = viewResolutionChanged;
  },
  /**
   * Unregister the event fired on resolution change.
   */
  unmounted () {
    if (this.viewResolutionChanged) {
      this.mapView.un('change:resolution', this.viewResolutionChanged);
    }
  },
  computed: {
    /**
     * Returns a URL to the layers legend image.
     */
    legendURL () {
      const legendUtil = new LayerLegend(this.$appConfig?.legend);
      const options = {
        language: this.$i18n.locale,
        ...this.layer.get('legendOptions')
      };
      return legendUtil.getUrl(
        this.layer, this.resolution, options, this.layer.get('legendUrl'));
    }
  }
};
</script>
