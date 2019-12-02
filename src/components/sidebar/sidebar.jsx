import React from 'react';
import { defaultPanels } from './panels';

import { ContextPropTypes, needsLimitedContext } from '../context';
import {StyleAlias} from '../../themekit';

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
  sidebarPanels: ContextPropTypes.sidebarPanels,
  styles: ContextPropTypes.styles,
};

export default needsLimitedContext('sidebarPanels', 'styles')(Sidebar);
