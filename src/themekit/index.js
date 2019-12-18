
import {isObject, isMappable, merge, get, has, map} from '../utils';
import InitialVars from './initial';
import Styles from './cstyles';
import { isStyleVar } from './var';
import * as Var from './var';
export * from './var';

export default class ThemeKit {

  constructor (m = null) {
    this.collection = m;
  }

  resolveComponent (Component) {
    const name = Component.styleName || Component.displayName || Component.name || null;
    const styles = Component.styles || {};

    if (!name) throw new Error('Could not determine the name of the passed component');

    const compStyles = {[name]: styles};

    let kit = this.collection ? merge(compStyles, this.collection) : compStyles;

    const tk = new ThemeKit(kit);
    const resolved = tk.resolve(name);

    return resolved;
  }

  lookup (path, alt) {
    if (this.collection && has(this.collection, path)) {
      let result = get(this.collection, path);

      if (isStyleVar(result)) {
        result = result.resolve(this);
      }

      // if we're resolving an object, and initial vars
      // also has that object, map on top
      if (isObject(result) && has(InitialVars, path)) {
        let source = get(InitialVars, path);

        if (isStyleVar(source)) {
          source = source.resolve(this);
        }

        if (isObject(source)) {
          return merge(this._resolveVars(source), this._resolveVars(result));
        }
      }
      return this._resolveVars(result);
    }

    return this._resolveVars(get(InitialVars, path, alt));
  }

  resolve (path = null, raw = false) {
    if (!path) {
      return raw ? this._resolveVars(this.collection) : Styles(this._resolveVars(this.collection));
    }

    let value = this.lookup(path);

    if (isObject(value)) {
      return raw ? value : Styles(value);
    }

    return value;
  }

  _resolveVars (source) {
    if (isStyleVar(source)) {
      source = source.resolve(this);
    }

    if (!isMappable(source, false)) return source;

    return map(source, (value) => this._resolveVars(value));
  }
}

ThemeKit.Styles = Styles;

Object.assign(ThemeKit, Var);
