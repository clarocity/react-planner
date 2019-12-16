
export function isString (input) { return typeof input === 'string'; }

export function isObject (input) {
  if (!input) return false;
  if (typeof input !== 'object') return false;
  if (Array.isArray(input)) return false;
  if (!(input instanceof Object)) return false;
  if (input.constructor !== Object.prototype.constructor) return false;
  return true;
}

export function hasOwn (obj, key) {
  return Object.prototype.hasOwnProperty.call(obj, key);
}

export function merge (...sources) {
  const result = {};
  for (const source of sources) {
    if (!source) continue;
    for (const [key, value] of Object.entries(source)) {
      if (isObject(value)) {
        if (isObject(result[key])) {
          result[key] = merge(result[key], value);
        } else {
          result[key] = merge(value);
        }
      } else {
        result[key] = value;
      }
    }
  }
  return result;
}

export function get (obj, path, defaultValue) {
  if (typeof path === 'number') path = [String(path)]
  else if (isString(path)) path = String.prototype.split.call(path, /[,[\].]+?/);
  const result = path
    .filter((s) => s !== null && s !== undefined && s !== '')
    .reduce((res, key) => (res !== null && res !== undefined) ? res[key] : res, obj);
  return (result === undefined || result === obj) ? defaultValue : result;
}

export function has (obj, path) {
  if (typeof path === 'number') path = [String(path)]
  else if (isString(path)) path = String.prototype.split.call(path, /[,[\].]+?/);
  let res = obj;
  for (const key of path) {
    if (res === null || res === undefined) return false;
    if (typeof res !== 'object' && typeof res !== 'function') return false;
    if (!hasOwn(res, key)) return false;
    res = res[key];
  }
  return true;
}

export function isMappable (collection, arrays = true) {
  return (
    (arrays && Array.isArray(collection)) ||
    (arrays && collection instanceof Set) ||
    collection instanceof Map ||
    collection && (typeof collection === 'object' || typeof collection === 'function')
  );
}

export function map (collection, cb) {
  if (Array.isArray(collection)) {
    return collection.map((value, i) => cb(value, i, i));
  }

  if (collection instanceof Set) {
    return Array.from(collection, (value, i) => cb(value, i, i));
  }

  return mapReduce(collection, (value, key, index) => [ key, cb(value, key, index)]);
}

export function omit (collection, keys) {
  if (typeof keys === 'function') {
    return mapReduce(collection, (value, key, index) =>
      keys(value, key, index)
        ? [ undefined, undefined ]
        : [ key, value ]
    )
  }

  if (isString(keys)) {
    keys = [keys];
  }

  if (!Array.isArray(keys)) throw new Error('pick requires a string or array of strings');
  return mapReduce(collection, (value, key) =>
    keys.includes(key)
      ? [ undefined, undefined ]
      : [ key, value ]
  )
}

export function pick (collection, keys) {
  if (typeof keys === 'function') {
    return mapReduce(collection, (value, key, index) =>
      keys(value, key, index)
        ? [ key, value ]
        : [ undefined, undefined ]
    )
  }

  if (isString(keys)) {
    keys = [keys];
  }

  if (!Array.isArray(keys)) throw new Error('pick requires a string or array of strings');
  return keys.reduce((obj, key) => {
    if (collection && hasOwn(collection, key)) {
      obj[key] = collection[key];
    }
    return obj;
  }, {});
}

/**
 * Iterates over a collection and generates an object based on tuple returned from the iteratee.
 * @param  {Object|Array|Map|Set} collection
 * @param  {Function} iteratee Callback invoked for each item, receives `value, key, index`, returns `[key, value]`;
 * @return {Object}
 */
export function mapReduce (collection, cb) {
  if (!collection) return {};

  const result = {};
  function iterate (v, k, i) {
    // return true to continue looping
    const res = cb(v, k, i) || [];
    if (res === false) return false;
    if (!res) return true;
    const [ key, value ] = res;
    if (key === undefined || key === null || value === undefined) return true;
    result[key] = value;
    return true;
  }

  if (Array.isArray(collection)) {
    for (let i = 0; i < collection.length; i++) {
      if (!iterate(collection[i], i, i)) break;
    }
    return result;
  }

  if (collection instanceof Set) {
    let i = 0;
    for (const item of collection) {
      if (!iterate(item, i, i++)) break;
    }
    return result;
  }

  // received a Map
  if (collection instanceof Map) {
    const keys = Array.from(collection.keys());
    for (let i = 0; i < keys.length; i++) {
      if (!iterate(collection.get(keys[i]), keys[i], i)) break;
    }
    return result;
  }

  // received an object hash
  if (collection && (typeof collection === 'object' || typeof collection === 'function')) {
    // iterating object
    const keys = Object.keys(collection);
    for (let i = 0; i < keys.length; i++) {
      if (!iterate(collection[keys[i]], keys[i], i)) break;
    }
    return result;
  }

  return result;
}

export function propCompare (prev, next, paths) {
  for (const path of paths) {
    const v1 = get(prev, path);
    const v2 = get(next, path);

    if (v1 !== v2) return false;
  }
  return true;
}
