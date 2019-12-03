import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { ContextPropTypes, needsContext } from '../context';
import {StyleAlias, BorderStyle} from '../../themekit';

export default @needsContext('styles') class FooterToggleButton extends Component {

  static styles = {
    root: {
      width: '5.5em',
      color: new StyleAlias('footer.textColor'),
      textAlign: 'center',
      cursor: 'pointer',
      userSelect: 'none',
      border: '1px solid transparent',
      margin: '-1px 5px 0 5px',
      borderRadius: '2px',
      display: 'inline-block',
      '#active': {
        backgroundColor: new StyleAlias('footer.activeBackgroundColor'),
        border: new BorderStyle({ color: '$footer.borderColor' }),
        color: new StyleAlias('footer.activeTextColor'),
      },

      '#hover': {
        border: new BorderStyle({ color: '$footer.activeBorderColor'}),
      },
    },

  }

  constructor(props) {
    super(props);

    this.state = {
      over: false,
    };
  }

  toggleOver = () => { this.setState({ over: true }); }
  toggleOut= () => { this.setState({ over: false }); }
  toggle = () => {
    if (this.props.toggleState) {
      this.props.toggleOff();
    } else {
      this.props.toggleOn();
    }
  }

  shouldComponentUpdate(nextProps, nextState) {
    if( this.state.over != nextState.over ) return true;
    if( this.props.toggleState != nextProps.toggleState ) return true;

    return false;
  }

  render() {

    const { styles, toggleState, text, title } = this.props;
    const { over } = this.state;

    return (
      <div
        style={styles.compile('root', toggleState && '#active', over && '#hover')}
        onMouseOver={this.toggleOver}
        onMouseOut={this.toggleOut}
        onClick={this.toggle}
        title={title}
      >
        {text}
      </div>
    );
  }
}

FooterToggleButton.propTypes = {
  styles: ContextPropTypes.styles,

  toggleOn: PropTypes.func.isRequired,
  toggleOff: PropTypes.func.isRequired,
  text: PropTypes.string.isRequired,
  toggleState: PropTypes.bool,
  title: PropTypes.string
};
