import Color from '../util/Color';
import { ref, computed } from 'vue';
import { useTheme } from 'vuetify';

const theme = ref();
/**
 * Composable for colorTheme utils
 */
export function useColorTheme () {
  theme.value = useTheme();

  /**
   * Checks if the theme is in dark mode
   * @returns true if dark mode
   */
  const isDarkTheme = computed(() => {
    return theme.value.global.name === 'dark';
  })

  /**
   * Checks the luminance level of the primary color.
   * @returns true if primary is a dark color
   */
  const isPrimaryDark = computed(() => {
    // Get current primary color
    let primary = theme.value.current.colors.primary;

    // "primary" can be either an hexa string or
    // an object of hexa string. In the later,
    // we check the luminance for the primary
    // base.
    if (typeof primary === 'object') {
      primary = primary.base;
    }

    return Color.checkLuminance(primary);
  })

  return { isDarkTheme, isPrimaryDark };
}
