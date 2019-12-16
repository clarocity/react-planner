import React from 'react';
import PropTypes from 'prop-types';
import { FormLabel, FormNumberInput } from '../../components/style/export';
import { ContextPropTypes, needsContext } from '../../components/context';
import {StyleMerge} from '../../themekit';

function PropertyNumber({styles, value, onUpdate, onValid, configs, sourceElement, internalState, state}) {

  let update = (target, val) => {
    let number = parseFloat(val);

    if (isNaN(number)) {
      number = 0;
    }

    if (configs.hook) {
      return configs.hook(number, sourceElement, internalState, state).then(_val => {
        return onUpdate(target, _val);
      });
    }

    return onUpdate(target, number);
  };

  const { labels, targets, style, ...config } = configs;

  return (
    <div style={styles.root} className="PropertyNumber">
      <div style={styles.label}><FormLabel style={{marginBottom: null}}>{labels[0]}</FormLabel></div>
      <div style={styles.input}>
        <FormNumberInput
          value={value[targets[0]]}
          onChange={event => update(targets[0], event.target.value)}
          onValid={onValid}
          style={{textAlign: 'right', ...style}}
          {...config}
        />
      </div>
      <div style={styles.subLabel}><FormLabel style={{marginBottom: null}}>{labels[1]}</FormLabel></div>
      <div style={styles.input}>
        <FormNumberInput
          value={value[targets[1]]}
          onChange={event => update(targets[1], event.target.value)}
          onValid={onValid}
          style={{textAlign: 'right', ...style}}
          {...config}
        />
      </div>
    </div>
  );
}

PropertyNumber.styles = {
  root:  new StyleMerge('sidebar.property.row'),
  label: new StyleMerge('sidebar.property.label'),
  subLabel: new StyleMerge('sidebar.property.subLabel'),
  input: new StyleMerge('sidebar.property.mainInput'),
}

PropertyNumber.propTypes = {
  style: PropTypes.object,
  value: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onValid: PropTypes.func,
  configs: PropTypes.object.isRequired,
  sourceElement: PropTypes.object,
  internalState: PropTypes.object,
  state: PropTypes.object.isRequired,

  styles: ContextPropTypes.styles,
};

export default needsContext('styles')(PropertyNumber);
