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
  },

  /**
   * Luminance theory from:
   *    https://stackoverflow.com/questions/3942878/how-to-decide-font-color-in-white-or-black-depending-on-background-color
   * Hexa -> RGB from:
   *    https://stackoverflow.com/questions/12043187/how-to-check-if-hex-color-is-too-black
   *
   * Checks if an hexadecimal color is dark/bright
   * @param {String} hexa color in hexadecimal format
   * @returns {Boolean} true if dark
   */
  checkLuminance: function (hexa) {
    const c = hexa.substring(1); // strip #

    const rgb = parseInt(c, 16); // convert rrggbb to decimal

    let r = (rgb >> 16) & 0xff; // extract red
    let g = (rgb >> 8) & 0xff; // extract green
    let b = (rgb >> 0) & 0xff; // extract blue

    // normalize to [0, 1]
    r = r / 255.0;
    g = g / 255.0;
    b = b / 255.0;

    // https://www.w3.org/TR/WCAG20/#relativeluminancedef
    r = r <= 0.03928 ? r / 12.92 : Math.pow(((r + 0.055) / 1.055), 2.4)
    g = g <= 0.03928 ? g / 12.92 : Math.pow(((g + 0.055) / 1.055), 2.4)
    b = b <= 0.03928 ? b / 12.92 : Math.pow(((b + 0.055) / 1.055), 2.4)

    // https://www.w3.org/TR/WCAG20/#relativeluminancedef
    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b;

    // returns true if dark color
    return luma <= 0.179;
  }
}

export default ColorUtil;
