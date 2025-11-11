import ObjectUtil from './Object';

/**
 * Icon related utility methods.
 */
const IconUtil = {

  /**
   * Import custom icons from 'app/custom-icons'. Those icons will be included
   * in an object ready to be injected inside Vuetify configuration options
   * object under the icons['values'] property.
   *
   * @returns {Object} An object containing the imported icons.
   *                   Key is the icon name, value contains the icon.
   */
  importIcons () {
    const icons = {};

    try {
      const pathIcons = IconUtil.importPathIcons();
      ObjectUtil.mergeDeep(icons, pathIcons);
    } catch (e) {
      console.warn('An error occured while importing the custom icons, ' +
        'they will not be registered inside Vuetify. The error was: ', e);
    }

    return icons;
  },

  /**
   * Import custom icons from 'app/custom-icons/*.js'. Those icons will be included
   * in an object ready to be injected inside Vuetify configuration options object
   * under the icons['values'] property.
   * The icons must be .js files with a default export which contains an SVG path.
   *
   * @returns {Object} An object containing icon SVG paths.
   *                   Key is the icon name, value contains the path.
   */
  importPathIcons () {
    const moduleDefaultExtractor = (i) => i.default;
    const testExp = /custom-icons\/(?:.+\/)*([a-z0-9_-]+)\.js$/i;

    const modules = import.meta.glob('/app/custom-icons/**/*.js', { eager: true });
    const pathIcons = {};
    for (const path in modules) {
      const match = path.match(testExp);
      if (match) {
        const iconName = match[1];
        pathIcons[iconName] = moduleDefaultExtractor(modules[path]);
      }
    }

    return pathIcons;
  }
}

export default IconUtil;
