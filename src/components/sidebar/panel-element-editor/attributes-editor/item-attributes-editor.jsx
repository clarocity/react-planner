import React, {Component} from 'react';
import PropTypes from 'prop-types';
import PropertyMultiNumber from '../../../../catalog/properties/property-multi-number';
import PropertyNumber from '../../../../catalog/properties/property-number';
import PropertyString from '../../../../catalog/properties/property-string';
import { ContextPropTypes, needsContext } from '../../../context';
import {Map} from 'immutable';

export default
@needsContext('state', 'translator', 'actions')
class ItemAttributesEditor extends Component {

  shouldComponentUpdate(nextProps) {
    if(
      this.props.layer.hashCode() !== nextProps.layer.hashCode() ||
      this.props.element.hashCode() !== nextProps.element.hashCode()
    ) return true;

    return false;
  }


  update (key, value) {
    let attributes = Map(this.props.element);

    attributes = attributes.set(key, value);

    this.props.actions.project.setItemsAttributes(attributes);
  }

  render () {
    const { element, state, translator, ...rest } = this.props;
    const { name, x, y, rotation } = element;

    return (
      <div>
        <PropertyString
          value={name}
          onUpdate={v => this.update('name', v)}
          configs={{label: translator.t('Name')}}
          state={state}
          {...rest}
        />
        <PropertyMultiNumber
          value={{ x, y }}
          onUpdate={(key, val) => this.update(key, val)}
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
          value={rotation}
          onUpdate={v => this.update('rotation', v)}
          configs={{label: translator.t('Rotation'), min: 0, max: Infinity, precision: 3}}
          state={state}
          {...rest}
        />
      </div>
    );
  }
}

ItemAttributesEditor.propTypes = {
  element: PropTypes.object.isRequired,
  layer: PropTypes.object.isRequired,

  state: ContextPropTypes.state,
  translator: ContextPropTypes.translator,
  actions: ContextPropTypes.actions,
};

