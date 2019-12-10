import React from 'react';
import PropTypes from 'prop-types';

export default function FormSlider({value, onChange, min, max, ...rest}) {
  return (
    <input type="range" value={value} min={min} max={max} onChange={onChange} {...rest} />
  )
}

FormSlider.propTypes = {
  value: PropTypes.number.isRequired,
  onChange: PropTypes.func,
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
}
