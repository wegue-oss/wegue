<script>

import VectorLayer from 'ol/layer/vector'
import VectorSource from 'ol/source/vector'
import KmlFormat from 'ol/format/kml'
import GeoJsonFormat from 'ol/format/geojson'
import OlLayerBase from './OlLayerBase'

var OlLayerVector = OlLayerBase.extend({
  name: 'ol-layer-vector',
  props: {
    url: {type: String, required: true},
    format: {type: String, required: true},
    formatConfig: {type: Object, required: false, default: {}}
  },
  methods: {
    createLayer () {
      // map the formats to short keys
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
      })

      return vectorLayer
    }
  }
})

export default OlLayerVector
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
