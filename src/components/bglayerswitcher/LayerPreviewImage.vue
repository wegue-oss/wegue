<template>
  <v-img
      :src="previewURL"
      :width="width" :height="height"
      v-on:load="imgLoaded=true"
      v-on:error="imgLoaded=false"
      >
      <!-- Fallback if no preview image is available or the image can't be loaded. -->
      <v-layout v-if="!previewURL || !imgLoaded"
        fill-height align-center justify-center>
        <v-icon x-large>{{previewIcon}}</v-icon>
      </v-layout>
  </v-img>
</template>

<script>
import LayerPreview from '../../util/LayerPreview';

export default {
  name: 'wgu-layerpreviewimage',
  props: {
    mapView: { type: Object, required: true },
    layer: { type: Object, required: true },
    width: { type: Number, required: true },
    height: { type: Number, required: true },
    previewIcon: { type: String, required: true }
  },
  data () {
    return {
      imgLoaded: false
    }
  },
  computed: {
    /**
     * Returns an URL to the layers preview image.
     */
    previewURL () {
      return this.layer.get('previewImage') || LayerPreview.getUrl(
        this.layer,
        this.mapView.getCenter(),
        this.mapView.getResolution(),
        this.mapView.getProjection()
      );
    }
  }
};
</script>
