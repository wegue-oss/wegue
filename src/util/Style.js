const StyleUtil = {

  /**
   * Appends a style to another style.
   *
   * @param {ol.style.Style} originalStyle A style, an array of styles or a style function.
   * @param {ol.style.Style} additionalStyle A single style.
   *
   * @returns {ol.style.Style}
   */
  appendStyle (originalStyle, additionalStyle) {
    return function (feature, resolution) {
      if (typeof originalStyle === 'function') {
        const layerStyleFunction = originalStyle;

        // check what kind of result we can expect
        let layerStyle = layerStyleFunction(feature, resolution);

        if (Array.isArray(layerStyle)) {
          // case result is an style array
          const resultArray = [additionalStyle];

          // add the array elements to the result Array
          layerStyle.forEach(item => resultArray.push(item));
          return resultArray;
        } else {
          // classic case that result is a simple style
          return [additionalStyle, layerStyleFunction(feature, resolution)]
        }
      } else {
        return [additionalStyle, originalStyle]
      }
    };
  }
};

export default StyleUtil;
