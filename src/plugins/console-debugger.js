import { Component } from 'react';
import { ContextPropTypes, needsContext } from '../components/context';
import actions from '../actions/export';


export default @needsContext class ConsoleDebugger extends Component {

  store = null;
  hook = null;

  componentDidMount () {
    const { store, state } = this.props;

    window.ReactPlanner = {
      ...actions,

      get store () {
        return store;
      },

      get state () {
        return state;
      },

      do(actions, delay = 300) {
        actions = actions.reverse();
        let dispatch = store.dispatch;
        let dispatchAction = () => {
          console.info(`There are other ${actions.length} actions on stack`);
          if (actions.length === 0) return;
          dispatch(actions.pop());
          if (actions.length === 0) return;
          setTimeout(dispatchAction, delay);
        };
        setTimeout(dispatchAction, 0);
      }
    };
  }

  componentWillUnmount() {
    delete window.ReactPlanner;
  }

  render () { return null; }
}


ConsoleDebugger.propTypes = {
  ...ContextPropTypes,
}
