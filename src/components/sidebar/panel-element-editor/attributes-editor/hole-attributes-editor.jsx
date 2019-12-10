import React, {Component} from 'react';
import PropTypes from 'prop-types';
import PropertyLengthMeasure from '../../../../catalog/properties/property-length-measure';
import PropertyString from '../../../../catalog/properties/property-string';
import { ContextPropTypes, needsContext } from '../../../context';
import * as Geometry from '../../../../utils/geometry';
import * as MathUtils from '../../../../utils/math';
import convert from 'convert-units';
import {Map} from 'immutable';

const PRECISION = 2;

export default
@needsContext('state', 'translator', 'actions', 'catalog')
class HoleAttributesEditor extends Component {

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

    let line = layer.lines.get(element.line);
    let {x: x0, y: y0} = layer.vertices.get(line.vertices.get(0));
    let {x: x1, y: y1} = layer.vertices.get(line.vertices.get(1));
    let lineLength = Geometry.pointsDistance(x0, y0, x1, y1);
    let startAt = lineLength * element.offset - element.properties.get('width').get('length') / 2;

    let _unitA = element.misc.get('_unitA') || catalog.unit;
    let _lengthA = convert(startAt).from(catalog.unit).to(_unitA);

    let endAt = lineLength - lineLength * element.offset - element.properties.get('width').get('length') / 2;
    let _unitB = element.misc.get('_unitB') || catalog.unit;
    let _lengthB = convert(endAt).from(catalog.unit).to(_unitB);

    return new Map({
      name: element.name,
      offset: element.offset,
      offsetA: new Map({
        length: MathUtils.toFixedFloat(startAt, PRECISION),
        _length: MathUtils.toFixedFloat(_lengthA, PRECISION),
        _unit: _unitA
      }),
      offsetB: new Map({
        length: MathUtils.toFixedFloat(endAt, PRECISION),
        _length: MathUtils.toFixedFloat(_lengthB, PRECISION),
        _unit: _unitB
      })
    });
  }

  update (key, value) {
    let attributes = this.compute();

    switch( key )
    {
      case 'offsetA':
      {
        let line = this.props.layer.lines.get(this.props.element.line);

        let orderedVertices = Geometry.orderVertices([
          this.props.layer.vertices.get(line.vertices.get(0)),
          this.props.layer.vertices.get(line.vertices.get(1))
        ]);

        let [ {x: x0, y: y0}, {x: x1, y: y1} ] = orderedVertices;

        let alpha = Geometry.angleBetweenTwoPoints(x0, y0, x1, y1);
        let lineLength = Geometry.pointsDistance(x0, y0, x1, y1);
        let widthLength = this.props.element.properties.get('width').get('length');
        let halfWidthLength = widthLength / 2;

        let lengthValue = value.get('length');
        lengthValue = Math.max(lengthValue, 0);
        lengthValue = Math.min(lengthValue, lineLength - widthLength);

        let xp = (lengthValue + halfWidthLength) * Math.cos(alpha) + x0;
        let yp = (lengthValue + halfWidthLength) * Math.sin(alpha) + y0;

        let offset = Geometry.pointPositionOnLineSegment(x0, y0, x1, y1, xp, yp);

        let endAt = MathUtils.toFixedFloat(lineLength - (lineLength * offset) - halfWidthLength, PRECISION);
        let offsetUnit = attributes.getIn(['offsetB', '_unit']);

        let offsetB = new Map({
          length: endAt,
          _length: convert(endAt).from(this.props.catalog.unit).to(offsetUnit),
          _unit: offsetUnit
        });

        attributes = attributes.set('offsetB', offsetB).set('offset', offset);

        let offsetAttribute = new Map({
          length: MathUtils.toFixedFloat(lengthValue, PRECISION),
          _unit: value.get('_unit'),
          _length: MathUtils.toFixedFloat(convert(lengthValue).from(this.props.catalog.unit).to(value.get('_unit')), PRECISION)
        });

        attributes = attributes.set(key, offsetAttribute);

        break;
      }
      case 'offsetB':
      {
        let line = this.props.layer.lines.get(this.props.element.line);

        let orderedVertices = Geometry.orderVertices([
          this.props.layer.vertices.get(line.vertices.get(0)),
          this.props.layer.vertices.get(line.vertices.get(1))
        ]);

        let [ {x: x0, y: y0}, {x: x1, y: y1} ] = orderedVertices;

        let alpha = Geometry.angleBetweenTwoPoints(x0, y0, x1, y1);
        let lineLength = Geometry.pointsDistance(x0, y0, x1, y1);
        let widthLength = this.props.element.properties.get('width').get('length');
        let halfWidthLength = widthLength / 2;

        let lengthValue = value.get('length');
        lengthValue = Math.max(lengthValue, 0);
        lengthValue = Math.min(lengthValue, lineLength - widthLength);

        let xp = x1 - (lengthValue + halfWidthLength) * Math.cos(alpha);
        let yp = y1 - (lengthValue + halfWidthLength) * Math.sin(alpha);

        let offset = Geometry.pointPositionOnLineSegment(x0, y0, x1, y1, xp, yp);

        let startAt = MathUtils.toFixedFloat((lineLength * offset) - halfWidthLength, PRECISION);
        let offsetUnit = attributes.getIn(['offsetA', '_unit']);

        let offsetA = new Map({
          length: startAt,
          _length: convert(startAt).from(this.props.catalog.unit).to(offsetUnit),
          _unit: offsetUnit
        });

        attributes = attributes.set('offsetA', offsetA).set('offset', offset);

        let offsetAttribute = new Map({
          length: MathUtils.toFixedFloat(lengthValue, PRECISION),
          _unit: value.get('_unit'),
          _length: MathUtils.toFixedFloat(convert(lengthValue).from(this.props.catalog.unit).to(value.get('_unit')), PRECISION)
        });

        attributes = attributes.set(key, offsetAttribute);

        break;
      }
      default:
      {
        attributes = attributes.set(key, value);
        break;
      }
    }

    this.props.actions.project.setHolesAttributes(attributes);
  }

  render () {
    const attributes = this.compute();

    const { state, translator, ...rest } = this.props;

    return (
      <div>
        <PropertyString
          value={attributes.get('name')}
          onUpdate={mapped => this.update('name', mapped)}
          configs={{label: 'Name'}}
          state={state}
          {...rest}
        />
        <PropertyLengthMeasure
          value={attributes.get('offsetA')}
          onUpdate={mapped => this.update('offsetA', mapped)}
          configs={{label: translator.t('Offset {0}', 1), min: 0, max: Infinity, precision: 2}}
          state={state}
          {...rest}
        />
        <PropertyLengthMeasure
          value={attributes.get('offsetB')}
          onUpdate={mapped => this.update('offsetB', mapped)}
          configs={{label: translator.t('Offset {0}', 2), min: 0, max: Infinity, precision: 2}}
          state={state}
          {...rest}
        />
      </div>
    );
  }
}

HoleAttributesEditor.propTypes = {
  element: PropTypes.object.isRequired,
  layer: PropTypes.object.isRequired,

  state: ContextPropTypes.state,
  translator: ContextPropTypes.translator,
  actions: ContextPropTypes.actions,
  catalog: ContextPropTypes.catalog,
};

