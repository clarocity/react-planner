import React, { Component } from 'react';
import {defaultButtons} from './buttons';

import { ContextPropTypes, needsContext } from '../context';
import {StyleAlias} from '../../themekit';

export default @needsContext('toolbarButtons', 'styles') class Toolbar extends Component {

  static styles = {
    container: {
      backgroundColor: new StyleAlias('chrome.backgroundColor'),
      padding: '10px 0',
      width: '50px',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'flex-start',
      alignItems: 'center',
    }
  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  shouldComponentUpdate(nextProps /*, nextState */) {
    return this.props.toolbarButtons !== nextProps.toolbarButtons;
  }

  render() {

    const { styles, toolbarButtons } = this.props;

    return (
      <aside style={styles.container}>
        {(toolbarButtons || defaultButtons).filter(Boolean).map((Button, i) => <Button key={i} />)}
      </aside>
    )
  }
}


Toolbar.propTypes = {
  toolbarButtons: ContextPropTypes.toolbarButtons,
  styles: ContextPropTypes.styles,
};
