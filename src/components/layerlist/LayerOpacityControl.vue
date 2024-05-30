<template>
  <v-slider
    color="secondary"
    prepend-icon="md:opacity"
    :model-value="layer.getOpacity()"
    min="0"
    max="1"
    step="0.01"
    thumb-label
    hide-details
    @update:model-value="onOpacitySliderInput"
    >
  </v-slider>
</template>

<script>
export default {
  name: 'wgu-layeropacitycontrol',
  props: {
    layer: { type: Object, required: true }
  },
  methods: {
    /**
     * Handler for input on the opacity slider, updates the layer`s opacity.
     */
    onOpacitySliderInput (value) {
      this.layer.setOpacity(value);
    }
  }
}
</script>
