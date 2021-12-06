import Overlay from 'ol/Overlay';

export default class HoverController {
  map = null;
  overlayEl = null;

  /**
   * Initializes the map hover functionality:
   * Adds a little tooltip like DOM element, wrapped as OL Overlay to the
   * map.
   * Registers a 'pointermove' event on the map and shows the layer's
   * 'hoverAttribute' if the layer is configured as 'hoverable'
   */
  constructor (map) {
    const me = this;
    let overlayEl;

    me.map = map;

    // create a span to show map tooltip
    overlayEl = document.createElement('span');
    overlayEl.classList.add('wgu-hover-tooltiptext');
    map.getTarget().append(overlayEl);

    me.overlayEl = overlayEl;

    // wrap the tooltip span in a OL overlay and add it to map
    me.overlay = new Overlay({
      element: overlayEl,
      stopEvent: false,
      className: 'wgu-hover-ol-overlay',
      autoPan: true,
      autoPanAnimation: {
        duration: 250
      }
    });
    map.addOverlay(me.overlay);

    // show tooltip if a hoverable feature gets hit with the mouse
    // TODO review why closure for this scope is required
    // map.on('pointermove', me.onPointerMove, me);
    map.on('pointermove', (event) => me.onPointerMove(event));
  }

  /**
   * Shows the hover tooltip on the map if an appropriate feature of a
   * 'hoverable' layer was hit with the mouse.
   *
   * @param  {Object} event The OL event for pointermove
   */
  onPointerMove (event) {
    const me = this;
    const map = me.map;
    const overlayEl = me.overlayEl;
    let hoverAttr;
    const features = map.getFeaturesAtPixel(event.pixel, { layerFilter: (layer) => {
      if (layer.get('hoverable')) {
        hoverAttr = layer.get('hoverAttribute');
      }
      return layer.get('hoverable');
    } });
    if (!features || features.length === 0 || !hoverAttr) {
      hoverAttr = null;
      overlayEl.innerHTML = null;
      me.overlay.setPosition(undefined);
      return;
    }
    const feature = features[0];
    var attr = feature.get(hoverAttr);
    overlayEl.innerHTML = attr;
    me.overlay.setPosition(event.coordinate);
  }
};
