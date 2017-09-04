<!-- <template>
    <div class="hidden-layer-div"></div>
</template> -->

<script>

import TileLayer from 'ol/layer/tile'
import XYZ from 'ol/source/xyz'

export default {
  name: 'ol-layer-osm',
  template: '<div class="hidden-layer-div" style="display:none"></div>',
  data () {
    return {
    }
  },
  created () {
    var osmLayer = new TileLayer({
      source: new XYZ({
        url: 'https://{a-c}.tile.openstreetmap.org/{z}/{x}/{y}.png'
      })
    })

    this.layer = osmLayer
  },
  mounted () {
    this.$parent.map.addLayer(this.layer)
  }

}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.hidden-layer {
  display: none;
}
</style>
