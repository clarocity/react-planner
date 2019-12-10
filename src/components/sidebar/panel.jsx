import React, {Component} from 'react';
import PropTypes from 'prop-types';
import * as SharedStyle from '../../shared-style';
import { FaAngleDown, FaAngleUp } from 'react-icons/fa';
import { ContextPropTypes, needsContext } from '../context';
import {StyleAlias, BorderStyle} from '../../themekit';

export default
@needsContext('styles')
class Panel extends Component {

  static styles = {
    root: {
      borderTop: new BorderStyle({ color: '$sidebar.panel.borderTopColor'}),
      borderBottom: new BorderStyle({ color: '$sidebar.panel.borderBottomColor'}),
      userSelect: 'none',
    },

    title: {
      fontSize: '11px',
      color: new StyleAlias('sidebar.panel.textColor'),
      padding: '5px 15px 8px 15px',
      backgroundColor: new StyleAlias('sidebar.panel.backgroundColor'),
      textShadow: '-1px -1px 2px rgba(0, 0, 0, 1)',
      boxShadow: 'inset 0px -3px 19px 0px rgba(0,0,0,0.5)',
      margin: '0px',
      cursor: 'pointer',

      '#hover': {
        color: new StyleAlias('sidebar.panel.hoverColor'),
      },
    },

    content: {
      fontSize: '11px',
      color: new StyleAlias('sidebar.panel.textColor'),
      border: new BorderStyle({ color: '$sidebar.panel.borderTopColor'}),
      padding: '0px',
      backgroundColor: new StyleAlias('sidebar.panel.backgroundColor'),
      textShadow: '-1px -1px 2px rgba(0, 0, 0, 1)',
      boxShadow: 'inset 0px 3px 3px 0px rgba(0,0,0,0.5)',
      display: 'none',

      '#opened': {
        display: 'block',
      }
    },

    arrow: {
      float: 'right'
    }
  }

  constructor(props) {
    super(props);

    this.state = {
      opened: props.hasOwnProperty('opened') ? props.opened : false,
      hover: false
    };
  }

  toggleOpen() {
    this.setState({opened: !this.state.opened});
  }

  toggleHover() {
    this.setState({hover: !this.state.hover});
  }

  render() {

    let { styles, name, headComponents, children } = this.props;
    let { opened, hover } = this.state;

    return (
      <div style={styles.root}>
        <h3
          style={styles.compile('title', hover && '#hover')}
          onMouseEnter={() => this.toggleHover()}
          onMouseLeave={() => this.toggleHover()}
          onClick={() => this.toggleOpen()}
        >
          {name}
          {headComponents}
          {
            opened ?
              <FaAngleUp style={styles.arrow} /> :
              <FaAngleDown style={styles.arrow} />
          }
        </h3>

        <div style={styles.compile('content', opened && '#opened')}>
          {children}
        </div>
      </div>
    )
  }
}

Panel.propTypes = {
  children: PropTypes.node,
  name: PropTypes.string.isRequired,
  headComponents: PropTypes.array,
  opened: PropTypes.bool,

  styles: ContextPropTypes.styles,
};
