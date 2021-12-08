<!-- 
  The following template is Wegue's default hover tooltip.
  It will be displayed dynamically by HoverController.js.
-->
<template>
  <wgu-map-overlay v-bind="$attrs"
    overlayId="wgu-hover-tooltip"
  >
    <v-sheet slot-scope="{feature, hoverAttribute}" v-if="feature" class="pa-2">
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
  inheritAttrs: false
}
</script>