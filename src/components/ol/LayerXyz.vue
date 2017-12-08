<script>

import TileLayer from 'ol/layer/tile'
import TileWmsSource from 'ol/source/xyz'
import OlLayerBase from './LayerBase'

var OlLayerXyz = OlLayerBase.extend({
  name: 'ol-layer-xyz',
  props: {
    url: {type: String, required: true}
  },
  methods: {
    createLayer () {
      var xyzLayer = new TileLayer({
        extent: this.extent,
        source: new TileWmsSource({
          url: this.url
        })
      })

      return xyzLayer;
    }
  }
})

export default OlLayerXyz
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
