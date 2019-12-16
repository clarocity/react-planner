import React from 'react';
import PropTypes from 'prop-types';
import Scene from './scene';
import Snap from './snap';
import Guides from './guides';

export default function State({state}) {

  let {activeSnapElement, scene} = state;

  return (
    <g transform={`translate(0, ${scene.height}) scale(1, -1)`} id="svg-drawing-paper">

      <Scene scene={scene} />
      <Guides />
      {!!activeSnapElement &&
        <Snap snap={activeSnapElement} width={scene.width} height={scene.height}/>
      }
    </g>
  )
}

State.propTypes = {
  state: PropTypes.object.isRequired,
};
