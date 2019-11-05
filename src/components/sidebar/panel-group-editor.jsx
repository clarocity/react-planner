import React, {Component} from 'react';
import Panel from './panel';
import * as SharedStyle from '../../shared-style';
import { FormNumberInput, FormTextInput } from '../style/export';
import { Map } from 'immutable';
import { ContextPropTypes, needsContext } from '../context';

import {FaUnlink} from 'react-icons/fa';

import {
  MODE_IDLE, MODE_2D_ZOOM_IN, MODE_2D_ZOOM_OUT, MODE_2D_PAN, MODE_3D_VIEW, MODE_3D_FIRST_PERSON,
  MODE_WAITING_DRAWING_LINE, MODE_DRAWING_LINE, MODE_DRAWING_HOLE, MODE_DRAWING_ITEM, MODE_DRAGGING_LINE,
  MODE_DRAGGING_VERTEX, MODE_DRAGGING_ITEM, MODE_DRAGGING_HOLE, MODE_FITTING_IMAGE, MODE_UPLOADING_IMAGE,
  MODE_ROTATING_ITEM
} from '../../constants';

const VISIBILITY_MODE = {
  MODE_IDLE, MODE_2D_ZOOM_IN, MODE_2D_ZOOM_OUT, MODE_2D_PAN, MODE_3D_VIEW, MODE_3D_FIRST_PERSON,
  MODE_WAITING_DRAWING_LINE, MODE_DRAWING_LINE, MODE_DRAWING_HOLE, MODE_DRAWING_ITEM, MODE_DRAGGING_LINE,
  MODE_DRAGGING_VERTEX, MODE_DRAGGING_ITEM, MODE_DRAGGING_HOLE, MODE_FITTING_IMAGE, MODE_UPLOADING_IMAGE,
  MODE_ROTATING_ITEM
};

const tableStyle = { width: '100%' };
const firstTdStyle = { width: '6em' };
const inputStyle = { textAlign: 'left' };
const styleEditButton = {
  marginLeft: '5px',
  border: '0px',
  background: 'none',
  color: SharedStyle.COLORS.white,
  fontSize: '14px',
  outline: '0px'
};

const tablegroupStyle = {
  width: '100%',
  cursor: 'pointer',
  maxHeight: '20em',
  marginLeft: '1px',
  marginTop: '1em'
};

const iconColStyle = {width: '2em'};

export default @needsContext class PanelGroupEditor extends Component {

  shouldComponentUpdate(nextProps /*, nextState */) {

    const [ prevGroupID, prevGroup ] = this.props.state.getIn(['scene', 'groups']).findEntry( g => g.get('selected') ) || [];
    const [ nextGroupID, nextGroup ] =  nextProps.state.getIn(['scene', 'groups']).findEntry( g => g.get('selected') ) || [];
    if (prevGroupID !== nextGroupID) return true;
    if (prevGroup && nextGroup && prevGroup.hashCode() !== nextGroup.hashCode()) return true;

    return false;
  }

  render() {

    const { translator, actions, state } = this.props;
    const [ groupID, group ] = state.getIn(['scene', 'groups']).findEntry( g => g.get('selected') ) || [];

    if (!groupID || !VISIBILITY_MODE[state.mode]) return null;

    let elements = group.get('elements');

    return (
      <Panel name={translator.t('Group [{0}]', group.get('name'))} opened={true}>
        <div style={{padding: '5px 15px'}}>
          <table style={tableStyle}>
            <tbody>
              <tr>
                <td style={firstTdStyle}>{translator.t('Name')}</td>
                <td>
                  <FormTextInput
                    value={group.get('name')}
                    onChange={e => actions.group.setGroupAttributes( groupID, new Map({ 'name': e.target.value }) ) }
                    style={inputStyle}
                  />
                </td>
              </tr>
              <tr>
                <td style={firstTdStyle}>X</td>
                <td>
                  <FormNumberInput
                    value={group.get('x')}
                    onChange={e => actions.group.groupTranslate( groupID, e.target.value, group.get('y') ) }
                    style={inputStyle}
                    state={state}
                    precision={2}
                  />
                </td>
              </tr>
              <tr>
                <td style={firstTdStyle}>Y</td>
                <td>
                  <FormNumberInput
                    value={group.get('y')}
                    onChange={e => actions.group.groupTranslate( groupID, group.get('x'), e.target.value ) }
                    style={inputStyle}
                    state={state}
                    precision={2}
                  />
                </td>
              </tr>
              <tr>
                <td style={firstTdStyle}>{translator.t('Rotation')}</td>
                <td>
                  <FormNumberInput
                    value={group.get('rotation')}
                    onChange={e => actions.group.groupRotate( groupID, e.target.value ) }
                    style={inputStyle}
                    state={state}
                    precision={2}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          {
            elements.size ?
              <div>
                <p style={{textAlign:'center', borderBottom:SharedStyle.PRIMARY_COLOR.border , paddingBottom:'1em'}}>{translator.t('Group\'s Elements')}</p>
                <table style={tablegroupStyle}>
                  <thead>
                    <tr>
                      <th style={iconColStyle}></th>
                      <th>{translator.t('Layer')}</th>
                      <th>{translator.t('Prototype')}</th>
                      <th>{translator.t('Name')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {
                      elements.entrySeq().map(([ layerID, layerElements ]) => {

                        return layerElements.entrySeq().map(([elementPrototype, ElementList]) => {

                          return ElementList.valueSeq().map( elementID => {
                            let element = state.getIn(['scene', 'layers', layerID, elementPrototype, elementID]);

                            return <tr
                              key={elementID}
                            >
                              <td style={iconColStyle} title={translator.t('Un-chain Element from Group')}>
                                <FaUnlink
                                  onClick={ () => actions.group.removeFromGroup( groupID, layerID, elementPrototype, elementID ) }
                                  style={styleEditButton}
                                />
                              </td>
                              <td style={{textAlign:'center'}}>
                                {layerID}
                              </td>
                              <td style={{textAlign:'center', textTransform:'capitalize'}}>
                                {elementPrototype}
                              </td>
                              <td style={{textAlign:'center'}}>
                                {element.name}
                              </td>
                            </tr>;
                          });
                        });
                      })
                    }
                  </tbody>
                </table>
              </div> :
              null
          }
        </div>
      </Panel>
    );
  }

}

PanelGroupEditor.propTypes = {
  ...ContextPropTypes,
};
