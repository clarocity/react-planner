import React from 'react';
import PropTypes from 'prop-types';
import {Seq} from 'immutable';
import { FormLabel, FormSelect } from '../../components/style/export';
import { ContextPropTypes, needsContext } from '../../components/context';
import {StyleMerge} from '../../themekit';

function PropertyEnum({styles, value, onUpdate, configs, sourceElement, internalState, state}) {

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
        <FormSelect value={value} onChange={event => update(event.target.value)}>
          {Seq(configs.values)
            .entrySeq()
            .map(([key, value]) => <option key={key} value={key}>{value}</option>)}
        </FormSelect>
      </div>
    </div>
  );
}

PropertyEnum.styles = {
  root:  new StyleMerge('sidebar.property.row'),
  label: new StyleMerge('sidebar.property.label'),
  input: new StyleMerge('sidebar.property.mainInput'),
}

PropertyEnum.propTypes = {
  value: PropTypes.any.isRequired,
  onUpdate: PropTypes.func.isRequired,
  configs: PropTypes.object.isRequired,
  sourceElement: PropTypes.object,
  internalState: PropTypes.object,
  state: PropTypes.object.isRequired,

  styles: ContextPropTypes.styles,
};


export default needsContext('styles')(PropertyEnum);
