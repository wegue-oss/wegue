<script>

import TileLayer from 'ol/layer/tile'
import OsmSource from 'ol/source/osm'
import OlLayerBase from './OlLayerBase'

var OlLayerOsm = OlLayerBase.extend({
  name: 'ol-layer-osm',
  methods: {
    createLayer () {
      var osmLayer = new TileLayer({
        source: new OsmSource()
      })

      return osmLayer
    }
  }
})

export default OlLayerOsm
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
