<script>

import VectorTileLayer from 'ol/layer/vectortile'
import VectorTileSource from 'ol/source/vectortile'
import MvtFormat from 'ol/format/mvt'
import GeoJsonFormat from 'ol/format/geojson'
import TopoJsonFormat from 'ol/format/topojson'
import OlLayerBase from './LayerBase'
import OlStyleDefs from '../../style/OlStyleDefs'

var OlLayerVectorTiles = OlLayerBase.extend({
  name: 'ol-layer-vectortiles',
  props: {
    url: {type: String, required: true},
    format: {type: String, required: true},
    styleRef: {type: String, required: false}
  },
  methods: {
    createLayer () {
      // map the supported formats to short keys
      const formatMapping = {
        'MVT': MvtFormat,
        'GeoJSON': GeoJsonFormat,
        'TopoJSON': TopoJsonFormat
      };

      var vtLayer = new VectorTileLayer({
        source: new VectorTileSource({
          url: this.url,
          format: new formatMapping[this.format]()
        }),
        style: OlStyleDefs[this.styleRef]
      });

      return vtLayer;
    }
  }
})

export default OlLayerVectorTiles
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
