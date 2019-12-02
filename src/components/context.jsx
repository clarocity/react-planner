import React from 'react';
import PropTypes from 'prop-types';
import { ReactReduxContext } from 'react-redux';
import ThemeKit from '../themekit';
import memoize from 'memoize-one';
import {pick} from '../utils';

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

  toolbarButtons: PropTypes.arrayOf(PropTypes.elementType),
  sidebarPanels: PropTypes.arrayOf(PropTypes.elementType),

  styles: PropTypes.object,
  themekit: PropTypes.object,
  translator: PropTypes.object,
  catalog: PropTypes.object,
  state: PropTypes.object,
  store: PropTypes.object,
  events: PropTypes.object,
};

export const Consumer = Context.Consumer;
Consumer.displayName = 'PlannerContextConsumer';

export class Provider extends React.PureComponent {

  // Memoizing this so that it doesn't make a new ThemeKit object every render and break
  // memoization further down the component tree
  tk = memoize((t) => new ThemeKit(t))

  render () {
    const { theme, children, ...passThru } = this.props;
    const themekit = this.tk(theme);
    return (
      <ReactReduxContext.Consumer>{({ store }) => (
        <Context.Provider value={{ themekit, store, ...passThru }}>{children}</Context.Provider>
      )}</ReactReduxContext.Consumer>
    );
  }
}

Provider.displayName = 'PlannerContextProvider';

Provider.propTypes = {
  children: PropTypes.node,
  ...ContextPropTypes,
}

export function needsFullContext (Component) {
  if (!Component) throw new Error('needsContext did not receive a component. Did you use this as a decorator function?');

  const resolver = memoize((tk) => {
    return tk.resolveComponent(Component);
  });

  function ContextWrapper (props) {
    return (
      <Context.Consumer>{(context) => {
        const styles = resolver(context.themekit);
        return <Component {...props} styles={styles} {...context} />
      }}</Context.Consumer>
    )
  }
  ContextWrapper.displayName = Component.displayName || Component.name || 'UnknownComponent';
  return ContextWrapper;
}

export function needsContext (...propNames) {
  if (!propNames.length || typeof propNames[0] !== 'string') throw new Error('needsContext did not receive a list of props to include');

  const needsStyles = propNames.includes('styles');

  return function (Component) {
    if (!Component) throw new Error('needsContext did not receive a component. Did you use this as a decorator function?');

    const resolver = needsStyles && memoize((tk) => {
      return tk.resolveComponent(Component);
    });

    function ContextWrapper (props) {
      return (
        <Context.Consumer>{(context) => {
          const styles = needsStyles && resolver(context.themekit);
          const mixed = pick({ styles, ...context }, propNames);
          return <Component {...props} {...mixed} />
        }}</Context.Consumer>
      )
    }
    ContextWrapper.displayName = Component.displayName || Component.name || 'UnknownComponent';
    return ContextWrapper;
  }
}

export default {
  Context,
  ContextPropTypes,
  Consumer,
  Provider,
  needsFullContext,
  needsContext,
};
