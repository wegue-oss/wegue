<!-- 
  The following template is Wegue's default hover tooltip.
  It will be created dynamically by HoverController.js.
-->
<template>
  <v-sheet class="pa-2">
    {{ feature.get(hoverAttribute) }}
  </v-sheet>
</template>

<script>
export default {
  name: 'wgu-hover-tooltip',
  props: {
    feature: { type: Object, required: true },
    hoverAttribute: { type: String, required: true }
  }
}
</script>