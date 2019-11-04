import React from 'react';
import PropTypes from 'prop-types';
import * as SharedStyle from '../../shared-style';
import { ContextPropTypes, needsContext } from '../context';

const STYLE_DEFAULT  = {fill: "#0096fd", stroke: SharedStyle.COLORS.white, cursor: SharedStyle.CURSORS.moveVertex};
const STYLE_SELECTED = {fill: SharedStyle.COLORS.white, stroke: "#0096fd"};
const STYLE_ALTERATIVE = {cursor: SharedStyle.CURSORS.moveAdd};

function Vertex({vertex, layer, state}) {

  let {x, y} = vertex;
  const STYLE = {
    ...STYLE_DEFAULT,
    ...(vertex.dragging && STYLE_SELECTED),
    ...(state.alternate && STYLE_ALTERATIVE),
  }
  return (
    <g
      transform={`translate(${x}, ${y})`}
      data-element-root
      data-prototype={vertex.prototype}
      data-id={vertex.id}
      data-selected={vertex.selected}
      data-layer={layer.id}
    >
      <circle cx="0" cy="0" r="7" style={STYLE}/>
    </g>
  );
}

Vertex.propTypes = {
  vertex: PropTypes.object.isRequired,
  layer: PropTypes.object.isRequired,
  ...ContextPropTypes,
};

export default needsContext(Vertex);
