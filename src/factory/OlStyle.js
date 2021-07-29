import {
  Circle as CircleStyle, Icon as IconStyle, Fill, Stroke, Style, Text }
  from 'ol/style';

/**
 * Factory, which creates OpenLayers style instances according to a given config
 * object.
 * This only covers a minimal subset of the OpenLayers style capabilities.
 * It allows to create simple styles for points, line and polygons.
 * For advanced styling use a custom style function or
 * GeoStyler<https://github.com/terrestris/geostyler>
 */
export const OlStyleFactory = {

  /**
   * Returns an OpenLayers Style instance due to given config.
   *
   * @param  {Object} styleConf  Style config object
   * @return {Style}             OL Style instance
   */
  getInstance (styleConf) {
    let style;
    if (!styleConf) {
      return;
    } else if (styleConf.radius || styleConf.iconUrl || styleConf.textIcon) {
      style = OlStyleFactory.createPointStyle(styleConf);
    } else if (styleConf.fillColor) {
      style = OlStyleFactory.createPolygonStyle(styleConf);
    } else if (styleConf.strokeColor || styleConf.strokeWidth) {
      style = OlStyleFactory.createLineStyle(styleConf);
    }

    if (styleConf.label && styleConf.label.attribute &&
        styleConf.label.attribute !== '') {
      // use an OL style function to enable labels
      return OlStyleFactory.getTextStyleFunction(style, styleConf.label);
    }

    return style;
  },

  /**
   * Returns an OpenLayers style instance for point due to given config.
   *
   * @param  {Object} styleConf  Style config object
   * @return {Style}             OL style instance
   */
  createPointStyle (styleConf) {
    let pointStyle;
    if (styleConf.iconUrl) {
      pointStyle = new Style({
        image: new IconStyle(({
          src: styleConf.iconUrl,
          scale: styleConf.scale || 1,
          anchor: styleConf.iconAnchor,
          anchorXUnits: styleConf.iconAnchorXUnits,
          anchorYUnits: styleConf.iconAnchorYUnits
        }))
      })
    } else if (styleConf.radius) {
      pointStyle = new Style({
        image: new CircleStyle({
          radius: styleConf.radius,
          fill: OlStyleFactory.createFill(styleConf),
          stroke: OlStyleFactory.createStroke(styleConf)
        })
      });
    } else {
      pointStyle = new Style({
        text: new Text({
          text: styleConf.textIcon,
          font: styleConf.font || 'normal 30px Material Icons',
          fill: OlStyleFactory.createFill(styleConf)
        })
      });
    }

    return pointStyle;
  },

  /**
   * Returns an OpenLayers style instance for lines due to given config.
   *
   * @param  {Object} styleConf  Style config object
   * @return {Style}             OL style instance
   */
  createLineStyle (styleConf) {
    const olStyle = new Style({
      stroke: OlStyleFactory.createStroke(styleConf)
    });

    return olStyle;
  },

  /**
   * Returns an OpenLayers style instance for polygons due to given config.
   *
   * @param  {Object} styleConf  Style config object
   * @return {Style}             OL style instance
   */
  createPolygonStyle (styleConf) {
    let olStyle = OlStyleFactory.createLineStyle(styleConf);
    olStyle.setFill(OlStyleFactory.createFill(styleConf));

    return olStyle;
  },

  /**
   * Creates an OL Stroke object due to given config.
   *
   * @param  {Object} styleConf Style config object
   * @return {Stroke}           OL Stroke instance
   */
  createStroke (styleConf) {
    return new Stroke({
      color: styleConf.strokeColor,
      width: styleConf.strokeWidth
    });
  },

  /**
   * Creates an OL Fill object due to given config.
   *
   * @param  {Object} styleConf Style config object
   * @return {Fill}             OL Fill instance
   */
  createFill (styleConf) {
    return new Fill({
      color: styleConf.fillColor
    });
  },

  /**
   * Creates and returns a basic OL style object for texts.
   *
   * @param {Object} labelConf Style config object for labels
   * @returns {ol/style/Text} The OL style object for texts
   */
  getTextStyle (labelConf) {
    // create a clone to avoid unwanted in place modification
    const textConf = { ...labelConf };

    textConf.fill = new Fill({ color: textConf.fillColor });
    textConf.stroke = new Stroke({
      color: textConf.outlineColor,
      width: textConf.outlineWidth
    });

    const textStyle = new Text(textConf);

    return textStyle;
  },

  /**
   * Wraps the given OL style as function and injects a text style symbolizer
   * in order to show a label at the feature.
   *
   * @param {ol/style/Style} style
   * @param {Object} labelStyleConf
   * @returns {ol/style/Style~StyleFunction}
   *    Style function returning the OL style object enriched by texts / labels
   */
  getTextStyleFunction (style, labelStyleConf) {
    const labelStyle = OlStyleFactory.getTextStyle(labelStyleConf);
    const labelAttr = labelStyleConf.attribute;
    return (feature, resolution) => {
      // detect min/max resolution to show labels
      // if nothing is configured labels are shown regardless of resolution
      const minRes = labelStyleConf.minResolution || Number.MAX_SAFE_INTEGER;
      const maxRes = labelStyleConf.maxResolution || 0;
      if (resolution < minRes && resolution > maxRes) {
        // set text to display
        labelStyle.setText(feature.get(labelAttr));
        // apply text style to overall style object
        style.setText(labelStyle);
      } else {
        labelStyle.setText(null);
      }

      return style;
    }
  }

}
