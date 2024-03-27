<template>

  <wgu-module-card v-bind="$attrs"
    :moduleName="moduleName"
    class="wgu-infoclick-win"
    :icon="icon"
    v-on:visibility-change="show">

    <!-- Show feature properties and position tables -->
    <div v-if="!this.showMedia">

      <v-card-title primary-title class="wgu-infoclick-win-title">

        <v-card-text v-if="!this.attributeData && !this.coordsData" class="no-data">
          {{ $t('wgu-infoclick.mapClick') }}
        </v-card-text>
        <v-card-actions v-show="attributeData">
          <v-spacer class="text-overline">{{ featureIdx + 1 }}/{{ numfeats }}: {{ layerName }}</v-spacer>
          <v-btn v-show="numfeats > 1" x-small @click="prevFeat" ><v-icon>mdi-menu-left</v-icon></v-btn>
          <v-btn v-show="numfeats > 1" x-small @click="nextFeat" ><v-icon>mdi-menu-right</v-icon></v-btn>
        </v-card-actions>

        <!-- feature property grid -->
        <wgu-property-table :properties="attributeData" />

        <!-- click coodinate info grid -->
        <wgu-coords-table :coordsData="coordsData" />

      </v-card-title>

    </div>

    <!-- Show a default image based object info as previously
         done in FeatureInfoWindow -->
    <div v-if="this.showMedia">

      <v-card-text v-if="!this.attributeData" class="no-data">
        {{ $t('wgu-infoclick.mediaClick') }}
      </v-card-text>

      <v-img
        height="250"
        v-if="this.attributeData"
        :src="this.attributeData[this.imageProp]"
      ></v-img>

      <v-card-text
        v-if="this.attributeData && this.attributeData[imageDescriptionProp]" >
        {{this.attributeData[imageDescriptionProp]}}
      </v-card-text>

      <v-card-actions>
        <v-btn
          text color="secondary"
          v-if="this.attributeData && this.attributeData[mediaInfoLinkUrlProp]"
          :href="this.attributeData[mediaInfoLinkUrlProp]"
          target="_blank"
        >
          {{ $t('wgu-infoclick.mediaInfoLinkText') || this.attributeData[mediaInfoLinkUrlProp] }}
        </v-btn>
      </v-card-actions>

    </div>

   </wgu-module-card>
</template>

<script>
import ModuleCard from './../modulecore/ModuleCard';
import { WguEventBus } from '../../WguEventBus.js';
import PropertyTable from './PropertyTable';
import CoordsTable from './CoordsTable';
import MapInteractionUtil from '../../util/MapInteraction';

export default {
  name: 'wgu-infoclick-win',
  inheritAttrs: false,
  components: {
    'wgu-module-card': ModuleCard,
    'wgu-property-table': PropertyTable,
    'wgu-coords-table': CoordsTable
  },
  props: {
    icon: { type: String, required: false, default: 'info' },
    showMedia: { type: Boolean, required: false, default: false },
    // below props only have an effect if showMedia=true
    mediaInfoLinkUrlProp: { type: String, required: false },
    imageProp: { type: String, required: false },
    imageDescriptionProp: { type: String, required: false }
  },
  data: function () {
    return {
      moduleName: 'wgu-infoclick',
      attributeData: null,
      coordsData: null,
      featureIdx: 0,
      features: null,
      layerName: null,
      numfeats: null
    }
  },
  created () {
    const me = this;
    // Listen to the ol-map-mounted event and receive the OL map instance
    WguEventBus.$on('ol-map-mounted', (olMap) => {
      // make the OL map accessible in this component
      me.map = olMap;
    });
  },
  methods: {
    registerMapClick (unregister) {
      const me = this;

      if (unregister === true) {
        me.map.un('singleclick', me.onMapClick);
      } else {
        me.map.on('singleclick', me.onMapClick);
      }
    },
    /**
     * Handler for 'singleclick' on the map.
     * Collects data and passes it to corresponding objects.
     *
     * @param  {ol/MapBrowserEvent} evt The OL event of 'singleclick' on the map
     */
    onMapClick (evt) {
      const me = this;
      me.features = []
      me.map.forEachFeatureAtPixel(evt.pixel,
        (feature, layer) => {
          me.features.push([feature, layer])
        });

      // collect feature attributes --> PropertyTable
      if (this.features.length !== 0) {
        this.featureIdx = 0
        this.numfeats = me.features.length
        this.viewProps(this.featureIdx)
      } else {
        this.attributeData = null;
      }

      // collect click coordinate + projection --> CoordsTable
      this.coordsData = {
        coordinate: evt.coordinate,
        projection: this.map.getView().getProjection().getCode()
      };
    },

    prevFeat () {
      this.featureIdx -= 1
      if (this.featureIdx < 0) {
        this.featureIdx = this.features.length - 1
      }
      this.viewProps(this.featureIdx)
    },

    nextFeat () {
      this.featureIdx += 1
      if (this.featureIdx > this.features.length - 1) {
        this.featureIdx = 0
      }
      this.viewProps(this.featureIdx)
    },

    viewProps (idx) {
      const infofeat = this.features[idx][0];
      const props = infofeat.getProperties();
      // do not show geometry property
      delete props.geometry;
      this.attributeData = props;
      this.layerName = this.features[idx][1].get('name')
      const lid = this.features[idx][1].get('lid')

      const correspondingInteraction = MapInteractionUtil.getSelectInteraction(this.map, lid);

      // we can only select layers that have a select interaction
      if (!correspondingInteraction) {
        return;
      }

      // add to map selection
      correspondingInteraction.getFeatures().clear();
      correspondingInteraction.getFeatures().push(infofeat);
    },

    /**
     * (Un-)Register map interactions when the visibility of the module changes.
     *
     * @param  {boolean} visible New visibility state
    */
    show (visible) {
      const me = this;
      if (visible) {
        me.registerMapClick();
      } else {
        // cleanup old data
        me.attributeData = null;
        me.coordsData = null;
      }
    }
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>

  .wgu-infoclick-win {
    width: 450px;
  }

  .wgu-infoclick-win .v-card__title {
    display: inherit;
  }

  @media (max-width: 600px) {
    /* TODO
      Generalize the positioning concept for windows,
      this interferes with positioning and draggable settings in the app.conf */

    /* tmp. approach to position on small screens */
    .wgu-infoclick-win.wgu-floating {
      /* tmp. fix */
      left: 0 !important;
      top: 40% !important;
      width: 100%;
      max-width: 600px;
    }

    .wgu-infoclick-win.wgu-floating > .wgu-infoclick-win-title {
      overflow: scroll;
      max-height: 300px;
    }
  }

</style>
