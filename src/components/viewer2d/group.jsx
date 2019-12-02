import React from 'react';
import PropTypes from 'prop-types';
import If from '../../utils/react-if';
import * as SharedStyles from '../../shared-style';
import { ContextPropTypes, needsContext } from '../context';

const cx = 0;
const cy = 0;
const radius = 5;

const STYLE_CIRCLE = {
  fill: SharedStyles.MATERIAL_COLORS[500].orange,
  stroke: SharedStyles.MATERIAL_COLORS[500].orange,
  cursor: 'default'
};

function Group({ layer, group, translator}) {
  return (
    <g
      data-element-root
      data-prototype={group.prototype}
      data-id={group.id}
      data-selected={group.selected}
      data-layer={layer.id}
      style={group.selected ? { cursor: SharedStyles.CURSORS.drag } : {}}
      transform={`translate(${group.x},${group.y}) rotate(${group.rotation})`}
    >
      <If condition={group.selected}>
        <g
          data-element-root
          data-prototype={group.prototype}
          data-id={group.id}
          data-selected={group.selected}
          data-layer={layer.id}
          data-part="rotation-anchor"
        >
          <circle cx={cx} cy={cy} r={radius} style={STYLE_CIRCLE}>
            <title>{translator.t('Group\'s Barycenter')}</title>
          </circle>
        </g>
      </If>
    </g>
  )
}

Group.propTypes = {
  group: PropTypes.object.isRequired,
  layer: PropTypes.object.isRequired,
  scene: PropTypes.object.isRequired,
  translator: ContextPropTypes.translator
};

export default needsContext('translator')(Group);
