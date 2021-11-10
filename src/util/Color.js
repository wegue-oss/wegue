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
   * https://stackoverflow.com/questions/12043187/how-to-check-if-hex-color-is-too-black
   * Checks if an hexadecimal color is dark/bright
   * @param {String} hexa color in hexadecimal format
   * @returns {Boolean} true if dark
   */
  checkLuminance: function (hexa) {
    const c = hexa.substring(1); // strip #

    const rgb = parseInt(c, 16); // convert rrggbb to decimal

    const r = (rgb >> 16) & 0xff; // extract red

    const g = (rgb >> 8) & 0xff; // extract green

    const b = (rgb >> 0) & 0xff; // extract blue

    const luma = 0.2126 * r + 0.7152 * g + 0.0722 * b; // per ITU-R BT.709 (Range 0-255)

    return luma < 128;
  }
}

export default ColorUtil;
