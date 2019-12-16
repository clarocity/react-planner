import React, {Component, PureComponent, Fragment} from 'react';
import PropTypes from 'prop-types';
import Panel from './panel';
import {TiPlus} from 'react-icons/ti';
import {FaTrash, FaLink, FaUnlink} from 'react-icons/fa';
import { Map } from 'immutable';
import { ContextPropTypes, needsContext } from '../context';
import {StyleAlias} from '../../themekit';

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

class GroupRow extends PureComponent {

  static propTypes = {
    groupID: PropTypes.string.isRequired,
    group: PropTypes.object.isRequired,
    layers: PropTypes.object.isRequired,
    isSelected: PropTypes.bool,
    translator: ContextPropTypes.translator,
    styles: ContextPropTypes.styles,
    actions: ContextPropTypes.actions,
  }

  onRemove = () => {
    this.props.actions.groups.removeGroupAndDeleteElements(this.props.groupID)
  }

  onSelect = () => {
    this.props.actions.groups.selectGroup(this.props.groupID);
  }

  onVisible = () => {
    this.props.actions.groups.setGroupProperties(this.props.groupID, new Map({visible: !this.props.group.get('visible')}));
  };

  onChain = () => {
    const { layers, actions, groupID } = this.props;

    layers.forEach((layer) => {

      let layerID = layer.get('id');
      let layerElements = {
        'lines': layer.get('lines'),
        'items': layer.get('items'),
        'holes': layer.get('holes'),
        'areas': layer.get('areas')
      };

      for( let elementPrototype in layerElements )
      {
        let ElementList = layerElements[elementPrototype];
        ElementList.filter( el => el.get('selected') ).forEach( element => {
          actions.groups.addToGroup( groupID, layerID, elementPrototype, element.get('id') );
        });
      }
    });

    this.onSelect();
  };

  onUnchain = () => {
    this.props.actions.groups.removeGroup(this.props.groupID)
  }


  render () {
    const { styles, isSelected, group, translator } = this.props;
    let elementCount = group.get('elements').reduce( ( sum, layer ) => {
      return sum + layer.reduce( ( lSum, elProt ) => lSum + elProt.size, 0 );
    }, 0);

    const cellStyle = styles.compile('rowCell', isSelected && '#active');
    return (
      <Fragment>
        <span style={cellStyle} title={translator.t('Chain selected Elements to Group')}>
          <FaLink
            onClick={this.onChain}
            style={styles.icon}
          />
        </span>
        <span style={cellStyle} onClick={this.onSelect}>{group.get('name')}</span>
        <span style={cellStyle} onClick={this.onSelect}>{elementCount}</span>
        <span style={cellStyle} title={translator.t('Un-chain all Group\'s Elements and remove Group')}>
          <FaUnlink
            onClick={this.onUnchain}
            style={styles.icon}
          />
        </span>
        <span style={cellStyle}>
          <FaTrash
            onClick={this.onRemove}
            style={styles.icon}
            title={translator.t('Delete group and all Elements')}
          />
        </span>
      </Fragment>
    );
  }
}

export default
@needsContext('styles', 'state', 'actions', 'translator')
class PanelGroups extends Component {

  static styles = {
    root: {
      padding: '10px 15px',
    },

    list: {
      display: 'grid',
      gridTemplateColumns: '3em 2fr 1fr 2em 2em',
      gridAutoRows: '20px',
      gridRowGap: '5px',
    },

    rowCell: {
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',

      '#active': {
        color: new StyleAlias('sidebar.targetColor'),
      }
    },

    icon: {
      cursor: 'pointer',
      marginLeft: '5px',
      border: '0px',
      background: 'none',
      fontSize: '14px',
      outline: '0px',
    },

    actionBar: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: '10px',
    },

    actionBarItem: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      whitespace: 'nowrap',
      margin: '0 2px',
      cursor: 'pointer',
    },

    actionBarIcon: {
      marginRight: '3px',
      fontSize: '16px'
    }
  }

  constructor(props) {
    super(props);

    this.state = {
      newEmptyHover: false,
      newSelectedHover: false
    };
  }

  shouldComponentUpdate(nextProps /*, nextState */) {
    return (
      this.props.state.scene.groups.hashCode() !== nextProps.state.scene.groups.hashCode() ||
      this.props.state.scene.layers.hashCode() !== nextProps.state.scene.layers.hashCode() ||
      this.props.state.mode !== nextProps.state.mode
    );
  }

  onAddEmptyGroup = () => this.props.actions.groups.addGroup()
  onAddGroupFromSelection = () => this.props.actions.groups.addGroupFromSelected()


  render() {
    let { styles, state, actions, translator } = this.props;
    const { groups, layers } = state.scene;

    if (!VISIBILITY_MODE[ state.mode ]) return null;

    const hasGroups = !!groups.size;

    return (
      <Panel name={translator.t('Groups')} key={groups.size} opened={hasGroups} inlineStyle={styles.root}>
        {hasGroups &&
            <div style={styles.list}>
            <span></span>
            <span style={styles.rowCell}>{translator.t('Name')}</span>
            <span style={styles.rowCell}>{translator.t('Elements')}</span>
            <span></span>
            <span></span>

            {groups.entrySeq().map(([groupID, group]) =>
              <GroupRow key={groupID} {...{
                group,
                groupID,
                isSelected: group.get('selected'),
                styles,
                actions,
                translator,
                layers,
              }}/>
            )}
          </div>
        }
        <div style={styles.actionBar}>
          <span onClick={this.onAddEmptyGroup} style={styles.actionBarItem}>
            <TiPlus style={styles.actionBarIcon} />
            {translator.t('New Empty Group')}
          </span>
          <span onClick={this.onAddGroupFromSelection} style={styles.actionBarItem}>
            <TiPlus style={styles.actionBarIcon} />
            {translator.t('New Group From Selection')}
          </span>
        </div>
      </Panel>
    )
  }

}

PanelGroups.propTypes = {
  state: ContextPropTypes.state,
  actions: ContextPropTypes.actions,
  translator: ContextPropTypes.translator,
  styles: ContextPropTypes.styles,
};
