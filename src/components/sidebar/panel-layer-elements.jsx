import React, {Component, Fragment} from 'react';
import Panel from './panel';
import {
  MODE_IDLE, MODE_2D_ZOOM_IN, MODE_2D_ZOOM_OUT, MODE_2D_PAN, MODE_3D_VIEW, MODE_3D_FIRST_PERSON,
  MODE_WAITING_DRAWING_LINE, MODE_DRAWING_LINE, MODE_DRAWING_HOLE, MODE_DRAWING_ITEM, MODE_DRAGGING_LINE,
  MODE_DRAGGING_VERTEX, MODE_DRAGGING_ITEM, MODE_DRAGGING_HOLE, MODE_FITTING_IMAGE, MODE_UPLOADING_IMAGE,
  MODE_ROTATING_ITEM
} from '../../constants';
import {MdSearch} from 'react-icons/md';
import { ContextPropTypes, needsContext } from '../context';
import {StyleAlias} from '../../themekit';
import memoize from 'memoize-one';


const VISIBILITY_MODE = {
  MODE_IDLE, MODE_2D_ZOOM_IN, MODE_2D_ZOOM_OUT, MODE_2D_PAN, MODE_3D_VIEW, MODE_3D_FIRST_PERSON,
  MODE_WAITING_DRAWING_LINE, MODE_DRAWING_LINE, MODE_DRAWING_HOLE, MODE_DRAWING_ITEM, MODE_DRAGGING_LINE,
  MODE_DRAGGING_VERTEX, MODE_DRAGGING_ITEM, MODE_DRAGGING_HOLE, MODE_FITTING_IMAGE, MODE_UPLOADING_IMAGE,
  MODE_ROTATING_ITEM
};

export default
@needsContext('styles', 'state', 'actions', 'translator')
class PanelLayerElements extends Component {

  static styles = {
    root: {
      padding: '10px 15px',
    },

    search: {
      display: 'flex',
      alignItems: 'center',
    },

    searchIcon: {
      flexGrow: 0,
      flexShrink: 0,
      fontSize: '16px',
      marginRight: '5px',
    },

    searchInput: {
      flexGrow: 1,
      flexShrink: 0,
    },

    categoryHeader: {
      paddingBottom: '0.5em',
      borderBottom: '1px solid #888',
    },

    elements: {
      display: 'flex',
      flexWrap: 'wrap',
    },

    element: {
      fontSize: '1.1em',
      backgroundColor: new StyleAlias('sidebar.textColor'),
      color: new StyleAlias('sidebar.backgroundColor'),
      textShadow: 'none',
      borderRadius: '0.2em',
      margin: '0.15em 0.15em',
      padding: '0.5em',

      '#active': {
        backgroundColor: new StyleAlias('sidebar.targetColor'),
      }
    }
  }

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
    const { styles, state, translator, actions } = this.props;
    const { layers, selectedLayer } = state.scene;
    if (!VISIBILITY_MODE[state.mode]) return null;

    let layer = layers.get(selectedLayer);
    const matchedElements = this.matchedElements(layer, this.state.matchString, selectedLayer, layers.hashCode());

    const ELEMENT_STYLE = styles.element;
    const ELEMENT_SELECTED_STYLE = styles.compile('element#active');

    return (
      <Panel name={translator.t('Elements on layer {0}', layer.name)} inlineStyle={styles.root}>
        <div style={styles.search}>
          <MdSearch style={styles.searchIcon} />
          <input type="text" style={styles.searchInput} onChange={this.onMatchChange}/>
        </div>

        {!!matchedElements.lines.count() && <Fragment>
          <p style={styles.categoryHeader}>{translator.t('Lines')}</p>
          <div style={styles.elements}>{
            matchedElements.lines.entrySeq().map(([lineID, line]) => {
              return (
                <div
                  key={lineID}
                  onClick={() => actions.lines.selectLine(layer.id, line.id)}
                  style={line.selected ? ELEMENT_SELECTED_STYLE : ELEMENT_STYLE}
                >
                  {line.name}
                </div>
              )
            })
          }</div>
        </Fragment>}

        {!!matchedElements.holes.count() && <Fragment>
          <p style={styles.categoryHeader}>{translator.t('Holes')}</p>
          <div style={styles.elements}>{
            matchedElements.holes.entrySeq().map(([holeID, hole]) => {
              return (
                <div
                  key={holeID}
                  onClick={() => actions.holes.selectHole(layer.id, hole.id)}
                  style={hole.selected ? ELEMENT_SELECTED_STYLE : ELEMENT_STYLE}
                >
                  {hole.name}
                </div>
              )
            })
          }</div>
        </Fragment>}

        {!!matchedElements.items.count() && <Fragment>
          <p style={styles.categoryHeader}>{translator.t('Items')}</p>
          <div style={styles.elements}>{
            matchedElements.items.entrySeq().map(([itemID, item]) => {
              return (
                <div
                  key={itemID}
                  onClick={() => actions.items.selectItem(layer.id, item.id)}
                  style={item.selected ? ELEMENT_SELECTED_STYLE : ELEMENT_STYLE}
                >
                  {item.name}
                </div>
              )
            })
          }</div>
        </Fragment>}
      </Panel>
    );
  }

}

PanelLayerElements.propTypes = {
  state: ContextPropTypes.state,
  actions: ContextPropTypes.actions,
  translator: ContextPropTypes.translator,
  styles: ContextPropTypes.styles,
};
