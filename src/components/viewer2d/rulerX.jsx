import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ContextPropTypes, needsContext } from '../context';
import {StyleAlias, CompoundStyle} from '../../themekit';

export default @needsContext('styles') class RulerX extends Component {

  static styles = {
    root: {
      backgroundColor: new StyleAlias('rulers.backgroundColor'),
      position: 'relative',
      height: '100%',
      color: new StyleAlias('rulers.textColor'),
    },

    element: {
      display: 'inline-block',
      position: 'relative',
      borderLeft: new CompoundStyle('1px solid ${rulers.lineColor}'),
      paddingLeft: '0.2em',
      fontSize: '10px',
      height: '100%',
    },

    innerElements: {
      display: 'inline-block',
      margin: 0,
      padding: 0,
    },

    elementContainer: {
      position: 'absolute',
      height: '10px',
      top: '4px',
      display: 'grid',
      gridRowGap: '0',
      gridColumnGap: '0',
      gridTemplateRows: '100%',
    },

    marker: {
      position: 'absolute',
      top: 8,
      width: 0,
      height: 0,
      borderLeft: '5px solid transparent',
      borderRight: '5px solid transparent',
      borderTop: new CompoundStyle('8px solid ${rulers.markerColor}'),
      zIndex: 9001
    }
  }

  render() {

    const { styles, grid, zoom, mouseX, width, sceneWidth, zeroLeftPosition } = this.props;
    const positiveUnitsNumber = Math.ceil( sceneWidth / grid.majorStep ) + 1;

    let rulerStyle = styles.compile('root', { width });

    let elementW = grid.majorStep * zoom;
    let elementStyle = styles.compile('element', { width: elementW })

    let insideElementsStyle = styles.compile('innerElements', {
      width: Math.floor(grid.step / grid.majorStep * 100) + '%',
    })

    let markerStyle = styles.compile('marker', {
      left: zeroLeftPosition + (mouseX * zoom) - 6.5,
    });

    let rulerContainer = styles.compile('elementContainer', {
      gridAutoColumns: `${elementW}px`
    });

    let positiveRulerContainer = {
      ...rulerContainer,
      width: (positiveUnitsNumber * elementW),
      left: zeroLeftPosition
    };

    let positiveDomElements = [];

    if (elementW <= grid.rulerCollapse) {
      for (let x = 0; x < positiveUnitsNumber; x++) {
        positiveDomElements.push(
          <div key={x} style={{ ...elementStyle, gridColumn: (x + 1), gridRow: 1 }}>
            {elementW > 30 ? x * grid.majorStep : ''}
          </div>
        );
      }
    }
    else if (elementW > grid.rulerCollapse) {
      for (let x = 0; x < positiveUnitsNumber; x++) {
        const val = x * grid.majorStep;

        positiveDomElements.push(
          <div key={x} style={{ ...elementStyle, gridColumn: (x + 1), gridRow: 1 }}>
            {range(val, val + grid.majorStep, grid.step).map((v, i) =>
              <div key={i} style={insideElementsStyle}>{v}</div>
            )}
          </div>
        );
      }
    }

    return <div style={rulerStyle}>
      <div id="horizontalMarker" style={markerStyle}></div>
      <div id="positiveRuler" style={positiveRulerContainer}>{positiveDomElements}</div>
    </div>;
  }

}

RulerX.propTypes = {
  styles: ContextPropTypes.styles,
  grid: PropTypes.object.isRequired,
  zoom: PropTypes.number.isRequired,
  mouseX: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  sceneWidth: PropTypes.number.isRequired,
  zeroLeftPosition: PropTypes.number.isRequired,
};

RulerX.defaultProps = {
  collapseSize: 200,
  positiveUnitsNumber: 50,
  negativeUnitsNumber: 50,
}

function range (start, end, step = 1) {
  const len = Math.floor((end - start) / step) + 1
  return Array(len).fill().map((_, idx) => start + (idx * step))
}
