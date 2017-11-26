<script>

import { WguEventBus } from '../../WguEventBus.js'
import ToggleUiButton from '../ToggleUiButton'

export default ToggleUiButton.extend({
  name: 'v-webgis-toggle-layerlist-button',
  mounted () {
  },
  methods: {
    toggleUi () {
      // TODO check how to call the super method
      // show / toggle child UI
      this.showUi = !this.showUi;

      // inform sub component (layer list)
      WguEventBus.$emit('toggle-layerlist', this.showUi);
    }
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
