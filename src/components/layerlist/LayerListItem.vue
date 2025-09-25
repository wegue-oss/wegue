<template>
  <!-- Show layer details -->
  <v-list-group
    v-if="showDetails"
    :value="layerLid"
    class="text--primary wgu-layerlist-listgroup"
    >
    <template v-slot:activator="{ props }">
      <v-list-item
        v-bind="props"
        :title="layer.get('name')"
        >
        <template v-slot:prepend>
          <v-checkbox-btn
            color="secondary"
            :model-value="layer.getVisible()"
            @click.capture.stop="onItemClick()"
            class="pr-2"
          />
        </template>
      </v-list-item>
    </template>
    <v-list-item
      v-if="showOpacityControl"
    >
      <wgu-layeropacitycontrol
        :layer="layer"
      />
    </v-list-item>
    <v-list-item
      v-if="showLegend"
    >
      <!-- Remarks:
      The legend image item is wrapped by an v-if block to avoid unneccesary image
      requests when the layer item is not expanded.
      -->
      <wgu-layerlegendimage class="pl-2"
        v-if="openedListItems.includes(layerLid)"
        :layer="layer"
        :mapView="mapView"
      />
    </v-list-item>
  </v-list-group>

  <!-- Simple layer entry -->
  <v-list-item
    v-else
    :title="layer.get('name')"
    class="wgu-layerlist-item"
    >
    <template v-slot:prepend>
      <v-list-item-action start>
        <v-checkbox-btn
          color="secondary"
          :model-value="layer.getVisible()"
          @click.capture.stop="onItemClick()"
        />
      </v-list-item-action>
    </template>
  </v-list-item>
</template>

<script>
import LayerLegendImage from './LayerLegendImage';
import LayerOpacityControl from './LayerOpacityControl';

export default {
  name: 'wgu-layerlistitem',
  components: {
    'wgu-layerlegendimage': LayerLegendImage,
    'wgu-layeropacitycontrol': LayerOpacityControl
  },
  data () {
    return {
      open: false
    }
  },
  props: {
    layer: { type: Object, required: true },
    mapView: { type: Object, required: true },
    showLegends: { type: Boolean, required: true },
    showOpacityControls: { type: Boolean, required: true },
    openedListItems: { types: Array, required: true }
  },
  methods: {
    /**
     * Handler for click on layer item, toggles the layer`s visibility.
     */
    onItemClick () {
      this.layer.setVisible(!this.layer.getVisible());
    }
  },
  computed: {
    layerLid () {
      return this.layer.get('lid');
    },
    /**
     * Returns true, if the layer item should show an extension slider with layer details.
     */
    showDetails () {
      return this.showLegend || this.showOpacityControl;
    },
    /**
     * Returns true, if the layer item should show a legend image.
     */
    showLegend () {
      return this.showLegends && !!this.layer.get('legend');
    },
    /**
     * Returns true, if the layer item should show an opacity control.
     */
    showOpacityControl () {
      return this.showOpacityControls && !!this.layer.get('opacityControl');
    }
  }
};
</script>
