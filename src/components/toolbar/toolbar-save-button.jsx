import React from 'react';
import {FaSave as IconSave} from 'react-icons/fa';
import ToolbarButton from './toolbar-button';
import {browserDownload}  from '../../utils/browser';
import { Project } from '../../class/export';
import { ContextPropTypes, needsContext } from '../context';

function ToolbarSaveButton({state, translator}) {

  let saveProjectToFile = e => {
    e.preventDefault();
    state = Project.unselectAll( state ).updatedState;
    browserDownload(state.get('scene').toJS());
  };

  return (
    <ToolbarButton active={false} tooltip={translator.t('Save project')} onClick={saveProjectToFile}>
      <IconSave />
    </ToolbarButton>
  );
}

ToolbarSaveButton.propTypes = {
  state: ContextPropTypes.state,
  translator: ContextPropTypes.translator,
};

export default needsContext('state', 'translator')(ToolbarSaveButton);
