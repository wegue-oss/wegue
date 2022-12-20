<template>
  <!-- Show layer details -->
  <v-list-group
    v-if="showDetails"
    v-model="open"
    class="text--primary"         
    >
    <template v-slot:activator>
      <v-list-item-action>
        <v-checkbox
          color="secondary"
          hide-details
          :input-value="layer.getVisible()"
          @click.capture.stop="onItemClick()"   
        />
      </v-list-item-action> 
      <v-list-item-title>
        {{ layer.get('name') }}
      </v-list-item-title>
    </template>
    <v-list-item 
      v-if="showOpacityControl" 
      class="overflow-visible"
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
      <wgu-layerlegendimage v-if="open"
        :layer="layer"
        :mapView="mapView"
      />
    </v-list-item>
  </v-list-group>

  <!-- Simple layer entry -->
  <v-list-item 
    v-else
    class="wgu-layerlist-item" 
    >
    <v-list-item-action>
      <v-checkbox
        color="secondary"
        hide-details
        :input-value="layer.getVisible()"
        @click.capture.stop="onItemClick(layer)"
      />
    </v-list-item-action>
    <v-list-item-content>
      <v-list-item-title>
        {{ layer.get('name') }}
      </v-list-item-title>
    </v-list-item-content>
  </v-list-item>
</template>

<script>
import LayerLegendImage from './LayerLegendImage'
import LayerOpacityControl from './LayerOpacityControl'

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
    showOpacityControls: { type: Boolean, required: true }
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
