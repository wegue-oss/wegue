import ColorUtil from './Color'

// Macro for default color themes configuration
const DEFAULT_THEMES = Object.freeze({
  'light': {
    'primary': '#af2622',
    'onprimary': '#ffffff',
    'secondary': '#af2622',
    'onsecondary': '#ffffff',
    'anchor': '#af2622',
    'error': '#ff6f00'
  },
  'dark': {
    'primary': '#272727',
    'onprimary': '#ffffff',
    'secondary': '#ea9b9b',
    'onsecondary': '#272727',
    'anchor': '#ea9b9b',
    'error': '#ff6f00'
  }
});

// Macros for light/dark theme
const LIGHT_WHITE = '#ffffff';
const LIGHT_ERROR = '#FF5252';
const LIGHT_INFO = '#2196F3';
const LIGHT_SUCCESS = '#4CAF50';
const LIGHT_WARNING = '#FFC107';
const LIGHT_BLACK = '#000000';
const DARK_WHITE = '#ffffff';
const DARK_ERROR = '#FF5252';
const DARK_INFO = '#2196F3';
const DARK_SUCCESS = '#4CAF50';
const DARK_WARNING = '#FFC107';
const DARK_BLACK = '#272727';

/**
   * Gets the base color for the input color.
   * See the theme object interface on
   * https://vuetifyjs.com/en/features/theme/#custom-theme-variants
   * @param {String | Object} color hexadecimal/object color
   * @returns {String} base color
   */
function getBaseColor (color) {
  return typeof color === 'object' ? color.base : color;
}

/**
 * Checks luminance of the input color and:
 *   - chooses "light" if color is dark;
 *   - chooses "dark" if color is light
 * @param {String | Object} color hexadecimal/object color
 * @param {String} light hexadecimal color
 * @param {String} dark hexadecimal color
 * @returns {String} contrast color
 */
function contrastColor (color, light, dark) {
  const baseColor = getBaseColor(color);

  return ColorUtil.checkLuminance(baseColor) ? light : dark;
}

/**
 * Util class for vuetify theming
 */
const ColorThemeUtil = {
  /**
   * Merges user color theme with the default color theme
   * @param {Object} inputTheme input theme from app-config
   * @param {Object} defaultTheme default Wegue theme
   * @returns {Object} merged color theme
   */
  mergeThemes (inputTheme, defaultTheme) {
    let { light, dark } = inputTheme;

    const merged = {
      light: {},
      dark: {}
    }

    // If light theme is configured with at least the primary color
    if (!light || !light.primary) {
      // fallback to default light theme
      light = defaultTheme.light;
    }

    // set primary color
    merged.light.primary = light.primary;

    // set secondary to user secondary,
    // otherwise fallback to primary
    merged.light.secondary = light.secondary ? light.secondary : light.primary;

    // set accent to the light theme white
    merged.light.accent = contrastColor(merged.light.primary, LIGHT_WHITE, LIGHT_BLACK);

    // set anchor to the light theme secondary
    merged.light.anchor = merged.light.secondary;

    // set onprimary to user onprimary,
    // otherwise fallback to a color that contrasts with the primary
    merged.light.onprimary = light.onprimary ? light.onprimary : contrastColor(merged.light.primary, LIGHT_WHITE, LIGHT_BLACK);

    // set onprimary to user onsecondary,
    // otherwise fallback to a color that contrasts with the secondary
    merged.light.onsecondary = light.onsecondary ? light.onsecondary : contrastColor(merged.light.secondary, LIGHT_WHITE, LIGHT_BLACK);

    // set semantic colors,
    // otherwise fallback to light theme defaults
    merged.light.info = light.info ? light.info : LIGHT_INFO;
    merged.light.success = light.success ? light.success : LIGHT_SUCCESS;
    merged.light.warning = light.warning ? light.warning : LIGHT_WARNING;
    merged.light.error = light.error ? light.error : LIGHT_ERROR;

    // If light theme is configured with at least the secondary color
    if (!dark || !dark.secondary) {
      // fallback to default dark theme
      dark = defaultTheme.dark;
    }

    // set primary to dark theme primary
    merged.dark.primary = DARK_BLACK;

    // set secondary
    merged.dark.secondary = dark.secondary;

    // set anchor to the dark theme secondary
    merged.dark.anchor = merged.dark.secondary;

    // set accent to secondary
    merged.dark.accent = dark.secondary;

    // set onprimary to dark theme white
    merged.dark.onprimary = DARK_WHITE;

    // set onsecondary to user onsecondary,
    // otherwise fallback to a color that contrasts with secondary
    merged.dark.onsecondary = dark.onsecondary ? dark.onsecondary : contrastColor(merged.dark.secondary, DARK_WHITE, DARK_BLACK);

    // set semantic colors,
    // otherwise fallback to dark theme defaults
    merged.dark.info = dark.info ? dark.info : DARK_INFO;
    merged.dark.success = dark.success ? dark.success : DARK_SUCCESS;
    merged.dark.warning = dark.warning ? dark.warning : DARK_WARNING;
    merged.dark.error = dark.error ? dark.error : DARK_ERROR;

    return merged;
  },

  /**
   * Builds the theme object used by Vuetify
   * @param {Object} inputConfig user configuration from app-config
   * @returns {Object} theme object
   */
  buildTheme: function (inputConfig) {
    // If there is no input config, create it
    if (!inputConfig || typeof inputConfig !== 'object') {
      inputConfig = { dark: false };
    }

    // If there is no input themes, create it
    if (!inputConfig.themes || typeof inputConfig.themes !== 'object') {
      inputConfig.themes = {};
    }

    // Object for the output config
    const outputConfig = {};

    // Apply start with dark theme
    outputConfig.dark = !!inputConfig.dark;

    // Apply user theme or fallback to default
    outputConfig.themes = ColorThemeUtil.mergeThemes(inputConfig.themes, DEFAULT_THEMES);

    // Set customProperties.
    // This creates css colors for each vuetify color class
    outputConfig.options = {
      'customProperties': true
    }

    return outputConfig;
  }
}

export default ColorThemeUtil;
