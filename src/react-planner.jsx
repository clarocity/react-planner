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
  }

  render() {
    let {width, height, state, stateExtractor, ...props} = this.props;

    let contentW = width - toolbarW - sidebarW;
    let toolbarH = height - footerBarH;
    let contentH = height - footerBarH;
    let sidebarH = height - footerBarH;

    let extractedState = stateExtractor(state);

    return (
      <div style={{...wrapperStyle, height}}><Context.Provider state={extractedState} {...props}>
        <Toolbar width={toolbarW} height={toolbarH} state={extractedState} {...props} />
        <Content width={contentW} height={contentH} state={extractedState} {...props} onWheel={event => event.preventDefault()} />
        <Sidebar width={sidebarW} height={sidebarH} state={extractedState} {...props} />
        <FooterBar width={width} height={footerBarH} state={extractedState} {...props} />
      </Context.Provider></div>
    );
  }
}

ReactPlanner.propTypes = {
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
