
import React from 'react';
import PropTypes from 'prop-types';
import memoize from 'memoize-one';

function flattenObject (input) {
  const result = {};

  function append (parentKey, key, value) {
    if (value && typeof value === 'object') {
      descend(parentKey ? parentKey + '.' + key : key, value);
    } else {
      result[parentKey ? parentKey + '.' + key : key] = value;
    }
  }

  function descend (parentKey, into) {
    if (into instanceof Map) {
      for (const [key, value] of input) append(parentKey, key, value);
      return;
    }

    if (Array.isArray(into)) {
      for (const [key, value] of into.entries()) append(parentKey, key, value);
      return;
    }

    for (const [key, value] of Object.entries(into)) append(parentKey, key, value);
  }

  descend('', input);
  return result;
}

const InitialVars = flattenObject({
  chrome: {
    backgroundColor: '#28292D',
  }
});

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

function mapStyles (componentName, componentStyleSets, tk) {
  const result = {};
  for (const [key, styleSet] of Object.entries(componentStyleSets)) {
    const lookup = `${componentName}.${key}`;
    result[key] = overlayStyle(styleSet, tk && tk.get(lookup), tk);
  }
  return result;
}

function overlayStyle (inputA, inputB, tk) {
  const result = { ...inputA, ...inputB };
  for (const [key, value] of Object.entries(result)) {
    if (value instanceof StyleVar) {
      result[key] = value.fetch(tk);
    }
  }
  return result;
}

export function themed (Component) {
  if (!Component) throw new Error('themed did not receive a component. Did you use this as a decorator function?');
  const name = Component.displayName || Component.name || 'UnknownComponent';
  const styleName = Component.styleName || name;
  const original = Component.styles || {};
  const smap = memoize(mapStyles);

  function ThemeKitWrapper (props) {
    return (
      <ThemeKitConsumer>{(tk) => (
        <Component styles={smap(styleName, original, tk)} {...props} />
      )}</ThemeKitConsumer>
    );
  }

  ThemeKitWrapper.displayName = name;
  return ThemeKitWrapper;
}

export class StyleVar {
  constructor (address, def) {
    this.address = address;
    this.default = def;
  }

  fetch (tk) {
    return tk.has(this.address) ? tk.get(this.address) : this.default;
  }
}

export default class ThemeKit extends Map {
  constructor (input) {
    if (input instanceof ThemeKit) {
      super(input);
      return;
    }

    super(Object.entries(InitialVars));

    if (input && typeof input === 'object') {
      for (const [key, value] of Object.entries(flattenObject(input))) {
        this.set(key, value);
      }
    }
  }
}

ThemeKit.Provider = ThemeKitProvider;
ThemeKit.Consumer = ThemeKitConsumer;
ThemeKit.StyleVar = StyleVar;
