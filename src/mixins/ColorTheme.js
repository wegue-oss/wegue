import Color from '../util/Color'

/**
 * Mixin for colorTheme utils
 */
export const ColorTheme = {
  computed: {
    /**
     * Checks if the theme is in dark mode
     * @returns true if dark mode
     */
    isDarkTheme: function () {
      return this.$vuetify.theme.dark;
    },

    /**
     * Checks the luminance level of the primary color.
     * @returns true if primary is a dark color
     */
    isPrimaryDark: function () {
      // Get current theme
      const theme = this.$vuetify.theme.currentTheme;

      let primary = theme.primary;

      // "primary" can be either an hexa string or
      // an object of hexa string. In the later,
      // we check the luminance for the primary
      // base.
      if (typeof primary === 'object') {
        primary = primary.base;
      }

      return Color.checkLuminance(primary);
    }
  }
}
