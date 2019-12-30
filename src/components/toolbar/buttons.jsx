import React from 'react';
import PropTypes from 'prop-types';
import { ContextPropTypes, needsContext } from '../context';
import {StyleAlias, BorderStyle} from '../../themekit';
import { MdSettings, MdUndo, MdDirectionsRun } from 'react-icons/md';
import { FaFile, FaMousePointer, FaPlus } from 'react-icons/fa';
import {
  MODE_IDLE,
  MODE_3D_VIEW,
  MODE_3D_FIRST_PERSON,
  MODE_VIEWING_CATALOG,
  MODE_CONFIGURING_PROJECT
} from '../../constants';

import ToolbarButton from './toolbar-button';
import Save from './toolbar-save-button';
import Load from './toolbar-load-button';

const iconTextStyle = {
  fontSize: '19px',
  textDecoration: 'none',
  fontWeight: 'bold',
  margin: '0px',
  userSelect: 'none'
};

const Icon2D = ( {style} ) => <p style={{...iconTextStyle, ...style}}>2D</p>; //eslint-disable-line react/prop-types
const Icon3D = ( {style} ) => <p style={{...iconTextStyle, ...style}}>3D</p>; //eslint-disable-line react/prop-types

export {
  Save,
  Load,
}

@needsContext('styles')
class Spacer extends React.PureComponent {
  static styles = {
    label: {
      marginLeft: '4px',
      marginRight: '4px',
      marginBottom: '4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: 9,
      color: new StyleAlias('toolbar.color'),
      textAlign: 'center',
      borderBottom: new BorderStyle({ width: '2px', color: '$toolbar.color'}),
      paddingBottom: '2px',
      lineHeight: 1,
    }
  }

  render () {
    const { styles, size = 10, label = '', style } = this.props;

    return (
      <label style={styles.compile('label', { marginTop: size}, style)}>{label}</label>
    );
  }
}

Spacer.propTypes = {
  size: PropTypes.number,
  label: PropTypes.string,
  style: PropTypes.object,
  styles: ContextPropTypes.styles,
};

export { Spacer };

export const New = needsContext('state', 'actions', 'translator')(function New ({ translator, actions }) {
  return (
    <ToolbarButton
      active={false}
      tooltip={translator.t('New project')}
      onClick={() => confirm(translator.t('Would you want to start a new Project?')) ? actions.project.newProject() : null}
    >
      <FaFile />
    </ToolbarButton>
  );
});

New.propTypes = {
  state: ContextPropTypes.state,
  actions: ContextPropTypes.actions,
  translator: ContextPropTypes.translator,
}

export const Catalog = needsContext('state', 'actions', 'translator')(function Catalog ({ translator, actions, state }) {
  let mode = state.get('mode');
  return (
    <ToolbarButton
      active={[MODE_VIEWING_CATALOG].includes(mode)}
      tooltip={translator.t('Open catalog')}
      onClick={() => actions.project.openCatalog()}
    >
      <FaPlus />
    </ToolbarButton>
  );
});

Catalog.propTypes = {
  state: ContextPropTypes.state,
  actions: ContextPropTypes.actions,
  translator: ContextPropTypes.translator,
}

export const View2D = needsContext('state', 'actions', 'translator')(function View2D ({ translator, actions, state }) {
  let mode = state.get('mode');
  let alternate = state.get('alternate');
  return (
    <ToolbarButton
      active={[MODE_IDLE].includes(mode)}
      alternate={alternate}
      tooltip={translator.t('2D View')}
      onClick={() => actions.project.setMode( MODE_IDLE )}
    >
      {[MODE_3D_FIRST_PERSON, MODE_3D_VIEW].includes(mode)
        ? <Icon2D />
        : <FaMousePointer />}
    </ToolbarButton>
  );
});

View2D.propTypes = {
  state: ContextPropTypes.state,
  actions: ContextPropTypes.actions,
  translator: ContextPropTypes.translator,
}

export const View3D = needsContext('state', 'actions', 'translator')(function View3D ({ translator, actions, state }) {
  let mode = state.get('mode');
  return (
    <ToolbarButton
      active={[MODE_3D_VIEW].includes(mode)}
      tooltip={translator.t('3D View')}
      onClick={() => actions.viewer3D.selectTool3DView()}
    >
      <Icon3D />
    </ToolbarButton>
  );
});

View3D.propTypes = { ...ContextPropTypes };

export const ViewFirstPerson = needsContext('state', 'actions', 'translator')(function ViewFirstPerson ({ translator, actions, state }) {
  let mode = state.get('mode');
  return (
    <ToolbarButton
      active={[MODE_3D_FIRST_PERSON].includes(mode)}
      tooltip={translator.t('3D First Person')}
      onClick={() => actions.viewer3D.selectTool3DFirstPerson()}
    >
      <MdDirectionsRun />
    </ToolbarButton>
  );
});

ViewFirstPerson.propTypes = {
  state: ContextPropTypes.state,
  actions: ContextPropTypes.actions,
  translator: ContextPropTypes.translator,
}

export const Undo = needsContext('state', 'actions', 'translator')(function Undo ({ translator, actions }) {
  return (
    <ToolbarButton
      active={false}
      tooltip={translator.t('Undo (CTRL-Z)')}
      onClick={() => actions.project.undo()}
    >
      <MdUndo />
    </ToolbarButton>
  );
});

Undo.propTypes = {
  state: ContextPropTypes.state,
  actions: ContextPropTypes.actions,
  translator: ContextPropTypes.translator,
}

export const Configure = needsContext('state', 'actions', 'translator')(function Configure ({ translator, actions, state }) {
  let mode = state.get('mode');
  return (
    <ToolbarButton
      active={[MODE_CONFIGURING_PROJECT].includes(mode)}
      tooltip={translator.t('Configure project')}
      onClick={() => actions.project.openProjectConfigurator()}
    >
      <MdSettings />
    </ToolbarButton>
  );
});

Configure.propTypes = {
  state: ContextPropTypes.state,
  actions: ContextPropTypes.actions,
  translator: ContextPropTypes.translator,
}


export const defaultButtons = [
  New,
  Save,
  Load,
  Catalog,
  View3D,
  View2D,
  ViewFirstPerson,
  Undo,
  Configure,
];

export default {
  Spacer,
  Save,
  Load,
  New,
  Catalog,
  View2D,
  View3D,
  ViewFirstPerson,
  Undo,
  Configure,
  defaultButtons,
}
