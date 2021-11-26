<script>
// Control to switch between light and dark mode

import ToggleButton from '../modulecore/ToggleButton.vue';
import { ColorTheme } from '../../mixins/ColorTheme';

export default {
  extends: ToggleButton,

  name: 'wgu-themeswitcher',
  mixins: [ColorTheme],

  watch: {
    isDarkTheme: {
      // When dark theme changes via Vuetify
      handler: function (value) {
        // update toggle state of this tool
        if (value !== this.show) {
          this.show = value;
        }
      },
      immediate: true
    },

    show: {
      // When dark theme changes via this tool
      handler: function (value) {
        // update Vuetify state
        if (value !== this.$vuetify.theme.dark) {
          // untoggled state of v-btn-toggle
          // returns undefined, so we !!undefined
          this.$vuetify.theme.dark = !!value;
        }
      }
    }
  }
};
</script>
