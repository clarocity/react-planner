import React from 'react';
import PropTypes from 'prop-types';
import { defaultPanels } from './panels';

import {themed, StyleAlias} from '../../themekit';

class Sidebar extends React.PureComponent {
  render () {
    const { styles, sidebarPanels } = this.props;
    return (
      <aside
        style={styles.container}
        onKeyDown={event => event.stopPropagation()}
        onKeyUp={event => event.stopPropagation()}
        className="sidebar"
      >
        {(sidebarPanels || defaultPanels).filter(Boolean).map((Panel, i) => <Panel key={i} />)}
      </aside>
    );
  }
}

Sidebar.styles = {
  container: {
    backgroundColor: new StyleAlias('chrome.backgroundColor'),
    display: 'block',
    overflowY: 'auto',
    overflowX: 'hidden',
    paddingBottom: '20px',
    width: '300px',
  }
}

Sidebar.propTypes = {
  sidebarPanels: PropTypes.arrayOf(PropTypes.elementType),
  styles: PropTypes.object,
};

export default themed(Sidebar);
