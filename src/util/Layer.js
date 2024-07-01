import ViewAnimationUtil from './ViewAnimation';

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
      return [];
    }

    const layerMatches = [];
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
  },

  /**
   * Zooms to the given layer's extent.
   * Will only work if the layer has kind of vector source.
   *
   * @param  {ol.layer.Base} vecLayer OL vector layer
   * @param  {ol.Map} olMap           The map to perform the zoom on
   */
  zoomToLayerExtent (vecLayer, olMap) {
    if (!vecLayer || !vecLayer.getSource().getExtent || !olMap) {
      return;
    }
    const extent = vecLayer.getSource().getExtent();
    ViewAnimationUtil.to(olMap.getView(), extent);
  }
}

export default LayerUtil;

/**
 * Transparent proxy around an OpenLayers layer to be used in Vue components
 * when reactive layer properties are required.
 */
export class LayerProxy {
  /**
   * @param {ol.layer.Base} layer OL layer
   * @param {Array} properties An array of property key names which need to be
   * accessed on the layer.
   */
  constructor (layer, properties) {
    this.layer = layer;
    this.properties = {};
    this.changeListeners = {};
    properties.forEach(property => {
      this.properties[property] = layer.get(property);
      this.changeListeners[property] = () => {
        this.properties[property] = layer.get(property);
      };
      layer.on(`change:${property}`, this.changeListeners[property]);
    });

    // Forward everything transparently to the underlying OL layer. The get()
    // and getProperties() methods are trapped and handled by the proxy.
    // Remarks: Neither set() nor setProperties() have to be handled. Property
    //  setters operate on the OL layer and then get synced into the proxy via
    //  observables.
    return new Proxy(this, {
      get: function (target, prop, receiver) {
        if (prop in target.layer && !['get', 'getProperties'].includes(prop)) {
          const p = target.layer[prop];
          return (typeof p === 'function') ? p.bind(target.layer) : p;
        }
        return Reflect.get(target, prop, receiver);
      }
    });
  }

  /**
   * Gets a value. The property name must be registered in the constructor.
   * @param {String} property Key name.
   * @returns {String} Value.
   */
  get (property) {
    return this.properties[property];
  }

  /**
   * Get an object of all property names and values registered for in the
   * constructor.
   * @returns {Object} Object.
   */
  getProperties () {
    return this.properties;
  }

  /**
   * Get the OL layer object wrapped by this proxy.
   * @returns {ol.layer.Base} OL layer
   */
  getLayer () {
    return this.layer;
  }

  /**
   * Destroy the proxy object. This must be invoked before the proxy goes out
   * of scope to prevent dangling change notifications.
   */
  destroy () {
    Object.keys(this.changeListeners).forEach(property => {
      this.layer.un(`change:${property}`, this.changeListeners[property]);
    });
  }
}

/**
 * Transparent proxy around an OpenLayers collection for layers to be used in
 * Vue components when reactive layer properties are required.
 */
export class LayerCollectionProxy {
  /**
   * @param {ol.Collection<ol.layer.Base>} collection OL collection of layers
   * @param {Array} properties An array of property key names which need to be
   * accessed on the layers.
   */
  constructor (collection, properties) {
    this.collection = collection;
    this.layerProxies = [];

    const createLayerProxy = (layer) => new LayerProxy(layer, properties);

    // Sync against the underlying collection while retaining the order of
    // elements.
    // Remarks: A layer proxy must be destroyed before it goes out of scope.
    // To support reactivity the instance of layerProxies must be preserved and
    // the length property may not be invoked - see
    // https://v2.vuejs.org/v2/guide/reactivity.html#For-Arrays
    this.syncLayers = () => {
      const newLayerProxies = [];
      this.collection.forEach(layer => {
        let layerProxy = this.layerProxies.find(proxy => proxy.getLayer() === layer);
        if (!layerProxy) {
          layerProxy = createLayerProxy(layer);
        }
        newLayerProxies.push(layerProxy);
      });

      this.layerProxies.forEach(layerProxy => {
        if (!newLayerProxies.includes(layerProxy)) {
          layerProxy.destroy();
        }
      });

      this.layerProxies.splice(0);
      this.layerProxies.push(...newLayerProxies);
    };

    this.syncLayers();

    this.collection.on('change:length', this.syncLayers);

    // Forward everything transparently to the underlying OL collection.
    // The forEach() and getArray() and item() methods are trapped and handled
    // by the proxy.
    // Remarks: Methods which alter the collection are not handled.
    //  These operate on the OL collection and changes get synced into the
    //  proxy via observables. The methods pop(), push(), remove(),
    //  removeAt(), setAt() will operate on OL base layer arguments. Therefore
    //  returned objects by these methods will not properly support reactivity.
    return new Proxy(this, {
      get: function (target, prop, receiver) {
        if (prop in target.collection &&
          !['forEach', 'getArray', 'item'].includes(prop)) {
          const p = target.collection[prop];
          return (typeof p === 'function') ? p.bind(target.collection) : p;
        }
        return Reflect.get(target, prop, receiver);
      }
    });
  }

  /**
   * Iterate over each element, calling the provided callback.
   * @param {function} f The function to call for every element. This function
   * takes 3 arguments (the element, the index and the array). The return value
   * is ignored.
   */
  forEach (f) {
    this.layerProxies.forEach(f)
  }

  /**
   * Get an array of LayerProxy objects for all layers in the collection.
   * @returns {Array<LayerProxy>} Array of LayerProxy objects.
   */
  getArray () {
    return this.layerProxies;
  }

  /**
   * Get the LayerProxy at the provided index.
   * @param {Number} index Index.
   * @returns Element.
   */
  item (index) {
    return this.layerProxies[index];
  }

  /**
   * Get the OL collection object wrapped by this proxy.
   * @returns {ol.Collection<ol.layer.Base>} OL collection of layers
   */
  getCollection () {
    return this.collection;
  }

  /**
  * Destroy the proxy object. This must be invoked before the proxy goes out of scope.
  */
  destroy () {
    this.collection.un('change:length', this.syncLayers);
    this.layerProxies.forEach(layerProxy => {
      layerProxy.destroy();
    });
  }
}
