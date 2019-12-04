import React from 'react';
import PropTypes from 'prop-types';
import { FormLabel, FormColorInput } from '../../components/style/export';
import { ContextPropTypes, needsContext } from '../../components/context';
import {StyleMerge} from '../../themekit';

function PropertyColor({styles, value, onUpdate, configs, sourceElement, internalState, state}) {

  let update = (val) => {

    if (configs.hook) {
      return configs.hook(val, sourceElement, internalState, state).then(_val => {
        return onUpdate(_val);
      });
    }

    return onUpdate(val);
  };

  return (
    <div style={styles.root} className="PropertyString">
      <div style={styles.label}><FormLabel style={{marginBottom: null}}>{configs.label}</FormLabel></div>
      <div style={styles.input}>
        <FormColorInput value={value} onChange={event => update(event.target.value)}/>
      </div>
    </div>
  );
}

PropertyColor.styles = {
  root:  new StyleMerge('sidebar.property.row'),
  label: new StyleMerge('sidebar.property.label'),
  input: new StyleMerge('sidebar.property.mainInput'),
}

PropertyColor.propTypes = {
  value: PropTypes.any.isRequired,
  onUpdate: PropTypes.func.isRequired,
  configs: PropTypes.object.isRequired,
  sourceElement: PropTypes.object,
  internalState: PropTypes.object,
  state: PropTypes.object.isRequired,

  styles: ContextPropTypes.styles,
};


export default needsContext('styles')(PropertyColor);
