import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ContextPropTypes, needsContext } from '../components/context';
import debounce from '../utils/debounce';
const btoa = window.btoa;

const TIMEOUT_DELAY = 500;

export default @needsContext('state', 'store') class ImageSave extends Component {

  store = null;
  hook = null;

  constructor (props) {
    super(props);

    this.element = React.createRef();
  }

  componentDidMount () {

    const { inputElement, imageElement, store, delay = TIMEOUT_DELAY } = this.props;
    const inputTarget = document.querySelector(inputElement);
    const imgTarget = document.querySelector(imageElement);

    if (!inputTarget && !imgTarget) return;

    this.store = store;
    this.hook = debounce(this.onChange, delay);
    store.subscribe(this.hook);
  }

  componentWillUnmount() {
    if (!this.store) return;
    this.store.unsubscribe(this.hook);
  }

  onChange = () => {
    const { state } = this.props;
    const nextHashCode = state.hashCode();

    // scene is unchanged
    if ( nextHashCode === this.lastHashCode) return;

    this.lastHashCode = nextHashCode;

    this.saveToInput();
  }

  render () { return <g ref={this.element} />; }

  buildImage () {
      const scene = this.props.state.scene;
      const g = this.element.current.closest('svg').querySelector('.viewer2d-contents');
      const serializer = new XMLSerializer();

      const svg = document.createElementNS("http://www.w3.org/2000/svg", 'svg');
      svg.setAttributeNS(null, 'viewbox', `0 0 ${scene.width} ${scene.height}`);
      svg.setAttributeNS(null, 'width', scene.width);
      svg.setAttributeNS(null, 'height', scene.height);
      svg.append(g.cloneNode(true));

      return serializer.serializeToString(svg);
  }

  saveToInput () {
    const { inputElement, imageElement, onChange } = this.props;
    const inputTarget = document.querySelector(inputElement);
    const imgTarget = document.querySelector(imageElement);

    const xml = this.buildImage();
    if (inputTarget) inputTarget.value = xml;
    if (imgTarget) imgTarget.setAttribute('src', `data:image/svg+xml;base64,${btoa(xml)}`);
    if (onChange) onChange(xml);
  }
}

ImageSave.pluginTarget = 'svg';

ImageSave.propTypes = {
  onChange: PropTypes.func,
  storageKey: PropTypes.string,
  inputElement: PropTypes.string,
  imageElement: PropTypes.string,
  delay: PropTypes.number,

  state: ContextPropTypes.state,
  store: ContextPropTypes.store,
}
