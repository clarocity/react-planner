import React from 'react';
import PropTypes from 'prop-types';
import { FormLabel, Button } from '../../components/style/export';
import { ContextPropTypes, needsContext } from '../../components/context';
import {StyleMerge} from '../../themekit';

function PropertyToggle({styles, value, onUpdate, configs, sourceElement, internalState, state}) {

  let update = (val) => {

    if (configs.hook) {
      return configs.hook(val, sourceElement, internalState, state).then(_val => {
        return onUpdate(_val);
      });
    }

    return onUpdate(val);
  };

  return (
    <div style={styles.root} className="PropertyToggle">
      <div style={styles.label}><FormLabel style={{marginBottom: null}}>{configs.label}</FormLabel></div>
      <div style={styles.input}>
        <Button onClick={() => update(!value)} size="small">{configs.actionName}</Button>
      </div>
    </div>
  );
}

PropertyToggle.styles = {
  root:  new StyleMerge('sidebar.property.row'),
  label: new StyleMerge('sidebar.property.label'),
  input: new StyleMerge('sidebar.property.mainInput'),
}

PropertyToggle.propTypes = {
  value: PropTypes.any.isRequired,
  onUpdate: PropTypes.func.isRequired,
  configs: PropTypes.object.isRequired,
  sourceElement: PropTypes.object,
  internalState: PropTypes.object,
  state: PropTypes.object.isRequired,

  styles: ContextPropTypes.styles,
};

export default needsContext('styles')(PropertyToggle);

