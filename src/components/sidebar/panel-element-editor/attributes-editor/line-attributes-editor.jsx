import React from 'react';
import PropTypes from 'prop-types';
import PropertyLengthMeasure from '../../../../catalog/properties/property-length-measure';
import PropertyNumber from '../../../../catalog/properties/property-number';
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
      <PropertyNumber
        value={vertexOne.get('x')}
        onUpdate={v => onUpdate('vertextOne', { x: v })}
        configs={{label: 'X1', min: 0, max: Infinity, precision: 2}}
        state={state}
        {...rest}
      />
      <PropertyNumber
        value={vertexOne.get('y')}
        onUpdate={v => onUpdate('vertextOne', { y: v })}
        configs={{label: 'Y1', min: 0, max: Infinity, precision: 2}}
        state={state}
        {...rest}
      />
      <PropertyNumber
        value={vertexTwo.get('x')}
        onUpdate={v => onUpdate('vertextTwo', { x: v })}
        configs={{label: 'X2', min: 0, max: Infinity, precision: 2}}
        state={state}
        {...rest}
      />
      <PropertyNumber
        value={vertexTwo.get('y')}
        onUpdate={v => onUpdate('vertextTwo', { y: v })}
        configs={{label: 'Y2', min: 0, max: Infinity, precision: 2}}
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
