<template></template>

<script>
// helper function to detect a CSS color
// Taken from Vuetify sources
// https://github.com/vuetifyjs/vuetify/blob/master/packages/vuetify/src/mixins/colorable.ts
function isCssColor (color) {
  return !!color && !!color.match(/^(#|(rgb|hsl)a?\()/)
}

import Vue from 'vue';
import Map from 'ol/Map'
import View from 'ol/View'
import Attribution from 'ol/control/Attribution';
import Zoom from 'ol/control/Zoom';
import SelectInteraction from 'ol/interaction/Select';
// import the app-wide EventBus
import { WguEventBus } from '../../WguEventBus.js';
import { LayerFactory } from '../../factory/Layer.js';

export default {
  name: 'wgu-map',
  props: {
    color: {type: String, required: false, default: 'red darken-3'},
    collapsibleAttribution: {type: Boolean, default: false}
  },
  data () {
    return {
      zoom: this.$appConfig.mapZoom,
      center: this.$appConfig.mapCenter
    }
  },
  mounted () {
    var me = this;
    // Make the OL map accessible for Mapable mixin even 'ol-map-mounted' has
    // already been fired. Don not use directly in cmps, use Mapable instead.
    Vue.prototype.$map = me.map;
    // Send the event 'ol-map-mounted' with the OL map as payload
    WguEventBus.$emit('ol-map-mounted', me.map);

    // resize the map, so it fits to parent
    window.setTimeout(() => {
      me.map.setTarget(document.getElementById('ol-map-container'));
      me.map.updateSize();

      // adjust the bg color of the OL zoom buttons (if existing)
      if (document.querySelector('.ol-zoom')) {
        me.setZoomButtonColor();
      }
    }, 200);
  },
  created () {
    this.map = new Map({
      layers: [],
      controls: [
        new Zoom(),
        new Attribution({
          collapsible: this.collapsibleAttribution
        })
      ],
      view: new View({
        center: this.center || [0, 0],
        zoom: this.zoom
      })
    });

    // create layers from config and add them to map
    const layers = this.createLayers();
    this.map.getLayers().extend(layers);
  },

  methods: {
    /**
     * Creates the OL layers due to the "mapLayers" array in app config.
     * @return {ol.layer.Base[]} Array of OL layer instances
     */
    createLayers () {
      const me = this;
      let layers = [];
      this.$appConfig.mapLayers.reverse().forEach(function (lConf) {
        let layer = LayerFactory.getInstance(lConf);
        layers.push(layer);

        // if layer is selectable register a select interaction
        if (lConf.selectable) {
          const selectClick = new SelectInteraction({
            layers: [layer]
          });
          // forward an event if feature selection changes
          selectClick.on('select', function (evt) {
            // TODO use identifier for layer (once its implemented)
            WguEventBus.$emit(
              'map-selectionchange',
              layer.get('lid'),
              evt.selected,
              evt.deselected
            );
          });
          // register/activate interaction on map
          me.map.addInteraction(selectClick);
        }
      });

      return layers;
    },
    /**
     * Sets the background color of the OL zoom buttons to the color property.
     */
    setZoomButtonColor () {
      var me = this;

      if (isCssColor(me.color)) {
        // directly apply the given CSS color
        document.querySelector('.ol-zoom .ol-zoom-in').style.backgroundColor = me.color;
        document.querySelector('.ol-zoom .ol-zoom-out').style.backgroundColor = me.color;
      } else {
        // apply vuetify color by transforming the color to the corresponding
        // CSS class (see https://vuetifyjs.com/en/framework/colors)
        const [colorName, colorModifier] = me.color.toString().trim().split(' ', 2);
        document.querySelector('.ol-zoom .ol-zoom-in').classList.add(colorName);
        document.querySelector('.ol-zoom .ol-zoom-in').classList.add(colorModifier);
        document.querySelector('.ol-zoom .ol-zoom-out').classList.add(colorName);
        document.querySelector('.ol-zoom .ol-zoom-out').classList.add(colorModifier);
      }
    }
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
  div.ol-zoom {
    top: auto;
    left: auto;
    bottom: 3em;
    right: 0.5em;
  }

  div.ol-attribution.ol-uncollapsible {
    bottom: 12px;
  }
</style>
