import React from 'react';
import PropTypes from 'prop-types';
import { defaultPanels } from './panels';

import * as SharedStyle from '../../shared-style';

const STYLE = {
  backgroundColor: SharedStyle.PRIMARY_COLOR.main,
  display: 'block',
  overflowY: 'auto',
  overflowX: 'hidden',
  paddingBottom: '20px'
};

export default function Sidebar({ width, height, sidebarPanels }) {

  return (
    <aside
      style={{ width, height, ...STYLE }}
      onKeyDown={event => event.stopPropagation()}
      onKeyUp={event => event.stopPropagation()}
      className="sidebar"
    >
      {(sidebarPanels || defaultPanels).filter(Boolean).map((Panel, i) => <Panel key={i} />)}
    </aside>
  );
}

Sidebar.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  sidebarPanels: PropTypes.arrayOf(PropTypes.elementType),
};
