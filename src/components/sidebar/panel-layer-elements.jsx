import React, {Component} from 'react';
import Panel from './panel';
import {
  MODE_IDLE, MODE_2D_ZOOM_IN, MODE_2D_ZOOM_OUT, MODE_2D_PAN, MODE_3D_VIEW, MODE_3D_FIRST_PERSON,
  MODE_WAITING_DRAWING_LINE, MODE_DRAWING_LINE, MODE_DRAWING_HOLE, MODE_DRAWING_ITEM, MODE_DRAGGING_LINE,
  MODE_DRAGGING_VERTEX, MODE_DRAGGING_ITEM, MODE_DRAGGING_HOLE, MODE_FITTING_IMAGE, MODE_UPLOADING_IMAGE,
  MODE_ROTATING_ITEM
} from '../../constants';
import * as SharedStyle from '../../shared-style';
import {MdSearch} from 'react-icons/md';
import { ContextPropTypes, needsContext } from '../context';
import memoize from 'memoize-one';


const VISIBILITY_MODE = {
  MODE_IDLE, MODE_2D_ZOOM_IN, MODE_2D_ZOOM_OUT, MODE_2D_PAN, MODE_3D_VIEW, MODE_3D_FIRST_PERSON,
  MODE_WAITING_DRAWING_LINE, MODE_DRAWING_LINE, MODE_DRAWING_HOLE, MODE_DRAWING_ITEM, MODE_DRAGGING_LINE,
  MODE_DRAGGING_VERTEX, MODE_DRAGGING_ITEM, MODE_DRAGGING_HOLE, MODE_FITTING_IMAGE, MODE_UPLOADING_IMAGE,
  MODE_ROTATING_ITEM
};

const contentArea = {
  height: 'auto',
  maxHeight: '15em',
  overflowY: 'auto',
  padding: '0.25em 1.15em',
  cursor: 'pointer',
  marginBottom: '1em',
  userSelect: 'none'
};

const elementStyle = {
  width: 'auto',
  height: '2.5em',
  margin: '0.25em 0.25em 0 0',
  padding: '0.5em',
  textAlign: 'center',
  display: 'inline-block',
  border: '1px solid #CCC',
  borderRadius: '0.2em'
};

const elementSelectedStyle = {
  ...elementStyle,
  color: SharedStyle.SECONDARY_COLOR.main,
  borderColor: SharedStyle.SECONDARY_COLOR.main,
};

const categoryDividerStyle = {
  paddingBottom: '0.5em',
  borderBottom: '1px solid #888',
};

const tableSearchStyle = {width: '100%', marginTop: '0.8em'};
const searchIconStyle = {fontSize: '1.5em'};
const searchInputStyle = {fontSize: '1em', width: '100%', height: '1em', padding: '1em 0.5em'};

export default @needsContext class PanelLayerElement extends Component {

  constructor(props) {
    super(props);

    this.state = {
      matchString: '',
    };
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (this.state.matchString !== nextState.matchString) return true;
    if (this.props.state.scene.selectedLayer     !== nextProps.state.scene.selectedLayer) return true;
    if (this.props.state.scene.layers.hashCode() !== nextProps.state.scene.layers.hashCode()) return true;

    return false;
  }


  matchedElements = memoize(function (layer, matchString) {
    const elements = {
      lines: layer.lines,
      holes: layer.holes,
      items: layer.items,
    };

    if (matchString) {
      const regexp = new RegExp(this.state.matchString, 'i');
      const filterCb = el => regexp.test(el.get('name'));

      return {
        lines: elements.lines.filter(filterCb),
        holes: elements.holes.filter(filterCb),
        items: elements.items.filter(filterCb)
      };
    }

    return elements;
  });

  onMatchChange = (e) => {
    this.setState({ matchString: e.target.value });
  }

  render() {
    const { state, translator, actions } = this.props;
    const { layers, selectedLayer } = state.scene;
    if (!VISIBILITY_MODE[state.mode]) return null;

    let layer = layers.get(selectedLayer);
    const matchedElements = this.matchedElements(layer, this.state.matchString, selectedLayer, layers.hashCode());

    return (
      <Panel name={translator.t('Elements on layer {0}', layer.name)}>
        <div style={contentArea} onWheel={(e) => e.stopPropagation()}>

          <table style={tableSearchStyle}>
            <tbody>
            <tr>
              <td><MdSearch style={searchIconStyle}/></td>
              <td><input type="text" style={searchInputStyle} onChange={this.onMatchChange}/></td>
            </tr>
            </tbody>
          </table>

          {
            matchedElements.lines.count() ?
              <div>
                <p style={categoryDividerStyle}>{translator.t('Lines')}</p>
                {
                  matchedElements.lines.entrySeq().map(([lineID, line]) => {
                    return (
                      <div
                        key={lineID}
                        onClick={() => actions.lines.selectLine(layer.id, line.id)}
                        style={line.selected ? elementSelectedStyle : elementStyle}
                      >
                        {line.name}
                      </div>
                    )
                  })
                }
              </div>
              : null
          }

          {
            matchedElements.holes.count() ?
              <div>
                <p style={categoryDividerStyle}>{translator.t('Holes')}</p>
                {
                  matchedElements.holes.entrySeq().map(([holeID, hole]) => {
                    return (
                      <div
                        key={holeID}
                        onClick={() => actions.holes.selectHole(layer.id, hole.id)}
                        style={hole.selected ? elementSelectedStyle : elementStyle}
                      >
                        {hole.name}
                      </div>
                    )
                  })
                }
              </div>
              : null
          }

          {
            matchedElements.items.count() ?
              <div>
                <p style={categoryDividerStyle}>{translator.t('Items')}</p>
                {
                  matchedElements.items.entrySeq().map(([itemID, item]) => {
                    return (
                      <div
                        key={itemID}
                        onClick={() => actions.items.selectItem(layer.id, item.id)}
                        style={item.selected ? elementSelectedStyle : elementStyle}
                      >
                        {item.name}
                      </div>
                    )
                  })
                }
              </div>
              : null
          }

        </div>
      </Panel>
    );
  }

}

PanelLayerElement.propTypes = {
  ...ContextPropTypes,
};
