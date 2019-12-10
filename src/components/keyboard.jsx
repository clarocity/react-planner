import { Component } from 'react';
import { ContextPropTypes, needsContext } from './context';
import {
  MODE_IDLE,
  MODE_3D_FIRST_PERSON,
  MODE_3D_VIEW,
  MODE_SNAPPING,
} from '../constants';

import {
  rollback,
  undo,
  remove,
  toggleSnap,
  copyProperties,
  pasteProperties,
  setAlternateState
} from '../actions/project-actions';

export default @needsContext('store', 'state', 'events') class Keyboard extends Component {

  componentDidMount () {
    this.mediator = this.props.events;
    if (this.mediator) this.mediator.bind(this);
  }

  componentWillUnmount() {
    if (this.mediator) this.mediator.unbind(this);
  }

  onKeyDown = (source, { key, ctrlKey, metaKey }) => {
    const {store, state} = this.props;
    const mode = state.get('mode');

    switch (key) {
      case 'Backspace':
      case 'Clear':
      case 'Delete':
        if ([MODE_IDLE, MODE_3D_FIRST_PERSON, MODE_3D_VIEW].includes(mode)) {
          store.dispatch(remove());
        }
        break;

      case 'Escape':
        store.dispatch(rollback());
        break;

      case 'Alt':
        if (MODE_SNAPPING.includes(mode)) {
          store.dispatch(toggleSnap(state.snapMask.merge({
            SNAP_POINT: false,
            SNAP_LINE: false,
            SNAP_SEGMENT: false,
            SNAP_GRID : false,
            SNAP_GUIDE : false,
            tempSnapConfiguartion: state.snapMask.toJS()
          })));
        }
        break;

      case 'c': {
        let selectedLayer = state.getIn(['scene', 'selectedLayer']);
        let selected = state.getIn(['scene', 'layers', selectedLayer, 'selected']);

        if ( ( mode === MODE_IDLE || mode === MODE_3D_VIEW ) && (selected.holes.size || selected.areas.size || selected.items.size || selected.lines.size)) {
          if (selected.holes.size) {
            let hole = state.getIn(['scene', 'layers', selectedLayer, 'holes', selected.holes.get(0)]);
            store.dispatch(copyProperties(hole.get('properties')));
          }
          else if (selected.areas.size) {
            let area = state.getIn(['scene', 'layers', selectedLayer, 'areas', selected.areas.get(0)]);
            store.dispatch(copyProperties(area.properties));
          }
          else if (selected.items.size) {
            let item = state.getIn(['scene', 'layers', selectedLayer, 'items', selected.items.get(0)]);
            store.dispatch(copyProperties(item.properties));
          }
          else if (selected.lines.size) {
            let line = state.getIn(['scene', 'layers', selectedLayer, 'lines', selected.lines.get(0)]);
            store.dispatch(copyProperties(line.properties));
          }
        }
        break;
      }

      case 'z':
        if (ctrlKey || metaKey) {
          store.dispatch(undo());
        }
        break;

      case 'v':
        if (ctrlKey || metaKey) {
          store.dispatch(pasteProperties());
        }
        break;

      case 'Control':
      case 'Meta':
        store.dispatch(setAlternateState(true));
        break;
    }

  }

  onKeyUp = (source, { key }) => {
    const {store, state} = this.props;
    const mode = state.get('mode');

    switch (key) {
      case 'Alt': {
        if (MODE_SNAPPING.includes(mode))
          store.dispatch(toggleSnap(state.snapMask.merge(state.snapMask.get('tempSnapConfiguartion'))));
        break;
      }

      case 'Control':
      case 'Meta':
        store.dispatch(setAlternateState(false));
        break;
    }
  }

  render() { return null; }
}

Keyboard.propTypes = {
  store: ContextPropTypes.store,
  state: ContextPropTypes.state,
  events: ContextPropTypes.events,
}
