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

const toolbarW = 50;
const sidebarW = 300;
const footerBarH= 20;

const wrapperStyle = {
  display: 'flex',
  flexFlow: 'row nowrap'
};

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
    let {width, height, state, stateExtractor, children, ...props} = this.props;

    let contentW = width - toolbarW - sidebarW;
    let toolbarH = height - footerBarH;
    let contentH = height - footerBarH;
    let sidebarH = height - footerBarH;

    let extractedState = stateExtractor(state);

    return (
      <div
        style={{...wrapperStyle, height}}
        tabIndex={0}
        ref={this.element}
        onClick={this.onClick}
        onKeyDown={this.events.onKeyDown}
        onKeyUp={this.events.onKeyUp}
        onKeyPress={this.events.onKeyPress}
        onFocus={this.events.onFocus}
        onBlur={this.events.onBlur}

      >
        <Context.Provider state={extractedState} root={this} events={this.events} {...props}>
          <Toolbar width={toolbarW} height={toolbarH}   {...props} />
          <Content width={contentW} height={contentH}   {...props} mode={extractedState.get('mode')} onWheel={event => event.preventDefault()} />
          <Sidebar width={sidebarW} height={sidebarH}   {...props} state={extractedState} />
          <FooterBar width={width}  height={footerBarH} {...props} />
          <Keyboard />
          {children}
        </Context.Provider>
      </div>
    );
  }
}

ReactPlanner.propTypes = {
  children:                PropTypes.node,
  state:                   PropTypes.object,
  actions:                 PropTypes.object,
  translator:              PropTypes.instanceOf(Translator),
  catalog:                 PropTypes.instanceOf(Catalog),
  allowProjectFileSupport: PropTypes.bool,
  plugins:                 PropTypes.arrayOf(PropTypes.func),
  autosaveKey:             PropTypes.string,
  autosaveDelay:           PropTypes.number,
  width:                   PropTypes.number.isRequired,
  height:                  PropTypes.number.isRequired,
  stateExtractor:          PropTypes.func.isRequired,
  toolbarButtons:          PropTypes.array,
  sidebarComponents:       PropTypes.array,
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
  toolbarButtons: [],
  sidebarComponents: [],
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
