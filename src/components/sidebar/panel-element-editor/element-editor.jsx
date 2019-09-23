import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Map, fromJS} from 'immutable';
import memoize from 'memoize-one';
import AttributesEditor from './attributes-editor/attributes-editor';
import { GeometryUtils, MathUtils } from '../../../utils/export';
import * as SharedStyle from '../../../shared-style';
import convert from 'convert-units';
import {MdContentCopy, MdContentPaste} from 'react-icons/md';
import { ContextPropTypes, needsContext } from '../../context';

const PRECISION = 2;

const attrPorpSeparatorStyle = {
  margin: '0.5em 0.25em 0.5em 0',
  border: '2px solid ' + SharedStyle.SECONDARY_COLOR.alt,
  position:'relative',
  height:'2.5em',
  borderRadius:'2px'
};

const headActionStyle = {
  position:'absolute',
  right:'0.5em',
  top:'0.5em'
};

const iconHeadStyle = {
  float:'right',
  margin:'-3px 4px 0px 0px',
  padding:0,
  cursor:'pointer',
  fontSize:'1.4em'
};

export default @needsContext class ElementEditor extends Component {

  constructor(props) {
    super(props);

    this.state = {
      timestamp: Date.now(),
    };

    this.updateAttribute = this.updateAttribute.bind(this);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if(
      this.state.timestamp !== nextState.timestamp ||
      this.props.state.clipboardProperties.hashCode() !== nextProps.state.clipboardProperties.hashCode()
    ) return true;

    return false;
  }

  get derivedState () {
    const scene = this.props.state.get('scene');
    const selectedLayer = scene.getIn(['layers', scene.get('selectedLayer')]);
    const hashCode = selectedLayer.hashCode();
    const ts = this.state.timestamp;

    const { element, layer } = this.props;
    return this._derived(hashCode, ts, element, layer);
  }

  _derived = memoize((hashCode, ts, element, layer) => ({
    hashCode,
    attributesFormData: this.initAttrData(element, layer),
    propertiesFormData: this.initPropData(element, layer)
  }))

  initAttrData (element, layer) {
    const {catalog} = this.props;
    element = typeof element.misc === 'object' ? element.set('misc', new Map(element.misc)) : element;

    switch (element.prototype) {
      case 'items': {
        return new Map(element);
      }
      case 'lines': {
        let v_a = layer.vertices.get(element.vertices.get(0));
        let v_b = layer.vertices.get(element.vertices.get(1));

        let distance = GeometryUtils.pointsDistance(v_a.x, v_a.y, v_b.x, v_b.y);
        let _unit = element.misc.get('_unitLength') || catalog.unit;
        let _length = convert(distance).from(catalog.unit).to(_unit);

        return new Map({
          vertexOne: v_a,
          vertexTwo: v_b,
          lineLength: new Map({length: distance, _length, _unit}),
        });
      }
      case 'holes': {
        let line = layer.lines.get(element.line);
        let {x: x0, y: y0} = layer.vertices.get(line.vertices.get(0));
        let {x: x1, y: y1} = layer.vertices.get(line.vertices.get(1));
        let lineLength = GeometryUtils.pointsDistance(x0, y0, x1, y1);
        let startAt = lineLength * element.offset - element.properties.get('width').get('length') / 2;

        let _unitA = element.misc.get('_unitA') || catalog.unit;
        let _lengthA = convert(startAt).from(catalog.unit).to(_unitA);

        let endAt = lineLength - lineLength * element.offset - element.properties.get('width').get('length') / 2;
        let _unitB = element.misc.get('_unitB') || catalog.unit;
        let _lengthB = convert(endAt).from(catalog.unit).to(_unitB);

        return new Map({
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
      case 'areas': {
        return new Map({});
      }
      default:
        return null;
    }
  }

  initPropData (element) {
    let catalogElement = this.props.catalog.getElement(element.type);

    let mapped = {};
    for (let name in catalogElement.properties) {
      mapped[name] = new Map({
        currentValue: element.properties.has(name) ? element.properties.get(name) : fromJS(catalogElement.properties[name].defaultValue),
        configs: catalogElement.properties[name]
      });
    }

    return new Map(mapped);
  }

  updateAttribute(attributeName, value) {

    let {attributesFormData} = this.derivedState;

    switch (this.props.element.prototype) {
      case 'items': {
        attributesFormData = attributesFormData.set(attributeName, value);
        break;
      }
      case 'lines': {
        switch(attributeName)
        {
          case 'lineLength':
          {
            let v_0 = attributesFormData.get('vertexOne');
            let v_1 = attributesFormData.get('vertexTwo');

            let [v_a, v_b] = GeometryUtils.orderVertices([v_0, v_1]);

            let v_b_new = GeometryUtils.extendLine(v_a.x, v_a.y, v_b.x, v_b.y, value.get('length'), PRECISION);

            attributesFormData = attributesFormData.withMutations(attr => {
              attr.set(v_0 === v_a ? 'vertexTwo' : 'vertexOne', v_b.merge(v_b_new));
              attr.set('lineLength', value);
            });
            break;
          }
          case 'vertexOne':
          case 'vertexTwo':
          {
            attributesFormData = attributesFormData.withMutations(attr => {
              attr.set(attributeName, attr.get(attributeName).merge(value));

              let newDistance = GeometryUtils.verticesDistance(attr.get('vertexOne'), attr.get('vertexTwo'));

              attr.mergeIn(['lineLength'], attr.get('lineLength').merge({
                'length': newDistance,
                '_length': convert(newDistance).from(this.props.catalog.unit).to(attr.get('lineLength').get('_unit'))
              }));
            });
            break;
          }
          default:
          {
            attributesFormData = attributesFormData.set(attributeName, value);
            break;
          }
        }
        break;
      }
      case 'holes': {
        switch( attributeName )
        {
          case 'offsetA':
          {
            let line = this.props.layer.lines.get(this.props.element.line);

            let orderedVertices = GeometryUtils.orderVertices([
              this.props.layer.vertices.get(line.vertices.get(0)),
              this.props.layer.vertices.get(line.vertices.get(1))
            ]);

            let [ {x: x0, y: y0}, {x: x1, y: y1} ] = orderedVertices;

            let alpha = GeometryUtils.angleBetweenTwoPoints(x0, y0, x1, y1);
            let lineLength = GeometryUtils.pointsDistance(x0, y0, x1, y1);
            let widthLength = this.props.element.properties.get('width').get('length');
            let halfWidthLength = widthLength / 2;

            let lengthValue = value.get('length');
            lengthValue = Math.max(lengthValue, 0);
            lengthValue = Math.min(lengthValue, lineLength - widthLength);

            let xp = (lengthValue + halfWidthLength) * Math.cos(alpha) + x0;
            let yp = (lengthValue + halfWidthLength) * Math.sin(alpha) + y0;

            let offset = GeometryUtils.pointPositionOnLineSegment(x0, y0, x1, y1, xp, yp);

            let endAt = MathUtils.toFixedFloat(lineLength - (lineLength * offset) - halfWidthLength, PRECISION);
            let offsetUnit = attributesFormData.getIn(['offsetB', '_unit']);

            let offsetB = new Map({
              length: endAt,
              _length: convert(endAt).from(this.props.catalog.unit).to(offsetUnit),
              _unit: offsetUnit
            });

            attributesFormData = attributesFormData.set('offsetB', offsetB).set('offset', offset);

            let offsetAttribute = new Map({
              length: MathUtils.toFixedFloat(lengthValue, PRECISION),
              _unit: value.get('_unit'),
              _length: MathUtils.toFixedFloat(convert(lengthValue).from(this.props.catalog.unit).to(value.get('_unit')), PRECISION)
            });

            attributesFormData = attributesFormData.set(attributeName, offsetAttribute);

            break;
          }
          case 'offsetB':
          {
            let line = this.props.layer.lines.get(this.props.element.line);

            let orderedVertices = GeometryUtils.orderVertices([
              this.props.layer.vertices.get(line.vertices.get(0)),
              this.props.layer.vertices.get(line.vertices.get(1))
            ]);

            let [ {x: x0, y: y0}, {x: x1, y: y1} ] = orderedVertices;

            let alpha = GeometryUtils.angleBetweenTwoPoints(x0, y0, x1, y1);
            let lineLength = GeometryUtils.pointsDistance(x0, y0, x1, y1);
            let widthLength = this.props.element.properties.get('width').get('length');
            let halfWidthLength = widthLength / 2;

            let lengthValue = value.get('length');
            lengthValue = Math.max(lengthValue, 0);
            lengthValue = Math.min(lengthValue, lineLength - widthLength);

            let xp = x1 - (lengthValue + halfWidthLength) * Math.cos(alpha);
            let yp = y1 - (lengthValue + halfWidthLength) * Math.sin(alpha);

            let offset = GeometryUtils.pointPositionOnLineSegment(x0, y0, x1, y1, xp, yp);

            let startAt = MathUtils.toFixedFloat((lineLength * offset) - halfWidthLength, PRECISION);
            let offsetUnit = attributesFormData.getIn(['offsetA', '_unit']);

            let offsetA = new Map({
              length: startAt,
              _length: convert(startAt).from(this.props.catalog.unit).to(offsetUnit),
              _unit: offsetUnit
            });

            attributesFormData = attributesFormData.set('offsetA', offsetA).set('offset', offset);

            let offsetAttribute = new Map({
              length: MathUtils.toFixedFloat(lengthValue, PRECISION),
              _unit: value.get('_unit'),
              _length: MathUtils.toFixedFloat(convert(lengthValue).from(this.props.catalog.unit).to(value.get('_unit')), PRECISION)
            });

            attributesFormData = attributesFormData.set(attributeName, offsetAttribute);

            break;
          }
          default:
          {
            attributesFormData = attributesFormData.set(attributeName, value);
            break;
          }
        }
        break;
      }
      default:
        break;
    }

    this.setState({timestamp: Date.now()});
    this.save({attributesFormData});
  }

  updateProperty(propertyName, value) {
    let {state: {propertiesFormData}} = this;
    propertiesFormData = propertiesFormData.setIn([propertyName, 'currentValue'], value);
    this.setState({timestamp: Date.now()});
    this.save({propertiesFormData});
  }

  reset() {
    this.setState({timestamp: Date.now()});
  }

  save({propertiesFormData, attributesFormData}) {

    if( propertiesFormData ) {
      let properties = propertiesFormData.map(data => {
        return data.get('currentValue');
      });

      this.props.actions.project.setProperties(properties);
    }

    if( attributesFormData ) {
      switch (this.props.element.prototype) {
        case 'items': {
          this.props.actions.project.setItemsAttributes(attributesFormData);
          break;
        }
        case 'lines': {
          this.props.actions.project.setLinesAttributes(attributesFormData);
          break;
        }
        case 'holes': {
          this.props.actions.project.setHolesAttributes(attributesFormData);
          break;
        }
      }
    }
  }

  copyProperties( properties ) {
    this.props.actions.project.copyProperties( properties );
  }

  pasteProperties() {
    this.props.actions.project.pasteProperties();
  }

  render() {

    const {propertiesFormData, attributesFormData} = this.derivedState;
    const {state: appState, element, catalog, translator} = this.props;

    return (
      <div>

        <AttributesEditor
          element={element}
          onUpdate={this.updateAttribute}
          attributeFormData={attributesFormData}
          state={appState}
        />

        <div style={attrPorpSeparatorStyle}>
          <div style={headActionStyle}>
            <div title={translator.t('Copy')} style={iconHeadStyle} onClick={ () => this.copyProperties(element.properties) }><MdContentCopy /></div>
            {
              appState.get('clipboardProperties') && appState.get('clipboardProperties').size ?
                <div title={translator.t('Paste')} style={iconHeadStyle} onClick={ () => this.pasteProperties() }><MdContentPaste /></div> : null
            }
          </div>
        </div>

        {propertiesFormData.entrySeq()
          .map(([propertyName, data]) => {

            let currentValue = data.get('currentValue'), configs = data.get('configs');

            let {Editor} = catalog.getPropertyType(configs.type);

            return <Editor
              key={propertyName}
              propertyName={propertyName}
              value={currentValue}
              configs={configs}
              onUpdate={value => this.updateProperty(propertyName, value)}
              state={appState}
              sourceElement={element}
              internalState={{propertiesFormData, attributesFormData}}
            />
          })
        }

      </div>
    )
  }
}

ElementEditor.propTypes = {
  state: PropTypes.object.isRequired,
  element: PropTypes.object.isRequired,
  layer: PropTypes.object.isRequired,
  ...ContextPropTypes,
};
