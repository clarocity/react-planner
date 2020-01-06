import React from 'react';
import ReactDOM from 'react-dom';
import Immutable, {Map} from 'immutable';
import immutableDevtools from 'immutable-devtools';
import {createStore} from 'redux';
import {Provider} from 'react-redux';

import MyCatalog from './catalog/mycatalog';
import MyButtons from './ui/toolbar';

import {
  Models as PlannerModels,
  reducer as plannerReducer,
  ReactPlanner,
  Plugins,
  Buttons,
} from 'react-planner'; //react-planner

const rootElement = document.getElementById('react-planner');
const stateInputSelector = rootElement.getAttribute('data-state-selector');
const svgInputSelector = rootElement.getAttribute('data-svg-selector');
const svgImageSelector = rootElement.getAttribute('data-img-selector');
const storageKey = rootElement.getAttribute('data-storage-key');

//define reducer
let reducer = (state, action) => {
  if (!state) {
    state = Map({
      'react-planner': new PlannerModels.State()
    });
  }
  state = state.update('react-planner', plannerState => plannerReducer(plannerState, action));
  return state;
};

let blackList = isProduction === true ? [] : [
  'UPDATE_MOUSE_COORDS',
  'UPDATE_ZOOM_SCALE',
  'UPDATE_2D_CAMERA'
];

if( !isProduction ) {
  console.info('Environment is in development and these actions will be blacklisted', blackList);
  console.info('Enable Chrome custom formatter for Immutable pretty print');
  immutableDevtools( Immutable );
}

//init store
let store = createStore(
  reducer,
  null,
  !isProduction && window.__REDUX_DEVTOOLS_EXTENSION__ ?
    window.__REDUX_DEVTOOLS_EXTENSION__({
      features: {
        pause   : true,     // start/pause recording of dispatched actions
        lock    : true,     // lock/unlock dispatching actions and side effects
        persist : true,     // persist states on page reloading
        export  : true,     // export history of actions in a file
        import  : 'custom', // import history of actions from a file
        jump    : true,     // jump back and forth (time travelling)
        skip    : true,     // skip (cancel) actions
        reorder : true,     // drag and drop actions in the history list
        dispatch: true,     // dispatch custom actions or action creators
        test    : true      // generate tests for the selected actions
      },
      actionsBlacklist: blackList,
      maxAge: 999999
    }) :
    f => f
);

let toolbarButtons = [
  ...Buttons.defaultButtons,
  MyButtons.TakeScreenshot,
];

//render
ReactDOM.render(
  (
    <Provider store={store}>
      <ReactPlanner
        catalog={MyCatalog}
        toolbarButtons={toolbarButtons}
        stateExtractor={state => state.get('react-planner')}
        style={{ position: 'absolute', left: 0, top: 0, right: 0, bottom: 0 }}
      >
        <Plugins.Autosave storageKey={storageKey} inputElement={stateInputSelector} />
        <Plugins.ConsoleDebugger />
        <Plugins.ImageSaver imageElement={svgImageSelector} inputElement={svgInputSelector} />
      </ReactPlanner>
    </Provider>
  ),
  rootElement
);

