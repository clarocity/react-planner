import React from 'react';
import PropTypes from 'prop-types';
import PropertyLengthMeasure from '../../../../catalog/properties/property-length-measure';
import PropertyMultiNumber from '../../../../catalog/properties/property-multi-number';
import PropertyString from '../../../../catalog/properties/property-string';
import { ContextPropTypes, needsContext } from '../../../context';

function LineAttributesEditor({element, onUpdate, attributeFormData, state, translator, ...rest}) {

  let name = attributeFormData.has('name') ? attributeFormData.get('name') : element.name;
  let vertexOne = attributeFormData.has('vertexOne') ? attributeFormData.get('vertexOne') : null;
  let vertexTwo = attributeFormData.has('vertexTwo') ? attributeFormData.get('vertexTwo') : null;
  let lineLength = attributeFormData.has('lineLength') ? attributeFormData.get('lineLength') : null;

  return (
    <div>
      <PropertyString
        value={name}
        onUpdate={v => onUpdate('name', v)}
        configs={{label: translator.t('Name')}}
        state={state}
        {...rest}
      />
      <PropertyMultiNumber
        value={vertexOne}
        onUpdate={(key, val) => onUpdate('vertexOne', { [key]: val })}
        configs={{
          labels: [ 'X1', 'Y1' ],
          targets: [ 'x', 'y' ],
          min: 0,
          max: Infinity,
          precision: 2
        }}
        state={state}
        {...rest}
      />
      <PropertyMultiNumber
        value={vertexTwo}
        onUpdate={(key, val) => onUpdate('vertexTwo', { [key]: val })}
        configs={{
          labels: [ 'X2', 'Y2' ],
          targets: [ 'x', 'y' ],
          min: 0,
          max: Infinity,
          precision: 2
        }}
        state={state}
        {...rest}
      />
      <PropertyLengthMeasure
        value={ lineLength }
        onUpdate={mapped => onUpdate('lineLength', mapped)}
        configs={{label: translator.t('Length'), min: 0, max: Infinity, precision: 2}}
        state={state}
      />
    </div>
  );
}

LineAttributesEditor.propTypes = {
  element: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
  onValid: PropTypes.func,
  attributeFormData: PropTypes.object.isRequired,

  state: ContextPropTypes.state,
  translator: ContextPropTypes.translator,
};

export default needsContext('state', 'translator')(LineAttributesEditor);
