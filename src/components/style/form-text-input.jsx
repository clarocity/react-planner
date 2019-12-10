import React, { Component } from 'react';
import * as SharedStyle from '../../shared-style';
import PropTypes from 'prop-types';

const STYLE_INPUT = {
  display: 'block',
  width: '100%',
  padding: '0 5px',
  fontSize: '13px',
  lineHeight: '1.25',
  color: SharedStyle.PRIMARY_COLOR.input,
  backgroundColor: SharedStyle.COLORS.white,
  backgroundImage: 'none',
  border: '1px solid rgba(0,0,0,.15)',
  outline: 'none',
  height: '30px',
};


export default class FormTextInput extends Component {

  constructor(props) {
    super(props);
    this.state = { focus: false };
  }

  render() {
    let { style, ...rest } = this.props;

    let textInputStyle = { ...STYLE_INPUT, ...style };
    if (this.state.focus) textInputStyle.border = `1px solid ${SharedStyle.SECONDARY_COLOR.main}`;

    return <input
      onFocus={() => this.setState({ focus: true })}
      onBlur={() => this.setState({ focus: false })}
      style={textInputStyle}
      type="text"
      {...rest}
    />
  }
}

FormTextInput.propTypes = {
  style: PropTypes.object,
}

FormTextInput.defaultProps = {
  style: {}
};
