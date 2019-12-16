import React, {Component, Fragment} from 'react';
import Panel from './panel';
import * as SharedStyle from '../../shared-style';
import PropertyNumber from '../../catalog/properties/property-number';
import PropertyMultiNumber from '../../catalog/properties/property-multi-number';
import PropertyString from '../../catalog/properties/property-string';
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

export default
@needsContext('styles', 'state', 'actions', 'translator')
class PanelGroupEditor extends Component {

  static styles = {
    root: {
      padding: '10px 15px',
    },

    list: {
      display: 'grid',
      gridTemplateColumns: '3em 1fr 1fr 1fr',
      gridAutoRows: '20px',
      gridRowGap: '5px',
    },

    rowCell: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      cursor: 'pointer',
    },

    icon: {
      cursor: 'pointer',
      marginLeft: '5px',
      border: '0px',
      background: 'none',
      fontSize: '14px',
      outline: '0px',
    },
  }

  shouldComponentUpdate(nextProps /*, nextState */) {

    const [ prevGroupID, prevGroup ] = this.props.state.getIn(['scene', 'groups']).findEntry( g => g.get('selected') ) || [];
    const [ nextGroupID, nextGroup ] =  nextProps.state.getIn(['scene', 'groups']).findEntry( g => g.get('selected') ) || [];
    if (prevGroupID !== nextGroupID) return true;
    if (prevGroup && nextGroup && prevGroup.hashCode() !== nextGroup.hashCode()) return true;

    return false;
  }

  render() {

    const { styles, translator, actions, state } = this.props;
    const [ groupID, group ] = state.getIn(['scene', 'groups']).findEntry( g => g.get('selected') ) || [];

    if (!groupID || !VISIBILITY_MODE[state.mode]) return null;

    const elements = group.get('elements');
    const hasElements = !!elements.size;

    return (
      <Panel key={groupID} name={translator.t('Group [{0}]', group.get('name'))} opened={true} inlineStyle={styles.root}>
        <PropertyString
          value={group.get('name')}
          onUpdate={v => actions.group.setGroupAttributes( groupID, new Map({ 'name': v }))}
          configs={{label: translator.t('Name')}}
          state={state}
        />
        <PropertyMultiNumber
          value={{ x: group.get('x'), y: group.get('y') }}
          onUpdate={(key, val) => {
            switch (key) {
            case 'x':
              return actions.group.groupTranslate( groupID, val, group.get('y') )
            case 'y':
              return actions.group.groupTranslate( groupID, group.get('x'), val )
            }
          }}
          configs={{
            labels: [ 'X', 'Y' ],
            targets: [ 'x', 'y' ],
            min: 0,
            max: Infinity,
            precision: 2
          }}
          state={state}
        />
        <PropertyNumber
          value={group.get('rotation')}
          onUpdate={v => actions.group.groupRotate( groupID, v )}
          configs={{label: translator.t('Rotation'), min: 0, max: Infinity, precision: 3}}
          state={state}
        />
        {hasElements &&
          <div>
            <p style={{textAlign:'center', borderBottom:SharedStyle.PRIMARY_COLOR.border , paddingBottom:'1em'}}>{translator.t('Group\'s Elements')}</p>
            <div style={styles.list}>
              <span></span>
              <span style={styles.rowCell}>{translator.t('Layer')}</span>
              <span style={styles.rowCell}>{translator.t('Prototype')}</span>
              <span style={styles.rowCell}>{translator.t('Name')}</span>

              {elements.entrySeq().map(([layerID, layerElements]) =>
                layerElements.entrySeq().map(([elementPrototype, ElementList]) =>
                  ElementList.valueSeq().map( elementID => {
                    let element = state.getIn(['scene', 'layers', layerID, elementPrototype, elementID]);
                    const onUnlink = () => actions.group.removeFromGroup( groupID, layerID, elementPrototype, elementID );

                    return (
                      <Fragment key={layerID + element.id}>
                        <span style={styles.rowCell} title={translator.t('Un-chain Element from Group')}>
                          <FaUnlink
                            onClick={onUnlink}
                            style={styles.icon}
                          />
                        </span>
                        <span style={styles.rowCell}>{layerID}</span>
                        <span style={styles.rowCell}>{elementPrototype}</span>
                        <span style={styles.rowCell}>{element.name}</span>
                      </Fragment>
                    )
                  })
                )
              )}
            </div>
          </div>
        }
      </Panel>
    );
  }

}

PanelGroupEditor.propTypes = {
  state: ContextPropTypes.state,
  actions: ContextPropTypes.actions,
  translator: ContextPropTypes.translator,
  styles: ContextPropTypes.styles,
};
