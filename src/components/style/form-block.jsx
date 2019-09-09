import React from 'react';
import PropTypes from 'prop-types';

const BASE_STYLE = {
  marginBottom: "16px"
};

export default function FormBlock({children, style, ...rest}) {
  return <div style={{...BASE_STYLE, style}} {...rest}>{children}</div>
}

FormBlock.propTypes = {
  children: PropTypes.node,
  style: PropTypes.object,
}
