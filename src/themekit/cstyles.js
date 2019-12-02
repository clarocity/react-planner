
import {isObject, isString, merge, get, pick} from '../utils';

export default function ComponentStyles (resolved) {
  const result = Object.create(resolved);
  result._root = resolved;
  Object.assign(result, ComponentStyles.prototype);

  return result;
}

ComponentStyles.prototype = {
  constructor: ComponentStyles,

  compile (...directives) {
    return pick(this.compileRaw(...directives), isValidCss);
  },

  compileRaw (...directives) {
    let result = this._root;

    let target = '';
    let previous = result;
    let current = result;

    for (let directive of directives.filter(Boolean)) {
      if (isObject(directive)) {
        result = merge(result, directive);
        continue;
      }

      if (isString(directive)) directive = directive.split(/\.|(?=#)/);

      for (let alias of directive) {
        // wut u doin?
        if (!alias || !isString(alias)) continue;

        if (alias[0] === '#') {
          if (current[alias]) result = merge(result, current[alias]);
          if (current[target + alias]) result = merge(result, current[target + alias]);
          if (previous[target + alias]) result = merge(result, previous[target + alias]);
          continue;
        }

        if (!result[alias]) throw new Error(`ComponentStyles could not locate styles for "${alias}"`);

        target = alias;
        previous = current;
        result = current = result[alias];
      }
    }

    return result;
  },

  get: function (path) {
    return get(this._root, path);
  }
};

function isValidCss (value, key) {
  if (isObject(value)) return false;
  if (key[0] === '#') return false;
  return true;
}
