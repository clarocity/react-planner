import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import FooterContentButton from './footer-content-button';
import { MdWarning } from 'react-icons/md';
import { IoMdCloseCircle } from 'react-icons/io';

import { needsContext } from '../context';
import {StyleAlias} from '../../themekit';

export default @needsContext('styles') class FooterWarnings extends Component {

  static styles = {

    error: {
      label: {},
      icon: {}
    },

    'error#active': {
      label: {
        color: new StyleAlias('footer.error'),
      },
      icon: {
        color: new StyleAlias('footer.error'),
      }
    },

    warning: {
      label: {},
      icon: {},
    },

    'warning#active': {
      label: {
        color: new StyleAlias('footer.warning'),
      },
      icon: {
        color: new StyleAlias('footer.warning'),
      }
    },

  }

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let { state, styles } = this.props;

    let errors = state.get('errors').toArray();
    let errorsJsx = errors.map((err, ind) =>
      <div key={ind} style={styles.appMessage}>[ {(new Date(err.date)).toLocaleString()} ] {err.error}</div>
    );

    let warnings = state.get('warnings').toArray();
    let warningsJsx = warnings.map((warn, ind) =>
      <div key={ind} style={styles.appMessage}>[ {(new Date(warn.date)).toLocaleString()} ] {warn.warning}</div>
    );

    const errorStyle = styles.compile('error', errors.length && '#active');
    const warningStyle = styles.compile('warning', warnings.length && '#active');

    return (
      <Fragment>
        <FooterContentButton
          state={this.state}
          icon={IoMdCloseCircle}
          iconStyle={errorStyle.icon}
          text={errors.length.toString()}
          textStyle={errorStyle.label}
          title={`Errors [ ${errors.length} ]`}
          titleStyle={errorStyle.label}
          content={[errorsJsx]}
        />
        <FooterContentButton
          state={this.state}
          icon={MdWarning}
          iconStyle={warningStyle.icon}
          text={warnings.length.toString()}
          textStyle={warningStyle.label}
          title={`Warnings [ ${warnings.length} ]`}
          titleStyle={warningStyle.label}
          content={[warningsJsx]}
        />
      </Fragment>
    );
  }
}

FooterWarnings.propTypes = {
  state: PropTypes.object,
  styles: PropTypes.object,
};
