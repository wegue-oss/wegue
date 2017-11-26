<script>

import TileLayer from 'ol/layer/tile'
import TileWmsSource from 'ol/source/tilewms'
import OlLayerBase from './LayerBase'

var OlLayerWms = OlLayerBase.extend({
  name: 'ol-layer-tilewms',
  props: {
    url: {type: String, required: true},
    layers: {type: String, required: true},
    tiled: {type: Boolean, required: false},
    serverType: {type: String, required: false}
  },
  methods: {
    createLayer () {
      var wmsLayer = new TileLayer({
        extent: this.extent,
        source: new TileWmsSource({
          url: this.url,
          params: {'LAYERS': this.layers, 'TILED': this.tiled},
          serverType: this.serverType
        })
      })

      return wmsLayer
    }
  }
})

export default OlLayerWms
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
