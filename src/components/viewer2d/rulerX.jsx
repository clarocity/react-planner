import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as SharedStyle from '../../shared-style';

export default class RulerX extends Component {

  render() {

    const { grid, zoom, mouseX, width, sceneWidth, zeroLeftPosition } = this.props;
    const positiveUnitsNumber = Math.ceil( sceneWidth / grid.majorStep ) + 1;
    const negativeUnitsNumber = 0;

    let elementW = grid.majorStep * zoom;

    let elementStyle = {
      display: 'inline-block',
      width: elementW,
      position: 'relative',
      borderLeft: '1px solid ' + this.props.fontColor,
      paddingLeft: '0.2em',
      fontSize: '10px',
      height: '100%'
    };

    let insideElementsStyle = {
      width: Math.floor(grid.step / grid.majorStep * 100) + '%',
      display: 'inline-block',
      margin: 0,
      padding: 0
    };

    let rulerStyle = {
      backgroundColor: this.props.backgroundColor,
      position: 'relative',
      width,
      height: '100%',
      color: this.props.fontColor
    }

    let markerStyle = {
      position: 'absolute',
      left: zeroLeftPosition + (mouseX * zoom) - 6.5,
      top: 8,
      width: 0,
      height: 0,
      borderLeft: '5px solid transparent',
      borderRight: '5px solid transparent',
      borderTop: '8px solid ' + this.props.markerColor,
      zIndex: 9001
    };

    let rulerContainer = {
      position: 'absolute',
      height: '10px',
      top: '4px',
      display: 'grid',
      gridRowGap: '0',
      gridColumnGap: '0',
      gridTemplateRows: '100%',
      grdAutoColumns: `${elementW}px`
    };

    let positiveRulerContainer = {
      ...rulerContainer,
      width: (positiveUnitsNumber * elementW),
      left: zeroLeftPosition
    };

    let negativeRulerContainer = {
      ...rulerContainer,
      width: (negativeUnitsNumber * elementW),
      left: zeroLeftPosition - (negativeUnitsNumber * elementW)
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
      <div id="negativeRuler" style={negativeRulerContainer}></div>
      <div id="positiveRuler" style={positiveRulerContainer}>{positiveDomElements}</div>
    </div>;
  }

}

RulerX.propTypes = {
  grid: PropTypes.object.isRequired,
  zoom: PropTypes.number.isRequired,
  mouseX: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  sceneWidth: PropTypes.number.isRequired,
  zeroLeftPosition: PropTypes.number.isRequired,
  backgroundColor: PropTypes.string,
  fontColor: PropTypes.string,
  markerColor: PropTypes.string
};

RulerX.defaultProps = {
  collapseSize: 200,
  positiveUnitsNumber: 50,
  negativeUnitsNumber: 50,
  backgroundColor: SharedStyle.PRIMARY_COLOR.main,
  fontColor: SharedStyle.COLORS.white,
  markerColor: SharedStyle.SECONDARY_COLOR.main
}

function range (start, end, step = 1) {
  const len = Math.floor((end - start) / step) + 1
  return Array(len).fill().map((_, idx) => start + (idx * step))
}
