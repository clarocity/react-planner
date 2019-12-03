import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {FaTimes as IconClose} from 'react-icons/fa';

import { ContextPropTypes, needsContext } from '../context';
import {StyleAlias, BorderStyle} from '../../themekit';

export default @needsContext('styles') class FooterContentButton extends Component {

  static styles = {
    container: {
      margin:0,
      padding:'0px 5px 0px 0px',
    },

    toggleButton: {
      color: new StyleAlias('footer.textColor'),
      textAlign: 'center',
      cursor: 'pointer',
      userSelect: 'none',
      display: 'flex',
      alignItems: 'center',
    },

    'toggleButton#hover': {
      color: new StyleAlias('footer.activeTextColor'),
    },

    'toggleButton#active': {
      color: new StyleAlias('footer.activeTextColor'),
    },

    content: {
      position:'absolute',
      width:'calc( 100% - 2px )',
      left:0,
      bottom:20,
      backgroundColor: new StyleAlias('chrome.backgroundColor'),
      borderTop: new BorderStyle({ color: '$footer.borderColor' }),
      zIndex:10000,
      padding:0,
      margin:0,
      transition:'all 300ms ease',
      visibility:'hidden',
      opacity: 0,
      height:0,

      '#active': {
        height: '40%',
        opacity: 1,
        visibility:'visible',
      },
    },

    contentHeader: {
      position:'relative',
      width:'100%',
      height:'2em',
      top:0,
      left:0,
      borderBottom: new BorderStyle({ color: '$footer.borderColor' }),
    },

    contentTitle: {
      position:'relative',
      height:'2em',
      lineHeight:'2em',
      marginLeft:'1em',
    },

    contentArea: {
      position:'relative',
      width:'100%',
      height:'calc( 100% - 2em )',
      padding:'1em',
      overflowY:'auto',
    },

    contentClose: {
      position:'absolute',
      width:'2em',
      height:'2em',
      right:0,
      top:0,
      padding:'0.5em',
      borderLeft: new BorderStyle({ color: '$footer.borderColor' }),
      cursor:'pointer',

      '#hover': {
        color: new StyleAlias('footer.activeTextColor'),
        backgroundColor: new StyleAlias('footer.alternateBackgroundColor'),
      },
    },

    icon: {
      width:'15px',
      height:'15px',
    },

    label: {}
  }

  constructor(props) {
    super(props);

    this.state = {
      over: false,
      closeOver: false,
      active: false
    };
  }

  toggleOver = () => { this.setState({ over: true }); }
  toggleOut  = () => { this.setState({ over: false }); }
  closeOver  = () => { this.setState({ closeOver: true }); }
  closeOut   = () => { this.setState({ closeOver: false }); }
  toggle = () => {
    let isActive = !this.state.active;
    this.setState({ active: isActive });
  }

  shouldComponentUpdate(nextProps, nextState) {
    if( this.state.over != nextState.over ) return true;
    if( this.state.closeOver != nextState.closeOver ) return true;
    if( this.state.active != nextState.active ) return true;

    if( this.props.content.length != nextProps.content.length ) return true;

    return false;
  }

  render() {

    const { active, over, closeOver } = this.state;
    const { styles, title, text, content } = this.props;

    let LabelIcon = this.props.icon || null;

    return (
      <div style={styles.compile('container')}>
        <div
          style={styles.compile('toggleButton', over && '#over', active && '#active')}
          onClick={this.toggle}
          title={title}
        >
          <LabelIcon style={styles.compile('icon', this.props.iconStyle)}/>
          <span style={styles.compile('label', this.props.textStyle)}>{text}</span>
        </div>
        <div style={styles.compile('content', active && '#active')}>
          <div style={styles.compile('contentHeader')}>
            <b style={styles.compile('contentTitle', this.props.titleStyle)}>{title}</b>
            <IconClose
              style={styles.compile('contentClose', closeOver && '#hover')}
              onMouseOver={this.closeOver}
              onMouseOut={this.closeOut}
              onClick={this.toggle}
            />
          </div>
          <div style={styles.compile('contentArea')}>
            {content}
          </div>
        </div>
      </div>
    );
  }
}

FooterContentButton.propTypes = {
  styles: ContextPropTypes.styles,

  text: PropTypes.string.isRequired,
  textStyle: PropTypes.object,
  icon: PropTypes.func,
  iconStyle: PropTypes.object,
  content: PropTypes.array.isRequired,
  title: PropTypes.string,
  titleStyle: PropTypes.object
};
