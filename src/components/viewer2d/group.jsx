import React from 'react';
import PropTypes from 'prop-types';
import If from '../../utils/react-if';
import { ContextPropTypes, needsContext } from '../context';
import {StyleAlias} from '../../themekit';

const cx = 0;
const cy = 0;
const radius = 5;


function Group({ styles, layer, group, translator}) {
  return (
    <g
      data-element-root
      data-prototype={group.prototype}
      data-id={group.id}
      data-selected={group.selected}
      data-layer={layer.id}
      style={group.selected ? styles.selected : {}}
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
          <circle cx={cx} cy={cy} r={radius} style={styles.circle}>
            <title>{translator.t('Group\'s Barycenter')}</title>
          </circle>
        </g>
      </If>
    </g>
  )
}

Group.styles = {
  circle: {
    fill: new StyleAlias('group.select'),
    stroke: new StyleAlias('group.select'),
    cursor: new StyleAlias('cursors.default'),
  },

  selected: {
    cursor: new StyleAlias('cursors.drag'),
  }
}

Group.propTypes = {
  group: PropTypes.object.isRequired,
  layer: PropTypes.object.isRequired,
  styles: ContextPropTypes.styles,
  translator: ContextPropTypes.translator
};

export default needsContext('translator', 'styles')(Group);
