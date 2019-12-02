import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ContextPropTypes, needsContext } from '../context';
import {StyleAlias, CompoundStyle} from '../../themekit';

export default @needsContext('styles') class RulerY extends Component {

  static styles = {
    root: {
      backgroundColor: new StyleAlias('rulers.backgroundColor'),
      position: 'relative',
      width: '100%',
      color: new StyleAlias('rulers.textColor'),
    },

    element: {
      width: '8px',
      borderBottom: new CompoundStyle('1px solid ${rulers.lineColor}'),
      paddingBottom: '0.2em',
      fontSize: '10px',
      textOrientation: 'upright',
      writingMode: 'vertical-lr',
      letterSpacing: '-2px',
      textAlign: 'right'
    },

    innerElements: {
      width: '100%',
      textOrientation: 'upright',
      writingMode: 'vertical-lr',
      display: 'inline-block',
      letterSpacing: '-2px',
      textAlign: 'right'
    },

    elementContainer: {
      position: 'absolute',
      width: '100%',
      display: 'grid',
      gridRowGap: '0',
      gridColumnGap: '0',
      gridTemplateColumns: '100%',
      paddingLeft: '5px'
    },

    marker: {
      position: 'absolute',
      left: 8,
      width: 0,
      height: 0,
      borderTop: '5px solid transparent',
      borderBottom: '5px solid transparent',
      borderLeft: new CompoundStyle('8px solid ${rulers.markerColor}'),
      zIndex: 9001
    }
  }

  render() {

    const { styles, grid, zoom, mouseY, height, sceneHeight, zeroTopPosition } = this.props;
    const positiveUnitsNumber = Math.ceil( sceneHeight / grid.majorStep ) + 1;

    let rulerStyle = styles.compile('root', { height });

    let elementH = grid.majorStep * zoom;
    let elementStyle = styles.compile('element', { height: elementH })

    let insideElementsStyle = styles.compile('innerElements', {
      height: Math.floor(grid.step / grid.majorStep * 100) + '%',
    })

    let markerStyle = styles.compile('marker', {
      top: zeroTopPosition - (mouseY * this.props.zoom) - 6.5,
    });

    let rulerContainer = styles.compile('elementContainer', {
      gridAutoRows: `${elementH}px`
    });

    let positiveRulerContainer = {
      ...rulerContainer,
      top: zeroTopPosition - (positiveUnitsNumber * elementH),
      height: (positiveUnitsNumber * elementH)
    };

    let positiveDomElements = [];

    if (elementH <= grid.rulerCollapse) {
      for (let x = 1; x <= positiveUnitsNumber; x++) {
        positiveDomElements.push(
          <div key={x} style={{ ...elementStyle, gridColumn: 1, gridRow: x }}>
            {elementH > 30 ? ((positiveUnitsNumber - x) * 100) : ''}
          </div>
        );
      }
    }
    else if (elementH > grid.rulerCollapse) {
      for (let x = 1; x <= positiveUnitsNumber; x++) {
        let val = (positiveUnitsNumber - x) * 100;
        positiveDomElements.push(
          <div key={x} style={{ ...elementStyle, gridColumn: 1, gridRow: x }}>
            {range(val + grid.majorStep, val, -grid.step).map((v, i) =>
              <div key={i} style={insideElementsStyle}>{v}</div>
            )}
          </div>
        );
      }
    }

    return <div style={rulerStyle}>
      <div id="verticalMarker" style={markerStyle}></div>
      <div id="positiveRuler" style={positiveRulerContainer}>{positiveDomElements}</div>
    </div>;
  }

}

RulerY.propTypes = {
  styles: ContextPropTypes.styles,
  grid: PropTypes.object.isRequired,
  zoom: PropTypes.number.isRequired,
  mouseY: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  sceneHeight: PropTypes.number.isRequired,
  zeroTopPosition: PropTypes.number.isRequired,
};

RulerY.defaultProps = {
  positiveUnitsNumber: 50,
  negativeUnitsNumber: 50,
}

function range (start, end, step = 1) {
  const len = Math.floor((end - start) / step) + 1
  return Array(len).fill().map((_, idx) => start + (idx * step))
}
