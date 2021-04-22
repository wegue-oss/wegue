import SelectInteraction from 'ol/interaction/Select';
import { WguEventBus } from '../WguEventBus.js';
import { OlStyleFactory } from '../factory/OlStyle.js'
import StyleUtil from './Style.js';

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

      // append selectStyle to original style of layer
      const combinedStyle = StyleUtil.appendStyle(layer.getStyle(), selectStyle);

      selectClick = new SelectInteraction({
        layers: [layer],
        style: combinedStyle
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
