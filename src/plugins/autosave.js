const localStorage = window.hasOwnProperty('localStorage') ? window.localStorage : false;
import { Component } from 'react';
import PropTypes from 'prop-types';
import { ContextPropTypes, needsContext } from '../components/context';
import debounce from '../utils/debounce';
import { loadProject } from '../actions/project-actions';

const TIMEOUT_DELAY = 500;

export default @needsContext('state', 'store') class AutoSave extends Component {

  store = null;
  hook = null;

  componentDidMount () {
    const { store, storageKey, delay = TIMEOUT_DELAY } = this.props;

    if (!localStorage) return;


    if (localStorage.getItem(storageKey) !== null) {
      let data = localStorage.getItem(storageKey);
      let json = JSON.parse(data);
      store.dispatch(loadProject(json));
    }

    this.store = store;
    this.hook = debounce(this.onChange.bind(this), delay);
    store.subscribe(this.hook);
  }

  componentWillUnmount() {
    this.store.unsubscribe(this.hook);
  }

  onChange () {
    let { state, storageKey } = this.props;
    const scene = state.scene.toJS();
    localStorage.setItem(storageKey, JSON.stringify(scene));
    // console.log('Autosaved', scene);
  }

  render () { return null; }
}


AutoSave.propTypes = {
  storageKey: PropTypes.string.isRequired,
  delay: PropTypes.number,

  state: ContextPropTypes.state,
  store: ContextPropTypes.store,
}
