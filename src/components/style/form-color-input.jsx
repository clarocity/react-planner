import React from 'react';
import FormTextInput from './form-text-input';
import PropTypes from 'prop-types';

const STYLE = {
  padding: 0,
  border: 0,
};
const EREG_NUMBER = /^.*$/;

export default function FormColorInput({onChange, ...rest}) {
  let onChangeCustom = event => {
    let value = event.target.value;
    if (EREG_NUMBER.test(value)) {
      onChange(event);
    }
  };

  return <FormTextInput type="color" style={STYLE} onChange={onChangeCustom} autoComplete="off" {...rest}/>;
}

FormColorInput.propTypes = {
  value: PropTypes.any.isRequired,
  onChange: PropTypes.func,
}
