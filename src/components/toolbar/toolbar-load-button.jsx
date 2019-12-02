import React from 'react';
import {FaFolderOpen as IconLoad} from 'react-icons/fa';
import ToolbarButton from './toolbar-button';
import {browserUpload}  from '../../utils/browser';
import { ContextPropTypes, needsContext } from '../context';

function ToolbarLoadButton({actions, translator}) {

  let loadProjectFromFile = event => {
    event.preventDefault();
    browserUpload().then((data) => {
      actions.project.loadProject(JSON.parse(data));
    });
  };

  return (
    <ToolbarButton active={false} tooltip={translator.t("Load project")} onClick={loadProjectFromFile}>
      <IconLoad />
    </ToolbarButton>
  );
}

ToolbarLoadButton.propTypes = {
  actions: ContextPropTypes.actions,
  translator: ContextPropTypes.translator,
};

export default needsContext('actions', 'translator')(ToolbarLoadButton);
