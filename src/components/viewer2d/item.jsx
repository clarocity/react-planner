import React from 'react';
import PropTypes from 'prop-types';
import * as SharedStyle from '../../shared-style';
import If from '../../utils/react-if';
import { ContextPropTypes, needsContext } from '../context';

const STYLE_CIRCLE = {
  fill: "#0096fd",
  stroke: "#0096fd",
  cursor: SharedStyle.CURSORS.rotate
};

const STYLE_CIRCLE2 = {
  fill: "none",
  stroke: "#0096fd",
  cursor: SharedStyle.CURSORS.rotate
};

function Item ({layer, item, scene, catalog, state}) {

  let {x, y, rotation} = item;

  let renderedItem = catalog.getElement(item.type).render2D(item, layer, scene);

  const STYLE = {};
  if (item.selected) {
    if (state.alterate) {
      STYLE.cursor = SharedStyle.CURSORS.moveAdd;
    } else {
      STYLE.cursor = SharedStyle.CURSORS.move;
    }
  }

  return (
    <g
      data-element-root
      data-prototype={item.prototype}
      data-id={item.id}
      data-selected={item.selected}
      data-layer={layer.id}
      style={STYLE}
      transform={`translate(${x},${y}) rotate(${rotation})`}>

      {renderedItem}
      <If condition={item.selected}>
        <g data-element-root
           data-prototype={item.prototype}
           data-id={item.id}
           data-selected={item.selected}
           data-layer={layer.id}
           data-part="rotation-anchor"
        >
          <circle cx="0" cy="150" r="10" style={STYLE_CIRCLE}/>
          <circle cx="0" cy="0" r="150" style={STYLE_CIRCLE2}/>
        </g>
      </If>
    </g>
  )
}

Item.propTypes = {
  item: PropTypes.object.isRequired,
  layer: PropTypes.object.isRequired,
  scene: PropTypes.object.isRequired,
  catalog: PropTypes.object.isRequired,
  ...ContextPropTypes,
};

export default needsContext(Item);


