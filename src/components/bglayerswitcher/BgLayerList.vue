<template>
  <v-sheet elevation="8">
    <v-slide-group ref="slideGroup"
      mandatory
      show-arrows
      class="pa-1"
      selected-class="bg-secondary"
      @update:modelValue="onSelectLayer"
      :model-value="selectedLid"
    >
      <v-slide-group-item
        v-for="layer in displayedLayers"
        :key="layer.get('lid')"
        :value="layer.get('lid')"
        v-slot:default="{ toggle, selectedClass }"
      >
        <v-card
          hover
          :width="imageWidth"
          :class="['ma-1', selectedClass]"
          @click="toggle"
          @keyup.enter="toggle"
        >
          <wgu-layerpreviewimage
            :layer="layer"
            :mapView="map.getView()"
            :width="imageWidth"
            :height="imageHeight"
            :previewIcon="previewIcon"
          />
          <v-card-title class="pt-3">
            <span class="d-inline-block text-truncate text-caption font-weight-regular">
              {{ layer.get('name') }}
            </span>
          </v-card-title>
        </v-card>
      </v-slide-group-item>
    </v-slide-group>
  </v-sheet>
</template>

<script>
import { useMap } from '@/composables/Map';
import LayerPreviewImage from './LayerPreviewImage.vue';

export default {
  name: 'wgu-bglayerlist',
  components: {
    'wgu-layerpreviewimage': LayerPreviewImage
  },
  props: {
    imageWidth: { type: Number, required: true },
    imageHeight: { type: Number, required: true },
    previewIcon: { type: String, required: true }
  },
  setup () {
    const { map, layers } = useMap();
    return { map, layers };
  },
  methods: {
    /**
     * Handler for click on item in layer list:
     * Set the selected background layer to visible and hide all other background layers.
     * @param  {Object} selLid  ID of layer selected by the user
     */
    onSelectLayer (selLid) {
      const selLayer = this.displayedLayers.find(layer => layer.get('lid') === selLid);
      selLayer.setVisible(true);
      this.displayedLayers
        .filter(layer => layer !== selLayer)
        .forEach(layer => {
          layer.setVisible(false);
        });
    }
  },
  computed: {
    /**
     * Reactive property to return the OpenLayers layers marked as 'isBaseLayer'.
     */
    displayedLayers () {
      return this.layers
        .filter(layer => layer.get('isBaseLayer'))
        .reverse();
    },
    /**
     * Reactive property to return the currently visible OpenLayers background layer ID.
     * To disambiguate multiple selected background layers - which may occur programmatically -
     * this returns the first in the list of background layers.
     */
    selectedLid () {
      return this.displayedLayers.find(layer => layer.getVisible())?.get('lid');
    }
  }
};
</script>
