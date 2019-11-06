import React from 'react';
import PropTypes from 'prop-types';
import { defaultPanels } from './panels';

import * as SharedStyle from '../../shared-style';

const STYLE = {
  backgroundColor: SharedStyle.PRIMARY_COLOR.main,
  display: 'block',
  overflowY: 'auto',
  overflowX: 'hidden',
  paddingBottom: '20px',
  width: '300px',
};

export default function Sidebar({ sidebarPanels }) {

  return (
    <aside
      style={STYLE}
      onKeyDown={event => event.stopPropagation()}
      onKeyUp={event => event.stopPropagation()}
      className="sidebar"
    >
      {(sidebarPanels || defaultPanels).filter(Boolean).map((Panel, i) => <Panel key={i} />)}
    </aside>
  );
}

Sidebar.propTypes = {
  sidebarPanels: PropTypes.arrayOf(PropTypes.elementType),
};
