import React, { Component } from 'react';
import { ContextPropTypes, needsContext } from '../components/context';
import Snap from '../components/viewer2d/snap';

export default @needsContext('state') class ShowSnaps extends Component {

  render () {
    const { scene, snapElements } = this.props.state;

    return (
      <g>
        {snapElements.map((snap,id) =>
          <Snap key={id} snap={snap} width={scene.width} height={scene.height}/>)}
      </g>
    );
  }
}

ShowSnaps.pluginTarget = 'svg';

ShowSnaps.propTypes = {
  state: ContextPropTypes.state,
}
