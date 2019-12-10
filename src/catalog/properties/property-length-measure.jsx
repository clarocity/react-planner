import React from 'react';
import PropTypes from 'prop-types';
import {UNITS_LENGTH, UNIT_CENTIMETER} from './../../constants';
import convert from 'convert-units';
import { FormLabel, FormNumberInput, FormSelect } from '../../components/style/export';
import {Map} from 'immutable';
import {toFixedFloat} from '../../utils/math';
import { ContextPropTypes, needsContext } from '../../components/context';
import {StyleMerge} from '../../themekit';

function PropertyLengthMeasure({styles, value, onUpdate, onValid, configs, sourceElement, internalState, state}) {

  let length = value.get('length') || 0;
  let _length = value.get('_length') || length;
  let _unit = value.get('_unit') || state.getIn(['scene', 'unit']) || UNIT_CENTIMETER;
  let { hook, label, style, ...configRest} = configs;

  let update = (lengthInput, unitInput) => {

    let newLength = toFixedFloat(lengthInput);
    let merged = value.merge({
      length: unitInput !== UNIT_CENTIMETER ? convert(newLength).from(unitInput).to(UNIT_CENTIMETER) : newLength,
      _length: lengthInput,
      _unit: unitInput
    });

    if (hook) {
      return hook(merged, sourceElement, internalState, state).then(val => {
        return onUpdate(val);
      });
    }

    return onUpdate(merged);
  };

  return (
    <div style={styles.root} className="PropertyLengthMeasure">
      <div style={styles.label}><FormLabel style={{marginBottom: null}}>{label}</FormLabel></div>
      <div style={styles.input}>
        <FormNumberInput
          value={_length}
          onChange={event => update(event.target.value, _unit)}
          onValid={onValid}
          style={{textAlign: 'right', ...style}}
          {...configRest}
        />
      </div>
      <div style={styles.unit}>
        <FormSelect value={_unit} onChange={event => update(_length, event.target.value) }>
          {
            UNITS_LENGTH.map(el => <option key={el} value={el}>{el}</option>)
          }
        </FormSelect>
      </div>
    </div>
  );
}

PropertyLengthMeasure.styles = {
  root:  new StyleMerge('sidebar.property.row'),
  label: new StyleMerge('sidebar.property.label'),
  input: new StyleMerge('sidebar.property.mainInput'),
  unit:  new StyleMerge('sidebar.property.subInput'),
}

PropertyLengthMeasure.propTypes = {
  value: PropTypes.instanceOf(Map).isRequired,
  onUpdate: PropTypes.func.isRequired,
  onValid: PropTypes.func,
  configs: PropTypes.object.isRequired,
  sourceElement: PropTypes.object,
  internalState: PropTypes.object,
  state: PropTypes.object.isRequired,

  styles: ContextPropTypes.styles,
};

export default needsContext('styles')(PropertyLengthMeasure);
