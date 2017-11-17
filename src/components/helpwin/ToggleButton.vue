<script>

import { EventBus } from '../../EventBus.js'
import ToggleUiButton from '../ToggleUiButton'

export default ToggleUiButton.extend({
  name: 'v-webgis-toggle-helpwin-button',
  mounted () {
  },
  methods: {
    toggleUi () {
      // TODO check how to call the super method
      // how / toggle child UI
      this.showUi = !this.showUi;

      // inform sub component (layer list)
      EventBus.$emit('toggle-helpwin', this.showUi);
    }
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
