import React from 'react';
import PropTypes from 'prop-types';

const BASE_STYLE = {
  display: "block",
  marginBottom: "5px"
};

export default function FormLabel({children, style, ...rest}) {
  return <label style={{...BASE_STYLE, ...style}} {...rest}>{children}</label>
}

FormLabel.propTypes = {
  children: PropTypes.node,
  style: PropTypes.object,
}
