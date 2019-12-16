import React from 'react';
import PropTypes from 'prop-types';
import { FormLabel, FormNumberInput } from '../../components/style/export';
import { ContextPropTypes, needsContext } from '../../components/context';
import {StyleMerge} from '../../themekit';

function PropertyNumber({style, styles, value, onUpdate, onValid, configs, sourceElement, internalState, state}) {

  let update = (val) => {
    let number = parseFloat(val);

    if (isNaN(number)) {
      number = 0;
    }

    if (configs.hook) {
      return configs.hook(number, sourceElement, internalState, state).then(_val => {
        return onUpdate(_val);
      });
    }

    return onUpdate(number);
  };

  return (
    <div style={styles.root} className="PropertyNumber">
      <div style={styles.label}><FormLabel style={{marginBottom: null}}>{configs.label}</FormLabel></div>
      <div style={styles.input}>
        <FormNumberInput
          value={value}
          onChange={event => update(event.target.value)}
          onValid={onValid}
          style={style}
          {...configs}
        />
      </div>
    </div>
  );
}

PropertyNumber.styles = {
  root:  new StyleMerge('sidebar.property.row'),
  label: new StyleMerge('sidebar.property.label'),
  input: new StyleMerge('sidebar.property.mainInput'),
}

PropertyNumber.propTypes = {
  style: PropTypes.object,
  value: PropTypes.any.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onValid: PropTypes.func,
  configs: PropTypes.object.isRequired,
  sourceElement: PropTypes.object,
  internalState: PropTypes.object,
  state: PropTypes.object.isRequired,

  styles: ContextPropTypes.styles,
};

export default needsContext('styles')(PropertyNumber);
