import SelectInteraction from 'ol/interaction/Select';
import { WguEventBus } from '../WguEventBus.js';
import { OlStyleFactory } from '../factory/OlStyle.js'

const MapInteractionUtil = {

  /**
   * Create a selectInteraction for a layer
   *
   * @param {ol.layer.Layer} layer The layer to create the interaction for
   * @param {Object} [selectStyleConf] The configuration for the selection style
   *
   * @returns {ol.interaction.Select} The select interaction
   */
  createSelectInteraction (layer, selectStyleConf) {
    let selectClick;
    let selectStyle;
    if (selectStyleConf) {
      // layer specific select style
      selectStyle = OlStyleFactory.getInstance(selectStyleConf);

      selectClick = new SelectInteraction({
        layers: [layer],
        style: function (feature, resolution) {
          // we return an array of the selection style and the features style
          if (typeof layer.getStyle() === 'function') {
            const layerStyleFunction = layer.getStyle();

            // check what kind of result we can expect
            let layerStyle = layerStyleFunction(feature, resolution);

            if (Array.isArray(layerStyle)) {
              // case result is an style array
              const resultArray = [selectStyle];

              // add the array elements to the result Array
              layerStyle.forEach(item => resultArray.push(item));

              return resultArray;
            } else {
              // classic case that result is a simple style
              return [selectStyle, layerStyleFunction(feature, resolution)]
            }
          } else {
            return [selectStyle, layer.getStyle()]
          }
        }
      });
    } else {
      selectClick = new SelectInteraction({
        layers: [layer]
      })
    }

    // necessary for identifying referenced layer
    selectClick.set('lid', layer.get('lid'));

    // forward an event if feature selection changes
    selectClick.on('select', function (evt) {
      WguEventBus.$emit(
        'map-selectionchange',
        layer.get('lid'),
        evt.selected,
        evt.deselected
      );
    });

    return selectClick;
  }
};

export default MapInteractionUtil;
