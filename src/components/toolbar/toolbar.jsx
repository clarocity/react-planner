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
      this.props.state.alternate !== nextProps.state.alternate;
  }

  render() {

    const { toolbarButtons } = this.props;

    const style = {
      backgroundColor: SharedStyle.PRIMARY_COLOR.main,
      padding: '10px',
      width: '50px',
    }

    return (
      <aside style={style} className='toolbar'>
        {(toolbarButtons || defaultButtons).filter(Boolean).map((Button, i) => <Button key={i} />)}
      </aside>
    )
  }
}

Toolbar.propTypes = {
  toolbarButtons: PropTypes.arrayOf(PropTypes.elementType),

  ...ContextPropTypes,
};
