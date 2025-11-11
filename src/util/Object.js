/**
 * Object related utility methods.
 */
const ObjectUtil = {

  /**
   * Tests whether item is an object
   * @param {*} item The item to test.
   * @returns {Boolean} True if the item is an object.
   */
  isObject (item) {
    return (item && typeof item === 'object' && !Array.isArray(item));
  },

  /**
   * Deep in place merge of source object into target object.
   * @param {Object} target The target of the merge operation.
   * @param {Object} source The source of the merge operation.
   */
  mergeDeep (target, source) {
    if (ObjectUtil.isObject(target) && ObjectUtil.isObject(source)) {
      for (const key in source) {
        if (ObjectUtil.isObject(source[key])) {
          if (!target[key]) {
            Object.assign(target, { [key]: {} });
          }
          ObjectUtil.mergeDeep(target[key], source[key]);
        } else {
          Object.assign(target, { [key]: source[key] });
        }
      }
    }
  },

  /**
   * Recursively list all property paths in an object.
   *
   * @param {Object} item An object to extract property paths from.
   * @param {String} [path] Optional, internal usage for recursion.
   * @returns {Array} An array containing all paths to keys of the object.
   */
  toPaths (item, path = '') {
    const result = [];
    if (item && typeof item === 'object') {
      if (Array.isArray(item)) {
        for (let i = 0; i < item.length; i++) {
          result.push(...ObjectUtil.toPaths(item[i], path + '[' + i + ']'));
        }
      } else {
        for (const p in item) {
          result.push(...ObjectUtil.toPaths(item[p], path + '.' + p));
        }
      }
    } else {
      result.push(path);
    }
    return result;
  },

  /**
   * Returns the value from an object using a case-insensitive key.
   *
   * @param {Object} obj The object to search in
   * @param {String} key The key to retrieve value for
   * @returns {*} The value for the given key or undefined, if not found
   */
  getValueIgnoreCase (obj, key) {
    if (typeof obj !== 'object' || obj === null) {
      console.warn('getValueIgnoreCase: First argument must be a valid object');
      return;
    }
    if (typeof key !== 'string') {
      console.warn('getValueIgnoreCase: Second argument must be a string');
      return;
    }

    const lowerCaseKey = key.toLowerCase();

    for (const objKey in obj) {
      if (Object.prototype.hasOwnProperty.call(obj, objKey) && objKey.toLowerCase() === lowerCaseKey) {
        return obj[objKey];
      }
    }

    return undefined; // key not found
  }
}

export default ObjectUtil;
