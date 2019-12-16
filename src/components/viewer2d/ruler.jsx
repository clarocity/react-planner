import React from 'react';
import PropTypes from 'prop-types';
import { feet, inches } from '../../utils/human';
import {
  UNIT_FOOT,
  UNIT_INCH,
} from '../../constants';
import { ContextPropTypes, needsContext } from '../context';
import {StyleAlias} from '../../themekit';

function Ruler({styles, length, unit, transform}) {

  let distanceText;

  switch (unit) {
  case UNIT_FOOT:
    distanceText = feet(length, true);
    break;
  case UNIT_INCH:
    distanceText = inches(length, true);
    break;
  default:
    distanceText = `${length.toFixed(2)} ${unit}`;
  }

  return (
    <g transform={transform}>
      <text x={length / 2} y="-3" transform={`scale(1, -1)`} style={styles.text}>{distanceText}</text>
      <line x1="0" y1="-5" x2="0" y2="5" style={styles.line}/>
      <line x1={length} y1="-5" x2={length} y2="5" style={styles.line}/>
      <line x1="0" y1="0" x2={length} y2="0" style={styles.line}/>
    </g>
  );

}

Ruler.styles = {
  line: {
    stroke: new StyleAlias('grid.ruler.color'),
    strokeWidth: "1px"
  },

  text: {
    textAnchor: "middle",
    fontSize: "12px",
    fontFamily: "'Courier New', Courier, monospace",
    pointerEvents: "none",
    fontWeight: "bold",
    color: new StyleAlias('grid.ruler.textColor'),

    //http://stackoverflow.com/questions/826782/how-to-disable-text-selection-highlighting-using-css
    WebkitTouchCallout: "none", /* iOS Safari */
    WebkitUserSelect: "none",   /* Chrome/Safari/Opera */
    MozUserSelect: "none",      /* Firefox */
    MsUserSelect: "none",       /* Internet Explorer/Edge */
    userSelect: "none",
  }
}

Ruler.propTypes = {
  length: PropTypes.number.isRequired,
  unit: PropTypes.string.isRequired,
  transform: PropTypes.string.isRequired,

  styles: ContextPropTypes.styles,
};

export default needsContext('styles')(Ruler);
