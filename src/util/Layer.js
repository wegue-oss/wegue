import ViewAnimationUtil from './ViewAnimation';
import { reactive, toRaw, markRaw } from 'vue'

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
   * @param {Object} options          Optional animation configuration
   */
  zoomToLayerExtent (vecLayer, olMap, options) {
    if (!vecLayer || !vecLayer.getSource().getExtent || !olMap) {
      return;
    }
    const extent = vecLayer.getSource().getExtent();
    const viewAnimationUtil = new ViewAnimationUtil(options);
    viewAnimationUtil.to(olMap.getView(), extent);
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
   */
  constructor (layer) {
    this.layer = reactive(layer);
    this.properties = reactive({});

    // Set up listener to detect any property changes
    this.propertyChangeListener = (event) => {
      const key = event.key;
      const value = this.layer.get(key);

      if (value === undefined) {
        if (key in this.properties) {
          delete this.properties[key];
        }
      } else {
        this.properties[key] = value;
      }
    }
    this.layer.on('propertychange', this.propertyChangeListener);

    // Track existing properties
    Object.keys(layer.getProperties()).forEach(key => {
      this.properties[key] = layer.get(key);
    });

    // Forward everything transparently to the underlying OL layer. The get()
    // and getProperties() methods are trapped and handled by the proxy.
    // Remarks: Neither set() nor setProperties() have to be handled. Property
    //  setters operate on the OL layer and then get synced into the proxy via
    //  observables.
    const proxy = new Proxy(this, {
      get: function (target, prop, receiver) {
        if (prop in target.layer && !['get', 'getProperties'].includes(prop)) {
          const p = target.layer[prop];
          return (typeof p === 'function') ? p.bind(target.layer) : p;
        }
        return Reflect.get(target, prop, receiver);
      }
    });

    // Avoid Vue wrapping the proxy again.
    return markRaw(proxy);
  }

  /**
   * Gets a value of the layer.
   * @param {String} key Key name.
   * @returns {String} Value.
   */
  get (key) {
    return this.properties[key];
  }

  /**
   * Get all property names and values of the layer.
   * @returns {Object} Object.
   */
  getProperties () {
    return this.properties;
  }

  /**
   * Get the raw OL layer object wrapped by this proxy.
   * @returns {ol.layer.Base} OL layer
   */
  toRaw () {
    return toRaw(this.layer);
  }

  /**
   * Destroy the proxy object. This must be invoked before the proxy goes out
   * of scope to prevent dangling change notifications.
   */
  destroy () {
    this.layer.un('propertychange', this.propertyChangeListener);
  }
}

/**
 * Transparent proxy around an OpenLayers collection for layers to be used in
 * Vue components when reactive layer properties are required.
 */
export class LayerCollectionProxy {
  /**
   * @param {ol.Collection<ol.layer.Base>} collection OL collection of layers
   */
  constructor (collection) {
    this.collection = reactive(collection);
    this.layerProxies = reactive([]);

    const createLayerProxy = (layer) => new LayerProxy(layer);

    // Sync against the underlying collection while retaining the order of
    // elements.
    // Remarks: A layer proxy must be destroyed before it goes out of scope.
    // To minimize the overhead of creating layerProxies preserve existing
    // instances by merging.
    this.syncLayers = () => {
      const newLayerProxies = [];
      this.collection.forEach(layer => {
        let layerProxy = this.layerProxies.find(
          proxy => proxy.toRaw() === toRaw(layer));
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
    const proxy = new Proxy(this, {
      get: function (target, prop, receiver) {
        if (prop in target.collection &&
          !['forEach', 'getArray', 'item'].includes(prop)) {
          const p = target.collection[prop];
          return (typeof p === 'function') ? p.bind(target.collection) : p;
        }
        return Reflect.get(target, prop, receiver);
      }
    });

    // Avoid Vue wrapping the proxy again.
    return markRaw(proxy);
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
   * Get the raw collection object wrapped by this proxy.
   * @returns {ol.Collection<ol.layer.Base>} OL collection of layers
   */
  toRaw () {
    return toRaw(this.collection);
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
