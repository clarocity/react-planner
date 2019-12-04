import React from 'react';
import PropTypes from 'prop-types';
import PropertyNumber from '../../../../catalog/properties/property-number';
import PropertyString from '../../../../catalog/properties/property-string';
import { ContextPropTypes, needsContext } from '../../../context';

function ItemAttributesEditor({element, onUpdate, attributeFormData, state, translator, ...rest}) {
  let name = attributeFormData.has('name') ? attributeFormData.get('name') : element.name;
  let renderedX = attributeFormData.has('x') ? attributeFormData.get('x') : element.x;
  let renderedY = attributeFormData.has('y') ? attributeFormData.get('y') : element.y;
  let renderedR = attributeFormData.has('rotation') ? attributeFormData.get('rotation') : element.rotation;

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
        value={renderedX}
        onUpdate={v => onUpdate('x', v)}
        configs={{label: 'X', min: 0, max: Infinity, precision: 3}}
        state={state}
        {...rest}
      />
      <PropertyNumber
        value={renderedY}
        onUpdate={v => onUpdate('y', v)}
        configs={{label: 'Y', min: 0, max: Infinity, precision: 3}}
        state={state}
        {...rest}
      />
      <PropertyNumber
        value={renderedR}
        onUpdate={v => onUpdate('rotation', v)}
        configs={{label: translator.t('Rotation'), min: 0, max: Infinity, precision: 3}}
        state={state}
        {...rest}
      />
    </div>
  );

}

ItemAttributesEditor.propTypes = {
  element: PropTypes.object.isRequired,
  onUpdate: PropTypes.func.isRequired,
  attributeFormData: PropTypes.object.isRequired,

  translator: ContextPropTypes.translator,
  state: ContextPropTypes.state,
};

export default needsContext('translator', 'state')(ItemAttributesEditor);
