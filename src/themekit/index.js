
import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';
import {isObject, isMappable, merge, get, has, map} from './utils';
import InitialVars from './initial';
import Styles from './cstyles';
import { StyleVar, StyleAlias, CompoundStyle } from './var';

export { StyleVar, StyleAlias, CompoundStyle };

export const Theme = React.createContext(null);

export const ThemeKitConsumer = Theme.Consumer;
ThemeKitConsumer.displayName = 'ThemeConsumer';

export class ThemeKitProvider extends React.PureComponent {

  // Memoizing this so that it doesn't make a new ThemeKit object every render and break
  // memoization further down the component tree
  tk = memoize((t) => new ThemeKit(t))

  render () {
    const themekit = this.tk(this.props.themekit);
    return (
      <Theme.Provider value={themekit}>{this.props.children}</Theme.Provider>
    );
  }
}

ThemeKitProvider.propTypes = {
  children: PropTypes.node,
  themekit: PropTypes.oneOfType([
    PropTypes.instanceOf(ThemeKit),
    PropTypes.instanceOf(Map),
    PropTypes.object,
  ]),
}

export function themed (Component) {
  if (!Component) throw new Error('themed did not receive a component. Did you use this as a decorator function?');
  const name = Component.displayName || Component.name || 'UnknownComponent';
  const resolver = memoize((tk) => {
    return tk.resolveComponent(Component);
  });

  function ThemeKitWrapper (props) {
    return (
      <ThemeKitConsumer>{(tk) => {
        const styles = resolver(tk);
        return <Component themekit={tk} styles={styles} {...props} />
      }}</ThemeKitConsumer>
    );
  }

  ThemeKitWrapper.displayName = name;
  return ThemeKitWrapper;
}

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

      if (result instanceof StyleVar) {
        result = result.resolve(this);
      }

      // if we're resolving an object, and initial vars
      // also has that object, map on top
      if (isObject(result) && has(InitialVars, path)) {
        let source = get(InitialVars, path);

        if (source instanceof StyleVar) {
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
    if (source instanceof StyleVar) {
      source = source.resolve(this);
    }

    if (!isMappable(source, false)) return source;

    return map(source, (value) => this._resolveVars(value));
  }
}

ThemeKit.Provider = ThemeKitProvider;
ThemeKit.Consumer = ThemeKitConsumer;
ThemeKit.StyleAlias = StyleAlias;
ThemeKit.Styles = Styles;
