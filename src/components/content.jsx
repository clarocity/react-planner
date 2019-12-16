import React from 'react';
import PropTypes from 'prop-types';
import Viewer2D from './viewer2d/viewer2d';
import Viewer3D from './viewer3d/viewer3d';
import Viewer3DFirstPerson from './viewer3d/viewer3d-first-person';
import CatalogList from './catalog-view/catalog-list';
import ProjectConfigurator from './configurator/project-configurator';

import * as constants from '../constants';

function Picker({mode, svgPlugins}) {
  switch (mode) {
    case constants.MODE_3D_VIEW:
      return <Viewer3D />;

    case constants.MODE_3D_FIRST_PERSON:
      return <Viewer3DFirstPerson />;

    case constants.MODE_VIEWING_CATALOG:
      return <CatalogList />;

    case constants.MODE_IDLE:
    case constants.MODE_2D_ZOOM_IN:
    case constants.MODE_2D_ZOOM_OUT:
    case constants.MODE_2D_PAN:
    case constants.MODE_WAITING_DRAWING_LINE:
    case constants.MODE_DRAGGING_LINE:
    case constants.MODE_DRAGGING_VERTEX:
    case constants.MODE_DRAGGING_ITEM:
    case constants.MODE_DRAWING_LINE:
    case constants.MODE_DRAWING_HOLE:
    case constants.MODE_DRAWING_ITEM:
    case constants.MODE_DRAGGING_HOLE:
    case constants.MODE_ROTATING_ITEM:
      return <Viewer2D plugins={svgPlugins} />;

    case constants.MODE_CONFIGURING_PROJECT:
      return <ProjectConfigurator />;

    default:
      throw new Error(`Mode ${mode} doesn't have a mapped content`);
  }
}

export default function Content (props) {
  return <div style={{ flex: 1, position: 'relative' }}><Picker {...props} /></div>
}

Content.propTypes = {
  mode: PropTypes.string.isRequired,
  svgPlugins: PropTypes.array,
};
