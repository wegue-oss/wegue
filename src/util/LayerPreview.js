/**
 * Create preview images for layers with an underlying Tile or TileWMS source.
 *
 * This is a modified version of LayerPreview released by Jean-Marc VIGLINO
 * under the CeCILL-B license (French BSD license).
 * For the original source of ol-ext see https://github.com/Viglino/ol-ext.
 */

import TileSource from 'ol/source/Tile'
import TileWMSSource from 'ol/source/TileWMS'
import { containsCoordinate as extentContainsCoordinate } from 'ol/extent'
import { transform as projTransform, /* get as getProjection, */ equivalent as projEquivalent } from 'ol/proj'

const TileSourcePreview = {
  /**
   * Return the tile image URL of the source.
   * @param {ol.TileSource} source The source to produce the preview for.
   * @param {ol.Coordinate} coords The center of the preview.
   * @param {number} resolution Resolution of the preview.
   * @param {ol.Projection} projection Projection of the coordinates.
   * @returns {String} The preview url.
   */
  getUrl (source, coords, resolution, projection) {
    const coord = source.getTileGrid().getTileCoordForCoordAndResolution(coords, resolution);
    const fn = source.getTileUrlFunction();
    return fn.call(source, coord, projection);
  }
}

const TileWMSSourcePreview = {
  /**
   * Return the tile image URL of the source.
   * @param {ol.TileWMSSource} source The source to produce the preview for.
   * @param {ol.Coordinate} coords The center of the preview.
   * @param {number} resolution Resolution of the preview.
   * @param {ol.Projection} projection Projection of the coordinates.
   * @returns {String} The preview url.
   */
  getUrl (source, coords, resolution, projection) {
    const fn = source.getTileUrlFunction();
    if (fn) {
      const tileGrid = source.getTileGrid() || source.getTileGridForProjection(projection);
      const coord = tileGrid.getTileCoordForCoordAndResolution(coords, resolution);
      return fn.call(source, coord, 1, projection);
    }

    // Use getfeature info instead
    var url = source.getGetFeatureInfoUrl
      ? source.getGetFeatureInfoUrl(coords, resolution, projection, {})
      : source.getFeatureInfoUrl(coords, resolution, projection, {});
    url = url.replace(/getfeatureinfo/i, 'GetMap');
    return url;
  }
}

const LayerPreview = {
  /**
   * Return a preview URL for the layer.
   * @param {ol.Layer} layer The layer to produce the preview for.
   * @param {ol.Coordinate} coords The center of the preview in view projection.
   * @param {number} resolution Resolution of the preview.
   * @param {ol.Projection} projection The view projection.
   * @returns {String} Preview url or undefined if no preview can be produced.
   */
  getUrl (layer, coords, resolution, projection) {
    const source = layer.getSource();

    // If we cannot obtain a source, no preview can be produced.
    if (!source) {
      return undefined;
    }

    try {
      // Clamp the resolution within the resolution supported by the layer.
      resolution = Math.max(Math.min(resolution, layer.getMaxResolution()), layer.getMinResolution());

      // Make sure to request an extent within the layers extent.
      var e = layer.getExtent();
      if (e && !extentContainsCoordinate(e, coords)) {
        coords = [ (e[0] + e[2]) / 2, (e[1] + e[3]) / 2 ];
      }

      // Transform the projection of the coords if necessary.
      const sourceProj = source.getProjection();
      if (sourceProj && !projEquivalent(projection, sourceProj)) {
        coords = projTransform(coords, projection, sourceProj);
        projection = sourceProj;
      }

      // Obtain the image URL from the source.
      if (source instanceof TileWMSSource) {
        return TileWMSSourcePreview.getUrl(source, coords, resolution, projection);
      } else if (source instanceof TileSource) {
        return TileSourcePreview.getUrl(source, coords, resolution, projection)
      }
    } catch (e) {
      console.error('failed to create preview: ' + e);
    }
    return undefined;
  }
}

export default LayerPreview;
