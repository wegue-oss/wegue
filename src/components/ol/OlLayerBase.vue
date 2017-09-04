<script>
import Vue from 'vue'

export default Vue.extend({
  template: '<div class="hidden-layer"></div>',
  props: {
    hidden: {type: Boolean},
    opacity: {type: Number, default: 1},
    extent: {type: Array}
  },
  created () {
    this.layer = this.createLayer()
    this.layer.setVisible(!this.hidden)
    this.layer.setOpacity(this.opacity)
  },
  mounted () {
    this.$parent.map.addLayer(this.layer)
  }
})
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
.hidden-layer {
  display: none;
}
</style>
