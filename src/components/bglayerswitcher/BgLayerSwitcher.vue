<template>
  <div id="wgu-bglayerswitcher-wrapper" v-if="show">
    <v-menu offset-x nudge-right="15"
      transition="scale-transition"
      :close-on-content-click="false"
      v-model="open"
      attach="#wgu-bglayerswitcher-wrapper"
      >
      <template v-slot:activator="{on}">
        <v-sheet class="wgu-map-button wgu-bglayerswitcher">
          <v-btn v-on="on"
            color="secondary"
            fab
            :title="$t('wgu-bglayerswitcher.title')"
            >
            <v-icon color="onsecondary" medium>{{icon}}</v-icon>
          </v-btn>
        </v-sheet>
      </template>
      <!-- Remarks: The layerlist is wrapped by an v-if block to avoid unneccesary image 
           requests when the layerlist is not visible -->
      <wgu-bglayerlist v-if="open"
        :previewIcon="icon"
        :imageWidth="imageWidth"
        :imageHeight="imageHeight"
        />
    </v-menu>
  </div>
</template>

<script>
import { Mapable } from '../../mixins/Mapable';
import BgLayerList from './BgLayerList';

export default {
  name: 'wgu-bglayerswitcher',
  components: {
    'wgu-bglayerlist': BgLayerList
  },
  mixins: [Mapable],
  props: {
    icon: { type: String, required: false, default: 'map' },
    imageWidth: { type: Number, required: false, default: 152 },
    imageHeight: { type: Number, required: false, default: 114 }
  },
  data () {
    return {
      open: false,
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
    }
  },
  computed: {
    /**
     * Reactive property to return true, when more than one OpenLayers layer is available,
     * which is marked as 'isBaseLayer'.
     */
    show () {
      return this.layers
        .filter(layer => layer.get('isBaseLayer'))
        .length > 1;
    }
  }
};
</script>
