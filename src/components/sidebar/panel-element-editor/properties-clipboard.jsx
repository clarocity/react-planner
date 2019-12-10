import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {MdContentCopy, MdContentPaste} from 'react-icons/md';
import { ContextPropTypes, needsContext } from '../../context';

export default
@needsContext('styles', 'translator', 'actions', 'state')
class PropertiesClipboard extends Component {

  static styles = {
    root: {
      padding: '0.7em 0.25em',
      display: 'flex',
      justifyContent: 'flex-end',
      alignItems: 'center',
    },

    button: {
      cursor:'pointer',
      fontSize:'1.4em',
      marginLeft: '0.5em',
    }
  }

  shouldComponentUpdate(nextProps) {
    if(
      this.props.state.clipboardProperties.hashCode() !== nextProps.state.clipboardProperties.hashCode()
    ) return true;

    return false;
  }


  copyProperties = () => {
    this.props.actions.project.copyProperties( this.props.element.properties );
  }

  pasteProperties = () => {
    this.props.actions.project.pasteProperties();
  }

  render() {

    const { styles, state, translator} = this.props;
    const isPastable = state.get('clipboardProperties') && state.get('clipboardProperties').size || null;

    return (
      <div style={styles.root}>
        {isPastable &&
          <div title={translator.t('Paste')} style={styles.button} onClick={this.pasteProperties}><MdContentPaste /></div>
        }
        <div title={translator.t('Copy')} style={styles.button} onClick={this.copyProperties}><MdContentCopy /></div>
      </div>
    )
  }
}

PropertiesClipboard.propTypes = {
  element: PropTypes.object.isRequired,

  state: ContextPropTypes.state,
  styles: ContextPropTypes.styles,
  translator: ContextPropTypes.translator,
  actions: ContextPropTypes.actions
};
