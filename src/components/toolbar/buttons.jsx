import React from 'react';
import * as SharedStyle from '../../shared-style';
import { ContextPropTypes, needsContext } from '../context';
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

export const New = needsContext(function New ({ translator, actions }) {
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

New.propTypes = { ...ContextPropTypes };

export const Catalog = needsContext(function Catalog ({ translator, actions, state }) {
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

Catalog.propTypes = { ...ContextPropTypes };

export const View2D = needsContext(function View2D ({ translator, actions, state }) {
  let mode = state.get('mode');
  let alterateColor = state.get('alterate') ? SharedStyle.MATERIAL_COLORS[500].orange : '';
  return (
    <ToolbarButton
      active={[MODE_IDLE].includes(mode)}
      tooltip={translator.t('2D View')}
      onClick={() => actions.project.setMode( MODE_IDLE )}
    >
      {[MODE_3D_FIRST_PERSON, MODE_3D_VIEW].includes(mode)
        ? <Icon2D style={{color: alterateColor}} />
        : <FaMousePointer style={{color: alterateColor}} />}
    </ToolbarButton>
  );
});

View2D.propTypes = { ...ContextPropTypes };

export const View3D = needsContext(function View3D ({ translator, actions, state }) {
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

export const ViewFirstPerson = needsContext(function ViewFirstPerson ({ translator, actions, state }) {
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

ViewFirstPerson.propTypes = { ...ContextPropTypes };

export const Undo = needsContext(function Undo ({ translator, actions }) {
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

Undo.propTypes = { ...ContextPropTypes };

export const Configure = needsContext(function Configure ({ translator, actions, state }) {
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

Configure.propTypes = { ...ContextPropTypes };


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
