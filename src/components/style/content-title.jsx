import React from 'react';
import PropTypes from 'prop-types';
import * as SharedStyle from '../../shared-style';

const STYLE = {
  color: SharedStyle.PRIMARY_COLOR.alt,
  fontWeight: 300,
};

export default function ContentTitle({children, style = {}, ...rest}) {
  return <h1 style={{...STYLE, ...style}} {...rest}>{children}</h1>
}

ContentTitle.propTypes = {
  style: PropTypes.object,
  children: PropTypes.node,
};
