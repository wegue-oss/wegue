<script>

import VectorLayer from 'ol/layer/vector'
import VectorSource from 'ol/source/vector'
import KmlFormat from 'ol/format/kml'
import GeoJsonFormat from 'ol/format/geojson'
import OlLayerBase from './OlLayerBase'
import SelectInteraction from 'ol/interaction/select'
import { EventBus } from '../../EventBus.js'

var OlLayerVector = OlLayerBase.extend({
  name: 'ol-layer-vector',
  props: {
    url: {type: String, required: true},
    format: {type: String, required: true},
    formatConfig: {type: Object, required: false, default: {}},
    selectable: {type: Boolean, required: false, default: false}
  },
  created: function () {
    var me = this
    // listen for the ol-map-mounted event and receive the OL map
    // instance
    EventBus.$on('ol-map-mounted', function (olMap) {
      // make the OL map accesible in this component
      me.map = olMap;

      // if layer is selectable register a select interaction
      if (me.selectable) {
        var selectClick = new SelectInteraction({
          layers: [me.layer]
        });

        // forward an event if feature selection changes
        selectClick.on('select', function (evt) {
          // TODO use identifier for layer (once its implemented)
          EventBus.$emit(
            'map-selectionchange',
            me.layer.get('name'),
            evt.selected,
            evt.deselected
          );
        });
        // register/activate interaction on map
        me.map.addInteraction(selectClick);
      }
    });
  },
  methods: {
    createLayer () {
      // map the supported formats to short keys
      const formatMapping = {
        'KML': KmlFormat,
        'GeoJSON': GeoJsonFormat
      };

      var vectorLayer = new VectorLayer({
        extent: this.extent,
        source: new VectorSource({
          url: this.url,
          format: new formatMapping[this.format](this.formatConfig)
        })
      });

      return vectorLayer
    }
  }
})

export default OlLayerVector
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
