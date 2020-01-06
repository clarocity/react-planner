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
    const { store, delay = TIMEOUT_DELAY } = this.props;

    let scene = this.loadFromInput();
    if (scene === false) {
      scene = this.loadFromLocalStorage();
    }

    if (scene) store.dispatch(loadProject(scene));
    if (scene === false) return;

    this.store = store;
    this.hook = debounce(this.onChange, delay);
    store.subscribe(this.hook);
  }

  componentWillUnmount() {
    if (!this.store) return;
    this.store.unsubscribe(this.hook);
  }

  onChange = () => {
    const { state, onChange } = this.props;
    const nextHashCode = state.hashCode();

    // scene is unchanged
    if ( nextHashCode === this.lastHashCode) return;

    this.lastHashCode = nextHashCode;
    const scene = state.scene.toJS();

    this.saveToLocalStorage(scene);
    this.saveToInput(scene);
    if (onChange) onChange(scene);

  }

  render () { return null; }

  saveToLocalStorage (sceneJson) {
    if (!localStorage) return;
    const { storageKey } = this.props;
    localStorage.setItem(storageKey, JSON.stringify(sceneJson));
  }

  saveToInput (sceneJson) {
    const { inputElement } = this.props;
    const target = document.querySelector(inputElement);
    if (!target) return;

    target.value = JSON.stringify(sceneJson, null, 2);
  }

  loadFromLocalStorage () {
    if (!localStorage) return false;
    const { storageKey } = this.props;
    const json = localStorage.getItem(storageKey);
    if (!json) return null;

    try {
      return json && JSON.parse(json) || null;
    } catch (e) {
      return null;
    }
  }

  loadFromInput () {
    const { inputElement } = this.props;
    const target = document.querySelector(inputElement);
    if (!target) return false;

    try {
      return target.value && JSON.parse(target.value) || null;
    } catch (e) {
      return null;
    }
  }
}


AutoSave.propTypes = {
  onChange: PropTypes.func,
  storageKey: PropTypes.string,
  inputElement: PropTypes.string,
  delay: PropTypes.number,

  state: ContextPropTypes.state,
  store: ContextPropTypes.store,
}
