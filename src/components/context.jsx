import React from 'react';
import PropTypes from 'prop-types';

export const Context = React.createContext(null);

export const ContextPropTypes = {
  actions: PropTypes.exact({
    project:  PropTypes.object,
    viewer2D: PropTypes.object,
    viewer3D: PropTypes.object,
    lines:    PropTypes.object,
    holes:    PropTypes.object,
    scene:    PropTypes.object,
    vertices: PropTypes.object,
    items:    PropTypes.object,
    area:     PropTypes.object,
    groups:   PropTypes.object,
  }),

  translator: PropTypes.object,
  catalog: PropTypes.object,
  state: PropTypes.object,
};

export const Consumer = Context.Consumer;

export const Provider = function Provider ({ state, actions, translator, catalog, children }) {
  return (
    <Context.Provider value={{ state, actions, translator, catalog }}>{children}</Context.Provider>
  );
}

Provider.propTypes = {
  children: PropTypes.node,
  ...ContextPropTypes,
}

export function needsContext (Component) {
  if (!Component) throw new Error('needsContext did not receive a component. Did you use this as a decorator function?');
  return function ContextWrapper (props) { return (
    <Context.Consumer>{(context) =>
      <Component {...props} {...context} />
    }</Context.Consumer>
  )}
}

export default {
  Context,
  ContextPropTypes,
  Consumer,
  Provider,
  needsContext,
};
