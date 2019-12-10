import React, {Component} from 'react';
import PropTypes from 'prop-types';
import PropertyLengthMeasure from '../../../../catalog/properties/property-length-measure';
import PropertyMultiNumber from '../../../../catalog/properties/property-multi-number';
import PropertyString from '../../../../catalog/properties/property-string';
import { ContextPropTypes, needsContext } from '../../../context';
import * as Geometry from '../../../../utils/geometry';
import convert from 'convert-units';
import {Map} from 'immutable';

const PRECISION = 2;

export default
@needsContext('state', 'translator', 'catalog', 'actions')
class LineAttributesEditor extends Component {


  shouldComponentUpdate(nextProps) {
    if(
      this.props.layer.hashCode() !== nextProps.layer.hashCode() ||
      this.props.element.hashCode() !== nextProps.element.hashCode()
    ) return true;

    return false;
  }

  compute () {
    let { element, layer, catalog } = this.props;
    element = typeof element.misc === 'object' ? element.set('misc', new Map(element.misc)) : element;

    let v_a = layer.vertices.get(element.vertices.get(0));
    let v_b = layer.vertices.get(element.vertices.get(1));

    let length = Geometry.pointsDistance(v_a.x, v_a.y, v_b.x, v_b.y);
    let _unit = element.misc.get('_unitLength') || catalog.unit;
    let _length = convert(length).from(catalog.unit).to(_unit);

    return new Map({
      name: element.name,
      vertexOne: v_a,
      vertexTwo: v_b,
      lineLength: new Map({
        length,
        _length,
        _unit
      }),
    });
  }

  update (key, value) {
    let attributes = this.compute();

    switch(key) {
      case 'lineLength': {
        let v_0 = attributes.get('vertexOne');
        let v_1 = attributes.get('vertexTwo');

        let [v_a, v_b] = Geometry.orderVertices([v_0, v_1]);

        let v_b_new = Geometry.extendLine(v_a.x, v_a.y, v_b.x, v_b.y, value.get('length'), PRECISION);

        attributes = attributes.withMutations(attr => {
          attr.set(v_0 === v_a ? 'vertexTwo' : 'vertexOne', v_b.merge(v_b_new));
          attr.set('lineLength', value);
        });
        break;
      }

      case 'vertexOne':
      case 'vertexTwo':
      {
        attributes = attributes.withMutations(attr => {
          attr.set(key, attr.get(key).merge(value));

          let newDistance = Geometry.verticesDistance(attr.get('vertexOne'), attr.get('vertexTwo'));

          attr.mergeIn(['lineLength'], attr.get('lineLength').merge({
            'length': newDistance,
            '_length': convert(newDistance).from(this.props.catalog.unit).to(attr.get('lineLength').get('_unit'))
          }));
        });
        break;
      }

      default:
      {
        attributes = attributes.set(key, value);
        break;
      }
    }

    this.props.actions.project.setLinesAttributes(attributes);
  }

  render () {
    const attributes = this.compute();
    const { state, translator, ...rest } = this.props;

    return (
      <div>
        <PropertyString
          value={attributes.get('name')}
          onUpdate={v => this.update('name', v)}
          configs={{label: translator.t('Name')}}
          state={state}
          {...rest}
        />
        <PropertyMultiNumber
          value={attributes.get('vertexOne')}
          onUpdate={(key, val) => this.update('vertexOne', { [key]: val })}
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
          value={attributes.get('vertexTwo')}
          onUpdate={(key, val) => this.update('vertexTwo', { [key]: val })}
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
          value={ attributes.get('lineLength') }
          onUpdate={mapped => this.update('lineLength', mapped)}
          configs={{label: translator.t('Length'), min: 0, max: Infinity, precision: 2}}
          state={state}
        />
      </div>
    );
  }
}

LineAttributesEditor.propTypes = {
  element: PropTypes.object.isRequired,
  layer: PropTypes.object.isRequired,

  state: ContextPropTypes.state,
  translator: ContextPropTypes.translator,
  catalog: ContextPropTypes.catalog,
  actions: ContextPropTypes.actions,
};

// export default needsContext('state', 'translator')(LineAttributesEditor);
