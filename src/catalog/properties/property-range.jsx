import React from 'react';
import PropTypes from 'prop-types';
import { FormLabel, FormNumberInput, FormSlider } from '../../components/style/export';
import { ContextPropTypes, needsContext } from '../../components/context';
import {StyleMerge} from '../../themekit';

function PropertyRange({styles, value, onUpdate, configs, sourceElement, internalState, state}) {

  function update (ev) {
    let number = parseFloat(ev.target.value);

    if (isNaN(number)) {
      number = 0;
    }

    if (configs.hook) {
      return configs.hook(number, sourceElement, internalState, state).then(_val => {
        return onUpdate(_val);
      });
    }

    return onUpdate(number);
  }

  return (
    <div style={styles.root} className="PropertyString">
      <div style={styles.label}><FormLabel style={{marginBottom: null}}>{configs.label}</FormLabel></div>
      <div style={styles.slider}>
        <FormSlider
          value={value}
          onChange={update}
          min={configs.min}
          max={configs.max}
        />
      </div>
      <div style={styles.input}>
        <FormNumberInput
          value={value}
          onChange={update}
          style={{ textAlign: 'center' }}
          precision={0}
        />
      </div>
    </div>
  );

}

PropertyRange.styles = {
  root:  new StyleMerge('sidebar.property.row'),
  label: new StyleMerge('sidebar.property.label'),
  slider: new StyleMerge('sidebar.property.mainInput'),
  input:  new StyleMerge('sidebar.property.subInput'),
}

PropertyRange.propTypes = {
  value: PropTypes.any.isRequired,
  onUpdate: PropTypes.func.isRequired,
  configs: PropTypes.object.isRequired,
  sourceElement: PropTypes.object,
  internalState: PropTypes.object,
  state: PropTypes.object.isRequired,

  styles: ContextPropTypes.styles,
};

export default needsContext('styles')(PropertyRange);
