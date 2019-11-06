import React from 'react';
import PropTypes from 'prop-types';

const STYLE = {
  padding: '0 20px',
  overflowY: 'auto',
  position: 'absolute',
  width: '100%',
  height: '100%',
};

export default function ContentContainer({children, style = {}}) {
  return <div style={{...STYLE, ...style}} onWheel={event => event.stopPropagation()}>{children}</div>
}

ContentContainer.propTypes = {
  children: PropTypes.node,
  style: PropTypes.object
};
