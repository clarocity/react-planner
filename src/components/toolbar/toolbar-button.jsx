import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ContextPropTypes, needsContext } from '../context';
import {StyleAlias} from '../../themekit';

export default
@needsContext('styles')
class ToolbarButton extends Component {

  static styles = {
    root: {
      width: '30px',
      height: '30px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: '3px',
      marginBottom: '3px',
      fontSize: '25px',
      position: 'relative',
      cursor: 'pointer',
    },

    content: {
      color: new StyleAlias('toolbar.color'),
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',

      '#active': {
        color: new StyleAlias('toolbar.activeColor'),
      },

      '#hover': {
        color: new StyleAlias('toolbar.hoverColor'),
      },

      '#alternate': {
        color: new StyleAlias('toolbar.altColor'),
      }
    },

    tooltip: {
      position: 'absolute',
      width: '140px',
      color: 'white',
      background: 'black',
      height: '30px',
      lineHeight: '30px',
      textAlign: 'center',
      visibility: 'visible',
      borderRadius: '6px',
      opacity: '0.8',
      left: '100%',
      top: '50%',
      marginTop: '-15px',
      marginLeft: '15px',
      zIndex: '999',
      fontSize: '12px',
    },

    tooltipPin: {
      position: 'absolute',
      top: '50%',
      right: '100%',
      marginTop: '-8px',
      width: '0',
      height: '0',
      borderRight: '8px solid #000000',
      borderTop: '8px solid transparent',
      borderBottom: '8px solid transparent',
    },
  }

  constructor(props) {
    super(props);
    this.state = { hover: false };
  }

  render() {
    const { styles, onClick, children, tooltip, active, alternate } = this.props;
    const { hover } = this.state;

    const CONTENT_STYLE = styles.compile('content',
      active && '#active',
      hover && '#hover',
      alternate && '#alternate',
    );

    return (
      <div style={styles.root}
        onMouseOver={() => this.setState({ hover: true })}
        onMouseOut={() => this.setState({ hover: false })}>
        <div style={CONTENT_STYLE} onClick={onClick}>
          {children}
        </div>

        {
          hover ?
          <div style={styles.tooltip}>
            <span style={styles.tooltipPin} />
            {tooltip}
          </div>
          : null
        }

      </div>
    )
  }
}

ToolbarButton.propTypes = {
  children: PropTypes.node,
  active: PropTypes.bool.isRequired,
  alternate: PropTypes.bool,
  tooltip: PropTypes.string.isRequired,
  onClick: PropTypes.func.isRequired,

  styles: ContextPropTypes.styles,
};
