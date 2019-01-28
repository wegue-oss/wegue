/**
 * Util class for OL layers
 */
const LayerUtil = {
  /**
   * Returns a set of map layers which matches the given key value pair.
   *
   * @param {String} key - Key to filter layers
   * @param {Object} value - Value to filter layers
   * @param  {ol.Map} olMap  The OL map to search in
   * @return {ol.layer.Base[]} Array of matching layers
   */
  getLayersBy (key, value, olMap) {
    if (!olMap) {
      console.warn('No OL map passed to LayerUtil.getLayersBy - ' +
        'no layer detection possible!');
      return [];
    }

    let layerMatches = [];
    olMap.getLayers().forEach(function (layer) {
      if (layer.get(key) === value) {
        layerMatches.push(layer);
      }
    });

    return layerMatches;
  },

  /**
   * Returns a map layer with the given LID (Layer ID)
   *
   * @param  {String} lid    The LID of the layer to query
   * @param  {ol.Map} olMap  The OL map to search in
   * @return {ol.layer.Base} The OL layer instance or undefined
   */
  getLayerByLid (lid, olMap) {
    return LayerUtil.getLayersBy('lid', lid, olMap)[0];
  }
}

export default LayerUtil;
