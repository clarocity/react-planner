import React, {Component} from 'react';
import PropTypes from 'prop-types';
import * as SharedStyle from '../../shared-style';
import { FaAngleDown, FaAngleRight } from 'react-icons/fa';
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
      height: '26px',
      fontSize: '11px',
      color: new StyleAlias('sidebar.panel.textColor'),
      padding: '0px 15px 1px',
      backgroundColor: new StyleAlias('sidebar.panel.backgroundColor'),
      textShadow: '-1px -1px 2px rgba(0, 0, 0, 0.7)',
      boxShadow: 'inset 0px 3px 3px 0px rgba(0,0,0,0.5)',
      margin: '0px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',

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
      textShadow: '-1px -1px 2px rgba(0, 0, 0, 0.7)',
      boxShadow: 'inset 0px 3px 3px 0px rgba(0,0,0,0.5)',
      display: 'none',

      '#opened': {
        display: 'block',
      }
    },
  }

  constructor(props) {
    super(props);

    this.state = {
      opened: !!props.opened,
      hover: false
    };
  }

  componentDidMount () {
    this.setState({opened: !!this.props.opened});
  }

  onToggleOpen = () => {
    this.setState({opened: !this.state.opened});
  }

  onMouseEnter = () => {
    this.setState({hover: true});
  }

  onMouseLeave = () => {
    this.setState({hover: false});
  }

  render() {

    let { styles, name, children, inlineStyle } = this.props;
    let { opened, hover } = this.state;

    return (
      <div style={styles.root}>
        <h3
          style={styles.compile('title', hover && '#hover')}
          onMouseEnter={this.onMouseEnter}
          onMouseLeave={this.onMouseLeave}
          onClick={this.onToggleOpen}
        >
          <span style={{flexGrow: 1}}>{name}</span>
          {opened ? <FaAngleDown /> : <FaAngleRight />}
        </h3>

        <div style={styles.compile('content', opened && '#opened', inlineStyle)}>
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
  inlineStyle: PropTypes.object,

  styles: ContextPropTypes.styles,
};
