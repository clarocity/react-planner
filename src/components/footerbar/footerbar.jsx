import React, { Component } from 'react';
import PropTypes from 'prop-types';
import If from '../../utils/react-if';
import FooterToggleButton from './footer-toggle-button';
import FooterWarnings from './footer-warnings';
import { SNAP_POINT, SNAP_LINE, SNAP_SEGMENT, SNAP_GRID, SNAP_GUIDE } from '../../utils/snap';
import { MODE_SNAPPING } from '../../constants';
import { ContextPropTypes, needsContext } from '../context';
import { VERSION } from '../../version';

import {StyleAlias, BorderStyle} from '../../themekit';

export default
@needsContext('translator', 'styles', 'state', 'actions')
class FooterBar extends Component {

  static styles = {
    container: {
      height: new StyleAlias('footer.textColor', '20px'),
      lineHeight: '14px',
      fontSize: '12px',
      color: new StyleAlias('footer.textColor', 'white'),
      backgroundColor: new StyleAlias('footer.backgroundColor'),
      padding: '3px 1em',
      margin: 0,
      boxSizing: 'border-box',
      cursor: 'default',
      userSelect: 'none',
      zIndex: '9001',
      display: 'flex',
      flexDirection: 'row',
    },

    section: {
      display: 'flex',
      flexGrow: 0,
      flexShrink: 1,
      padding: '0 1em',
      borderRight: new BorderStyle({ color: '$footer.dividerColor' }),
    },

    'section#fill': {
      flexGrow: 1,
    },

    appMessage: {
      borderBottom: new BorderStyle({ color: '$footer.borderColor' }),
      lineHeight: '1.5em',
    },

    coordinate: {
      width: '6em',
      margin: '0 3px',
    },

  }

  constructor(props) {
    super(props);
    this.state = {};
    this.updateSnapMask.SNAP_POINT = {
      on: () => this.updateSnapMask({ SNAP_POINT: true }),
      off: () => this.updateSnapMask({ SNAP_POINT: false }),
    };
    this.updateSnapMask.SNAP_LINE = {
      on: () => this.updateSnapMask({ SNAP_LINE: true }),
      off: () => this.updateSnapMask({ SNAP_LINE: false }),
    };
    this.updateSnapMask.SNAP_SEGMENT = {
      on: () => this.updateSnapMask({ SNAP_SEGMENT: true }),
      off: () => this.updateSnapMask({ SNAP_SEGMENT: false }),
    };
    this.updateSnapMask.SNAP_GRID = {
      on: () => this.updateSnapMask({ SNAP_GRID: true }),
      off: () => this.updateSnapMask({ SNAP_GRID: false }),
    };
    this.updateSnapMask.SNAP_GUIDE = {
      on: () => this.updateSnapMask({ SNAP_GUIDE: true }),
      off: () => this.updateSnapMask({ SNAP_GUIDE: false }),
    };
  }

  updateSnapMask (val) {
    this.props.actions.project.toggleSnap(this.props.state.snapMask.merge(val));
  }

  render() {
    let { state, translator, styles } = this.props;
    let { x, y } = state.get('mouse').toJS();
    let zoom = state.get('zoom');
    let mode = state.get('mode');

    return (
      <div style={styles.container}>

        <If condition={MODE_SNAPPING.includes(mode)}>
          <div style={{ ...styles.section, paddingLeft: 0 }}>
            <div title={translator.t('Mouse X Coordinate')} style={styles.coordinate}>X : {x.toFixed(3)}</div>
            <div title={translator.t('Mouse Y Coordinate')} style={styles.coordinate}>Y : {y.toFixed(3)}</div>
          </div>

          <div style={styles.section} title={translator.t('Scene Zoom Level')}>Zoom: {zoom.toFixed(3)}X</div>

          <div style={styles.section}>
            <FooterToggleButton
              toggleOn={this.updateSnapMask.SNAP_POINT.on}
              toggleOff={this.updateSnapMask.SNAP_POINT.off}
              text="Snap PT"
              toggleState={state.snapMask.get(SNAP_POINT)}
              title={translator.t('Snap to Point')}
            />
            <FooterToggleButton
              toggleOn={this.updateSnapMask.SNAP_LINE.on}
              toggleOff={this.updateSnapMask.SNAP_LINE.off}
              text="Snap LN"
              toggleState={state.snapMask.get(SNAP_LINE)}
              title={translator.t('Snap to Line')}
            />
            <FooterToggleButton
              toggleOn={this.updateSnapMask.SNAP_SEGMENT.on}
              toggleOff={this.updateSnapMask.SNAP_SEGMENT.off}
              text="Snap SEG"
              toggleState={state.snapMask.get(SNAP_SEGMENT)}
              title={translator.t('Snap to Segment')}
            />
            <FooterToggleButton
              toggleOn={this.updateSnapMask.SNAP_GRID.on}
              toggleOff={this.updateSnapMask.SNAP_GRID.off}
              text="Snap GRD"
              toggleState={state.snapMask.get(SNAP_GRID)}
              title={translator.t('Snap to Grid')}
            />
            <FooterToggleButton
              toggleOn={this.updateSnapMask.SNAP_GUIDE.on}
              toggleOff={this.updateSnapMask.SNAP_GUIDE.off}
              text="Snap GDE"
              toggleState={state.snapMask.get(SNAP_GUIDE)}
              title={translator.t('Snap to Guide')}
            />
          </div>
        </If>

        <div style={{ ...styles.section, ...styles['section#fill'] }}>
          {this.props.footerbarComponents.map((Component, index) => <Component state={state} key={index} />)}
        </div>

        <div style={styles.section}>
          <FooterWarnings state={state} />
        </div>

        {
          this.props.softwareSignature ?
            <div
              style={{ ...styles.section, borderRight: null }}
              title={this.props.softwareSignature + (this.props.softwareSignature.includes('React-Planner') ? '' : ` using React-Planner ${VERSION}`)}
            >
              {this.props.softwareSignature}
            </div>
            : null
        }

      </div>
    );
  }
}

FooterBar.propTypes = {
  footerbarComponents: PropTypes.array.isRequired,
  softwareSignature: PropTypes.string,

  state: ContextPropTypes.state,
  actions: ContextPropTypes.actions,
  translator: ContextPropTypes.translator,
  styles: ContextPropTypes.styles,
};
