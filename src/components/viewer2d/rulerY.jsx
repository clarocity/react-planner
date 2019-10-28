import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as SharedStyle from '../../shared-style';

export default class RulerY extends Component {

  render() {

    const { grid, zoom, mouseY, height, sceneHeight, zeroTopPosition } = this.props;
    const positiveUnitsNumber = Math.ceil( sceneHeight / grid.majorStep ) + 1;
    const negativeUnitsNumber = 0;

    let elementH = grid.majorStep * zoom;

    let elementStyle = {
      width: '8px',
      borderBottom: '1px solid ' + this.props.fontColor,
      paddingBottom: '0.2em',
      fontSize: '10px',
      height: elementH,
      textOrientation: 'upright',
      writingMode: 'vertical-lr',
      letterSpacing: '-2px',
      textAlign: 'right'
    };

    let insideElementsStyle = {
      height: Math.floor(grid.step / grid.majorStep * 100) + '%',
      width: '100%',
      textOrientation: 'upright',
      writingMode: 'vertical-lr',
      display: 'inline-block',
      letterSpacing: '-2px',
      textAlign: 'right'
    };

    let rulerStyle = {
      backgroundColor: this.props.backgroundColor,
      height,
      width: '100%',
      color: this.props.fontColor
    }

    let markerStyle = {
      position: 'absolute',
      top: zeroTopPosition - (mouseY * this.props.zoom) - 6.5,
      left: 8,
      width: 0,
      height: 0,
      borderTop: '5px solid transparent',
      borderBottom: '5px solid transparent',
      borderLeft: '8px solid ' + this.props.markerColor,
      zIndex: 9001
    };

    let rulerContainer = {
      position: 'absolute',
      width: '100%',
      display: 'grid',
      gridRowGap: '0',
      gridColumnGap: '0',
      gridTemplateColumns: '100%',
      grdAutoRows: `${elementH}px`,
      paddingLeft: '5px'
    };

    let positiveRulerContainer = {
      ...rulerContainer,
      top: zeroTopPosition - (positiveUnitsNumber * elementH),
      height: (positiveUnitsNumber * elementH)
    };

    let negativeRulerContainer = {
      ...rulerContainer,
      top: zeroTopPosition + (negativeUnitsNumber * elementH),
      height: (negativeUnitsNumber * elementH)
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
      <div id="negativeRuler" style={negativeRulerContainer}></div>
      <div id="positiveRuler" style={positiveRulerContainer}>{positiveDomElements}</div>
    </div>;
  }

}

RulerY.propTypes = {
  grid: PropTypes.object.isRequired,
  zoom: PropTypes.number.isRequired,
  mouseY: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  sceneHeight: PropTypes.number.isRequired,
  zeroTopPosition: PropTypes.number.isRequired,
  backgroundColor: PropTypes.string,
  fontColor: PropTypes.string,
  markerColor: PropTypes.string
};

RulerY.defaultProps = {
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
