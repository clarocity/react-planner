import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {defaultButtons} from './buttons';
import * as SharedStyle from '../../shared-style';
import { ContextPropTypes, needsContext } from '../context';

export default @needsContext class Toolbar extends Component {

  constructor(props) {
    super(props);
    this.state = {};
  }

  shouldComponentUpdate(nextProps /*, nextState */) {
    return this.props.state.mode !== nextProps.state.mode ||
      this.props.height !== nextProps.height ||
      this.props.width !== nextProps.width ||
      this.props.state.alterate !== nextProps.state.alterate;
  }

  render() {

    const { width, height, toolbarButtons } = this.props;

    const style = {
      backgroundColor: SharedStyle.PRIMARY_COLOR.main,
      padding: '10px',
      maxWidth: width,
      maxHeight: height,
    }

    return (
      <aside style={style} className='toolbar'>
        {(toolbarButtons || defaultButtons).filter(Boolean).map((Button, i) => <Button key={i} />)}
      </aside>
    )
  }
}

Toolbar.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  toolbarButtons: PropTypes.arrayOf(PropTypes.elementType),

  ...ContextPropTypes,
};
