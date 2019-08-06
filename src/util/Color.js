/**
 * Util class for color related things.
 */
const ColorUtil = {
  /**
   * Detects whether a given string is a CSS color notation.
   *
   * @param {String} color (Color) string to test
   * @return {Boolean} true if given string is in CSS color notation
   */
  isCssColor (color) {
    return !!color && !!color.match(/^(#|(rgb|hsl)a?\()/);
  }
}

export default ColorUtil;
