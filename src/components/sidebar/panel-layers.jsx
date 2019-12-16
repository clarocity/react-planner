import React, {Component, PureComponent, Fragment} from 'react';
import PropTypes from 'prop-types';
import Panel from './panel';
import {TiPlus} from 'react-icons/ti';
import { FaTrash, FaEye, FaEyeSlash} from 'react-icons/fa';

import PropertyNumber from '../../catalog/properties/property-number';
import PropertyString from '../../catalog/properties/property-string';
import PropertyRange from '../../catalog/properties/property-range';
import { ContextPropTypes, needsContext } from '../context';
import {StyleAlias} from '../../themekit';

import {
  MODE_IDLE, MODE_2D_ZOOM_IN, MODE_2D_ZOOM_OUT, MODE_2D_PAN, MODE_3D_VIEW, MODE_3D_FIRST_PERSON,
  MODE_WAITING_DRAWING_LINE, MODE_DRAWING_LINE, MODE_DRAWING_HOLE, MODE_DRAWING_ITEM, MODE_DRAGGING_LINE,
  MODE_DRAGGING_VERTEX, MODE_DRAGGING_ITEM, MODE_DRAGGING_HOLE, MODE_FITTING_IMAGE, MODE_UPLOADING_IMAGE,
  MODE_ROTATING_ITEM
} from '../../constants';

const VISIBILITY_MODE = {
  MODE_IDLE, MODE_2D_ZOOM_IN, MODE_2D_ZOOM_OUT, MODE_2D_PAN,
  MODE_3D_VIEW, MODE_3D_FIRST_PERSON,
  MODE_WAITING_DRAWING_LINE, MODE_DRAWING_LINE, MODE_DRAWING_HOLE, MODE_DRAWING_ITEM,
  MODE_DRAGGING_LINE, MODE_DRAGGING_VERTEX, MODE_DRAGGING_ITEM, MODE_DRAGGING_HOLE,
  MODE_ROTATING_ITEM, MODE_UPLOADING_IMAGE, MODE_FITTING_IMAGE
};

class LayerRow extends PureComponent {

  static propTypes = {
    layerID: PropTypes.string.isRequired,
    layer: PropTypes.object.isRequired,
    isCurrentLayer: PropTypes.bool,
    isOnlyLayer: PropTypes.bool,
    translator: ContextPropTypes.translator,
    styles: ContextPropTypes.styles,
    actions: ContextPropTypes.actions,
  }

  onSelect = () => {
    this.props.actions.scene.selectLayer(this.props.layerID);
  }

  onVisible = () => {
    this.props.actions.scene.setLayerProperties(this.props.layerID, {visible: !this.props.layer.visible});
  }

  onRemove = () => {
    this.props.actions.scene.removeLayer(this.props.layerID);
  }


  render () {
    const { styles, isCurrentLayer, isOnlyLayer, layer, translator } = this.props;

    const cellStyle = styles.compile('rowCell', isCurrentLayer && '#active');
    return (
      <Fragment>
        <span style={cellStyle}>
          {!isOnlyLayer && (layer.visible
            ? <FaEye onClick={this.onVisible} style={styles.icon} />
            : <FaEyeSlash onClick={this.onVisible} style={styles.icon} />
          )}
        </span>
        <span style={cellStyle} onClick={this.onSelect}>{layer.name}</span>
        <span style={cellStyle} onClick={this.onSelect}>{layer.altitude}</span>
        <span style={cellStyle}>
          {!isOnlyLayer &&
            <FaTrash
              onClick={this.onRemove}
              style={styles.icon}
              title={translator.t('Delete layer')}
            />
          }
        </span>
      </Fragment>
    );
  }
}

export default @needsContext('styles', 'state', 'actions', 'translator') class PanelLayers extends Component {

  static styles = {
    root: {
      padding: '10px 15px',
    },

    list: {
      display: 'grid',
      gridTemplateColumns: '3em 2fr 1fr 3em',
      gridAutoRows: '20px',
      gridRowGap: '5px',
    },

    rowCell: {
      display: 'flex',
      alignItems: 'center',
      cursor: 'pointer',
      // padding: '0 5px',

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

  shouldComponentUpdate(nextProps) {
    if(
      this.props.state.scene.layers.hashCode() !== nextProps.state.scene.layers.hashCode() ||
      this.props.state.sceneHistory.hashCode() !== nextProps.state.sceneHistory.hashCode() ||
      this.props.state.scene.selectedLayer !== nextProps.state.scene.selectedLayer
    ) return true;

    return false;
  }

  addLayer = () => {
    this.props.actions.scene.addLayer('', 0);
  }

  updateSelectedLayer = (layerData) => {
    this.props.actions.scene.setLayerProperties(this.props.state.scene.selectedLayer, layerData);
  }

  render() {
    const { styles, translator, actions, state } = this.props;
    if (!VISIBILITY_MODE[state.mode]) return null;

    const scene = state.scene;
    const isOnlyLayer = scene.layers.size === 1;
    const selectedLayer = scene.layers.get(scene.selectedLayer);

    return (
      <Fragment>
        <Panel name={translator.t('Layers')} inlineStyle={styles.root}>
          <div style={styles.list}>
            <span></span>
            <span style={styles.rowCell}>{translator.t('Name')}</span>
            <span style={styles.rowCell}>{translator.t('Altitude')}</span>
            <span></span>

            {scene.layers.entrySeq().map(([layerID, layer]) => {
              const isCurrentLayer = layerID === scene.selectedLayer;
              return <LayerRow key={layerID} {...{layerID, layer, isCurrentLayer, isOnlyLayer, styles, actions, translator}}/>
            })}
          </div>
          <div style={styles.actionBar}>
            <span onClick={this.addLayer} style={styles.actionBarItem}>
              <TiPlus style={styles.actionBarIcon} />
              {translator.t('New layer')}
            </span>
          </div>
        </Panel>
        <Panel name={translator.t('Current Layer') + ': ' + selectedLayer.name}>
          <div style={{padding: '10px 15px 5px'}}>
            <PropertyString
              value={selectedLayer.get('name')}
              onUpdate={v => this.updateSelectedLayer({ name: v })}
              configs={{label: translator.t('Name')}}
              state={state}
            />
            <PropertyRange
              value={Math.round(selectedLayer.get('opacity') * 100)}
              onUpdate={v => this.updateSelectedLayer({ opacity: v / 100 })}
              configs={{label: translator.t('Opacity'), min: 0, max: 100}}
              state={state}
            />
            <PropertyNumber
              value={selectedLayer.get('altitude')}
              onUpdate={v => this.updateSelectedLayer({ altitude: v })}
              configs={{label: translator.t('Altitude'), precision: 0}}
              state={state}
            />
            <PropertyNumber
              value={selectedLayer.get('order')}
              onUpdate={v => this.updateSelectedLayer({ order: v })}
              configs={{label: translator.t('Order'), precision: 0}}
              state={state}
            />
          </div>
        </Panel>
      </Fragment>
    );
  }

}

PanelLayers.propTypes = {
  state: ContextPropTypes.state,
  actions: ContextPropTypes.actions,
  translator: ContextPropTypes.translator,
  styles: ContextPropTypes.styles,
};
