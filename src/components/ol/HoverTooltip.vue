<!-- 
  The following template is Wegue's default hover tooltip.
  It will be displayed dynamically by HoverController.js.
-->
<template>
  <wgu-map-overlay
    overlayId="wgu-hover-tooltip"
    :visible=false
    autoPan
    :autoPanDuration="250"
    positioning="top-center"
    :offset="[0, 20]"
  >
    <v-sheet slot-scope="{feature, hoverAttribute}" v-if="feature" 
    class="pa-2 text-center" max-width=200 >
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
  }
}
</script>
