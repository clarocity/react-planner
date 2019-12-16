import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Layer from './layer';
import Grid from './grid';

export default class Scene extends Component {

  shouldComponentUpdate(nextProps /*, nextState */) {
    return this.props.scene.hashCode() !== nextProps.scene.hashCode();
  }

  render() {
    let {scene} = this.props;
    let {layers} = scene;
    let selectedLayer = layers.get(scene.selectedLayer);

    return (
      <g>
        <Grid />

        <g style={{pointerEvents: 'none'}}>
          {
            layers
            .entrySeq()
            .filter(([layerID, layer]) => layerID !== scene.selectedLayer && layer.visible)
            .map(([layerID, layer]) => <Layer key={layerID} layer={layer} scene={scene} />)
          }
        </g>

        <Layer key={selectedLayer.id} layer={selectedLayer} scene={scene} />
      </g>
    );
  }
}


Scene.propTypes = {
  scene: PropTypes.object.isRequired,
};
