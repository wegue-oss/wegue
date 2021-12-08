<!-- 
  The following template is Wegue's default hover tooltip.
  It will be displayed dynamically by HoverController.js.
-->
<template>
  <wgu-map-overlay v-bind="$attrs"
    overlayId="wgu-hover-tooltip"
    v-on:update-overlay="update"
  >
    <v-sheet v-if="feature" class="pa-2">
      {{ feature.get(hoverAttribute) }}
    </v-sheet>
  </wgu-map-overlay>
</template>

<script>
import MapOverlay from '../modulecore/MapOverlay.vue'
export default {
  name: 'wgu-hover-tooltip',
  components: {
    'wgu-map-overlay': MapOverlay
  },
  inheritAttrs: false,
  // props: {
  //   feature: { type: Object, required: true },
  //   hoverAttribute: { type: String, required: true }
  // },
  data () {
    return {
      feature: null,
      hoverAttribute: null
    }
  },
  methods: {
    /**
     * Update the content of the tooltip.
     */
    update (data) {
      this.feature = data.feature;
      this.hoverAttribute = data.hoverAttribute;
    }
  }
}
</script>