import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as SharedStyle from '../../shared-style';
import { MdUpdate } from 'react-icons/md';
import { ContextPropTypes, needsContext } from '../context';
import memoize from 'memoize-one';

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

const STYLE_INPUT_FOCUSED = {
  border: `1px solid ${SharedStyle.SECONDARY_COLOR.main}`,
};

const STYLE_INPUT_INVALID = {
  color: SharedStyle.PRIMARY_COLOR.input_error,
  backgroundColor: SharedStyle.PRIMARY_COLOR.background_error,
  border: SharedStyle.PRIMARY_COLOR.border_error,
}

const STYLE_CONFIRM = {
  position: 'absolute',
  cursor: 'pointer',
  width: '2em',
  height: '2em',
  right: '0.35em',
  top: '0.35em',
  backgroundColor: SharedStyle.SECONDARY_COLOR.main,
  color: '#FFF',
  transition: 'all 0.1s linear',
  visibility: 'hidden',
  opacity: 0,
};

const STYLE_CONFIRM_RIGHT = {
  left: STYLE_CONFIRM.right,
  right: null,
}

const STYLE_CONFIRM_DIFFERENT = {
  visibility: 'visible',
  opacity: 1,
}

export default @needsContext('translator') class FormNumberInput extends Component {

  constructor(props) {
    super(props);
    this.state = {
      focus: false,
      valid: true,
      showedValue: props.value
    };
  }

  get sanitizedValue () {
    const { min, max } = this.props;
    let { showedValue } = this.state;

    let value = (showedValue !== '' && showedValue !== '-') ? parseFloat(showedValue) : 0;
    if (!isNaN(min) && isFinite(min) && value < min) value = min;
    if (!isNaN(max) && isFinite(max) && value > max) value = max;

    return value;
  }

  onChange = (e) => {
    const value = e.nativeEvent.target.value;
    const { precision, onValid, onInvalid } = this.props;
    const regexp = new RegExp(`^-?([0-9]+)?\\.?([0-9]{0,${precision}})?$`);

    const valid = regexp.test(value);

    if (valid) {
      this.setState({ showedValue: value, valid });
      if (onValid) onValid(e.nativeEvent);
      return;
    }

    this.setState({ valid });
    if (onInvalid) onInvalid(e.nativeEvent);
  }

  onKeyDown = (e) => {
    switch (e.key) {
      case 'Enter':
      case 'Return':
      case 'Tab':
        e.stopPropagation();
        if (this.differs) this.save();
        return;

      case 'Escape':
        e.stopPropagation();
        this.setState({
          showedValue: parseFloat(this.props.value).toFixed(this.props.precision),
          valid: true,
        });
        return;
    }
  }

  onConfirmClick = () => {
    if (this.differs) this.save();
  }

  onFocus = () => {
    this.setState({
      focus: true,
      showedValue: parseFloat(this.props.value).toFixed(this.props.precision)
    });
  }

  onBlur = () => {
    this.setState({ focus: false });
  }

  save = () => {
    const { onChange } = this.props;
    if (this.state.valid) {
      const value = this.sanitizedValue;

      this.setState({ showedValue: parseFloat(value).toFixed(this.props.precision) });
      if (onChange) onChange({ target: { value: value } });
    }
  }

  _different = memoize(function (propValue, stateValue, precision) {
    return parseFloat(propValue).toFixed(precision) !== parseFloat(stateValue).toFixed(precision);
  })

  get differs () {
    return this._different(this.props.value, this.state.showedValue, this.props.precision);
  }

  get displayValue () {
    const { precision, value } = this.props;
    const { showedValue, focus:isFocused } = this.state;
    const regexp = new RegExp(`^-?([0-9]+)?\\.?([0-9]{0,${precision}})?$`);

    if (isFocused) {
      if (regexp.test(showedValue)) return showedValue;
      return parseFloat(showedValue).toFixed(precision)
    }

    return parseFloat(value).toFixed(precision)
  }

  render() {
    let { style, placeholder, translator } = this.props;
    const { focus, valid } = this.state;

    const styles = {
      input: {
        ...STYLE_INPUT,
        ...style,
        ...(focus ? STYLE_INPUT_FOCUSED : null),
        ...(valid ? null : STYLE_INPUT_INVALID)
      },
      confirm: {
        ...STYLE_CONFIRM,
        ...(style.textAlign === 'right' ? STYLE_CONFIRM_RIGHT : null),
        ...(this.differs ? STYLE_CONFIRM_DIFFERENT : null)
      }
    }

    return (
      <div style={{ position: 'relative' }}>
        <input
          type="text"
          value={this.displayValue}
          style={styles.input}
          onChange={this.onChange}
          onFocus={this.onFocus}
          onBlur={this.onBlur}
          onKeyDown={this.onKeyDown}
          placeholder={placeholder}
        />
        <div
          onClick={this.onConfirmClick}
          title={translator.t('Confirm')}
          style={styles.confirm}
        >
          <MdUpdate style={{ width: '100%', height: '100%', padding: '0.2em', color: '#FFF' }} />
        </div>
      </div>
    );
  }
}

FormNumberInput.propTypes = {
  value: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  style: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  onValid: PropTypes.func,
  onInvalid: PropTypes.func,
  min: PropTypes.number,
  max: PropTypes.number,
  precision: PropTypes.number,
  placeholder: PropTypes.string,
  translator: ContextPropTypes.translator
};

FormNumberInput.defaultProps = {
  value: 0,
  style: {},
  min: Number.MIN_SAFE_INTEGER,
  max: Number.MAX_SAFE_INTEGER,
  precision: 3
};
