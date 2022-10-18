<template>

  <v-list expand>
    <template v-for="layer in displayedLayers">

      <!-- Show layer details -->
      <v-list-group
          v-if="showDetails(layer)"
          :value="false"
          :key="layer.lid"
          >
          <template v-slot:activator>
            <v-list-item-action>
              <v-checkbox
                color="secondary"
                hide-details
                :input-value="layer.getVisible()"
                @click.capture.stop="onItemClick(layer)"   
              />
            </v-list-item-action> 
            <v-list-item-title>
              {{ layer.get('name') }}
            </v-list-item-title>
          </template>
          
          <v-list-item>
            <wgu-layerlegendimage
              :layer="layer"
              :mapView="map.getView()"
            />
          </v-list-item>
        </v-list-group>

        <!-- Simple layer entry -->
        <v-list-item 
           v-if="!showDetails(layer)"
           class="wgu-layerlist-item" 
          :key="layer.lid" 
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
  </v-list> 
</template>

<script>
  import { Mapable } from '../../mixins/Mapable';
  import LayerLegendImage from './LayerLegendImage'
  
  export default {
    name: 'wgu-layerlist',
    components: {
      'wgu-layerlegendimage': LayerLegendImage
    },
    mixins: [Mapable],
    props: {
    },
    data () {
      return {
        layers: []
      }
    },
    methods: {
      /**
       * This function is executed, after the map is bound (see mixins/Mapable).
       * Bind to the layers from the OpenLayers map.
       */
      onMapBound () {
        this.layers = this.map.getLayers().getArray();
      },
      /**
       * Handler for click on item in layer list:
       * Toggles the corresponding layer visibility.
       *
       * @param  {Object} layer Layer object
       */
      onItemClick (layer) {
        layer.setVisible(!layer.getVisible());
      },
      /**
       * Returns true, if the layer item should show an extension slider with layer details.
       **/
      showDetails (layer) {
        return layer.get('legend');
      }
    },
    computed: {
      /**
       * Reactive property to return the OpenLayers layers to be shown in the control.
       * Remarks: The 'displayInLayerList' attribute should default to true per convention.
       */
      displayedLayers () {
        return this.layers
          .filter(layer => layer.get('displayInLayerList') !== false && !layer.get('isBaseLayer'))
          .reverse();
      }
    }
  }
</script>
