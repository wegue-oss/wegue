<script>
// Control to switch between light and dark mode
import ToggleButton from '../modulecore/ToggleButton.vue';
import { useColorTheme } from '@/composables/ColorTheme';
import { useTheme } from 'vuetify';

export default {
  extends: ToggleButton,
  name: 'wgu-themeswitcher',
  setup () {
    const theme = useTheme();
    const { isDarkTheme, isPrimaryDark } = useColorTheme();
    return { isDarkTheme, isPrimaryDark, theme };
  },
  watch: {
    isDarkTheme: {
      // When dark theme changes via Vuetify
      handler: function (value) {
        // update toggle state of this tool
        if (value !== !!this.show) {
          this.show = value;
        }
      },
      immediate: true
    },

    show: {
      // When dark theme changes via this tool
      handler: function (value) {
        // update Vuetify state
        const wantedTheme = value ? 'dark' : 'light';
        if (wantedTheme !== this.theme.global.name.value) {
          this.theme.global.name.value = wantedTheme;
        }
      }
    }
  }
};
</script>
