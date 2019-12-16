import React from 'react';
import { defaultPanels } from './panels';

import { ContextPropTypes, needsContext } from '../context';
import {StyleAlias, BorderStyle} from '../../themekit';

class Sidebar extends React.PureComponent {
  render () {
    const { styles, sidebarPanels } = this.props;
    return (
      <aside
        style={styles.root}
        onKeyDown={event => event.stopPropagation()}
        onKeyUp={event => event.stopPropagation()}
        className="sidebar"
      >
        <div style={styles.container}>
          {(sidebarPanels || defaultPanels).filter(Boolean).map((Panel, i) => <Panel key={i} />)}
        </div>
      </aside>
    );
  }
}

Sidebar.styles = {
  root: {
    backgroundColor: new StyleAlias('chrome.backgroundColor'),
    borderLeft: new BorderStyle({color: '$sidebar.borderColor'}),
    display: 'block',
    position: 'relative',
    width: '300px',
  },

  container: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    overflowY: 'auto',
    overflowX: 'hidden',
  }
}

Sidebar.propTypes = {
  sidebarPanels: ContextPropTypes.sidebarPanels,
  styles: ContextPropTypes.styles,
};

export default needsContext('sidebarPanels', 'styles')(Sidebar);
