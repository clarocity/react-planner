import React, {Component} from 'react';
import PropTypes from 'prop-types';
import { ContextPropTypes, needsContext } from '../context';
import {StyleAlias} from '../../themekit';

export default
@needsContext('styles', 'state')
class Vertex extends Component {

  static styles = {
    root: {
      fill: new StyleAlias('grid.vertex.fill'),
      stroke: new StyleAlias('grid.vertex.stroke'),
      cursor: new StyleAlias('cursors.moveVertex'),

      '#active': {
        fill: new StyleAlias('grid.vertex.stroke'),
        stroke: new StyleAlias('grid.vertex.fill'),
      },

      '#alt': {
        cursor: new StyleAlias('cursors.moveAdd'),
      },
    }
  }

  render () {
    const {styles, vertex, layer, state} = this.props;
    const {x, y, dragging} = vertex;

    const STYLE = styles.compile(
      'root',
      dragging && '#active',
      state.alternate && '#alt'
    );

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
}

Vertex.propTypes = {
  vertex: PropTypes.object.isRequired,
  layer: PropTypes.object.isRequired,

  state: ContextPropTypes.state,
  styles: ContextPropTypes.styles,
};
