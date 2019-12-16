import React, {Component} from 'react';
import PropTypes from 'prop-types';
import If from '../../utils/react-if';
import { ContextPropTypes, needsContext } from '../context';
import {StyleAlias} from '../../themekit';

export default
@needsContext('styles', 'state')
class Item extends Component {

  static styles = {
    root: {
      cursor: new StyleAlias('cursors.move'),

      '#alt': {
        cursor: new StyleAlias('cursors.moveAdd'),
      },
    },

    rotationAnchor: {
      fill: new StyleAlias('grid.target'),
      stroke: new StyleAlias('grid.target'),
      cursor: new StyleAlias('cursors.rotate'),
    },

    rotationArc: {
      fill: 'none',
      stroke: new StyleAlias('grid.target'),
    }
  }

  render () {
    const {styles, layer, item, scene, catalog, state} = this.props;
    const {x, y, rotation} = item;

    const STYLE = styles.compile('root', state.alternate && '#alt');
    const CatalogItem = catalog.getElement(item.type).render2D;

    return (
      <g
        key={item.id}
        data-element-root
        data-prototype={item.prototype}
        data-id={item.id}
        data-selected={item.selected}
        data-layer={layer.id}
        style={STYLE}
        transform={`translate(${x},${y}) rotate(${rotation})`}>

        <CatalogItem element={item} layer={layer} scene={scene} />

        <If condition={item.selected}>
          <g data-element-root
             data-prototype={item.prototype}
             data-id={item.id}
             data-selected={item.selected}
             data-layer={layer.id}
             data-part="rotation-anchor"
          >
            <circle cx="0" cy="150" r="10" style={styles.rotationAnchor}/>
            <circle cx="0" cy="0" r="150" strokeWidth="2" style={styles.rotationArc}/>
          </g>
        </If>
      </g>
    )
  }
}

Item.propTypes = {
  item: PropTypes.object.isRequired,
  layer: PropTypes.object.isRequired,
  scene: PropTypes.object.isRequired,
  catalog: PropTypes.object.isRequired,

  state: ContextPropTypes.state,
  styles: ContextPropTypes.styles,
};
