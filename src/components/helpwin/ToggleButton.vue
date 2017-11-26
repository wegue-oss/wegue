<script>

import { WguEventBus } from '../../WguEventBus.js'
import ToggleUiButton from '../ToggleUiButton'

export default ToggleUiButton.extend({
  name: 'wgu-toggle-helpwin-button',
  methods: {
    toggleUi () {
      // TODO check how to call the super method
      // how / toggle child UI
      this.showUi = !this.showUi;

      // inform sub component (layer list)
      WguEventBus.$emit('toggle-helpwin', this.showUi);
    }
  }
});
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style>
</style>
