import React from 'react';
import PropTypes from 'prop-types';

/**
 * @return {null}
 */
export default function If({condition, style, children}) {
  if (!condition) return null;
  if (style) return (
    <div style={style}>{children}</div>
  );
  return children;
}

If.propTypes = {
  condition: PropTypes.bool.isRequired,
  style: PropTypes.object
};
