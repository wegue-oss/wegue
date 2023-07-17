/**
 * Util class for angle related calculations.
 */
const AngleUtil = {
  /**
   * Determine the angle between two coordinates. The angle will be between
   * -180° and 180°, with 0° being in the east. The angle will increase
   * counter-clockwise.
   *
   * Inspired by http://stackoverflow.com/a/31136507
   *
   * @param {Array<Number>} start The start coordinates of the line with the
   *   x-coordinate being at index `0` and y-coordinate being at index `1`.
   * @param {Array<Number>} end The end coordinates of the line with the
   *   x-coordinate being at index `0` and y-coordinate being at index `1`.
   * @returns {Number} the angle in degrees, ranging from -180° to 180°.
   */
  calcAngle (start, end) {
    const dx = start[0] - end[0];
    const dy = start[1] - end[1];
    // range (-PI, PI]
    let theta = Math.atan2(dy, dx);
    // rads to degs, range (-180, 180]
    theta *= 180 / Math.PI;
    return theta;
  },

  /**
   * Determine the angle between two coordinates. The angle will be between
   * 0° and 360°, with 0° being in the east. The angle will increase
   * counter-clockwise.
   *
   * Inspired by http://stackoverflow.com/a/31136507
   *
   * @param {Array<Number>} start The start coordinates of the line with the
   *   x-coordinate being at index `0` and y-coordinate being at index `1`.
   * @param {Array<Number>} end The end coordinates of the line with the
   *   x-coordinate being at index `0` and y-coordinate being at index `1`.
   * @returns {Number} the angle in degreees, ranging from 0° and 360°.
   */
  angle360 (start, end) {
    // range (-180, 180]
    let theta = this.calcAngle(start, end);
    if (theta < 0) {
      // range [0, 360)
      theta = 360 + theta;
    }
    return theta;
  },

  /**
   * This methods adds an offset of 90° to an counter-clockwise increasing
   * angle of a line so that the origin (0°) lies at the top (in the north).
   *
   * @param {Number} angle360 The input angle obtained counter-clockwise, with
   *   0° degrees being in the east
   * @returns {Number} The adjusted angle, with 0° being in the north
   */
  makeZeroDegreesAtNorth (angle360) {
    let corrected = angle360 + 90;
    if (corrected > 360) {
      corrected = corrected - 360;
    }
    return corrected;
  },

  /**
   * Given an angle between 0° and 360° this angle returns the exact opposite
   * of the angle, e.g. for 90° you'll get back 270°. This effectively turns
   * the direction of the angle from counter-clockwise to clockwise.
   *
   * @param {Number} angle360 The input angle obtained counter-clockwise
   * @returns {Number} The clockwise angle
   */
  makeClockwise (angle360) {
    return 360 - angle360;
  }
}

export default AngleUtil;
