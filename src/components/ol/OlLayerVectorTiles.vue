<script>

import VectorTileLayer from 'ol/layer/vectortile'
import VectorTileSource from 'ol/source/vectortile'
import OlLayerBase from './OlLayerBase'
import MvtFormat from 'ol/format/mvt'
import GeoJsonFormat from 'ol/format/geojson'
import TopoJsonFormat from 'ol/format/topojson'

var OlLayerVectorTiles = OlLayerBase.extend({
  name: 'ol-layer-vectortiles',
  props: {
    url: {type: String, required: true},
    format: {type: String, required: true}
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
        })
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
