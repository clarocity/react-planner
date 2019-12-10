import React from 'react';
import PropTypes from 'prop-types';
import PropertyMultiNumber from '../../../../catalog/properties/property-multi-number';
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
      <PropertyMultiNumber
        value={{ x: renderedX, y: renderedY }}
        onUpdate={(key, val) => onUpdate(key, val)}
        configs={{
          labels: [ 'X', 'Y' ],
          targets: [ 'x', 'y' ],
          min: 0,
          max: Infinity,
          precision: 2
        }}
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
