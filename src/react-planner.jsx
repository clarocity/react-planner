import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {bindActionCreators} from 'redux';
import {connect} from 'react-redux';

import Translator from './translator/translator';
import Catalog from './catalog/catalog';
import Actions from './actions/export';
import {objectsMap} from './utils/objects-utils';
import {
  ToolbarComponents,
  Content,
  SidebarComponents,
  FooterBarComponents,
  Context,
} from './components/export';
import Keyboard from './components/keyboard';
import EventsMediator from './utils/events';
import {VERSION} from './version';
import './styles/export';

const {Toolbar} = ToolbarComponents;
const {Sidebar} = SidebarComponents;
const {FooterBar} = FooterBarComponents;

class ReactPlanner extends Component {

  constructor (props) {
    super(props);
    const {actions, catalog} = props;
    actions.project.initCatalog(catalog);

    this.element = React.createRef();
    this.events = new EventsMediator();
  }

  componentDidMount() {
    this.events.onRootMount.call(this, this.element.current);
    this.element.current.focus();
  }

  onClick = (e) => {
    if (!['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.nodeName)) {
      this.element.current.focus();
    }
    this.events.onClick(e);
  }

  render() {
    let {style, state, stateExtractor, children, ...props} = this.props;
    let extractedState = stateExtractor(state);

    // segregate child components by their component's pluginTarget
    // if there's no target, put it in the root
    const frames = children.reduce((result, child) => {
      let target;
      if (child.type.pluginTarget) {
        target = result[child.type.pluginTarget];
      } else {
        target = 'root';
      }

      if (result[target]) result[target].push(child);
      else result[target] = [child];

      return result;
    }, {});

    return (
      <Context.Provider state={extractedState} root={this} events={this.events} {...props}>
        <div
          style={{ display: 'flex', flexFlow: 'column nowrap', ...style }}
          tabIndex={0}
          ref={this.element}
          onClick={this.onClick}
          onKeyDown={this.events.onKeyDown}
          onKeyUp={this.events.onKeyUp}
          onKeyPress={this.events.onKeyPress}
          onFocus={this.events.onFocus}
          onBlur={this.events.onBlur}
        >
          <div style={{}}>{frames.top}</div>
          <div style={{ display: 'flex', flex: 1 }}>
            {frames.left}
            <Toolbar {...props} />
            {frames.leftInside}
            <Content {...props} mode={extractedState.get('mode')} />
            {frames.rightInside}
            <Sidebar {...props} />
            {frames.right}
          </div>
          <div style={{}}>
            <FooterBar {...props} />
            {frames.bottom}
          </div>
          <Keyboard />
          {frames.root}
        </div>
      </Context.Provider>
    );
  }
}

ReactPlanner.propTypes = {
  style:                   PropTypes.object,
  children:                PropTypes.node,
  state:                   PropTypes.object,
  actions:                 PropTypes.object,
  translator:              PropTypes.instanceOf(Translator),
  catalog:                 PropTypes.instanceOf(Catalog),
  allowProjectFileSupport: PropTypes.bool,
  plugins:                 PropTypes.arrayOf(PropTypes.func),
  autosaveKey:             PropTypes.string,
  autosaveDelay:           PropTypes.number,
  stateExtractor:          PropTypes.func.isRequired,
  toolbarButtons:          PropTypes.arrayOf(PropTypes.elementType),
  sidebarPanels:           PropTypes.arrayOf(PropTypes.elementType),
  footerbarComponents:     PropTypes.array,
  customContents:          PropTypes.object,
  softwareSignature:       PropTypes.string,
};


ReactPlanner.defaultProps = {
  translator: new Translator(),
  catalog: new Catalog(),
  plugins: [],
  allowProjectFileSupport: true,
  softwareSignature: `React-Planner ${VERSION}`,
  footerbarComponents: [],
  customContents: {},
};

//redux connect
function mapStateToProps(reduxState) {
  return {
    state: reduxState
  }
}

function mapDispatchToProps(dispatch) {
  const actions = objectsMap(Actions, (creators) => bindActionCreators(creators, dispatch));
  return { actions }
}

export default connect(mapStateToProps, mapDispatchToProps)(ReactPlanner);
