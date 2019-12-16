import React, {Component} from 'react';
import { ContextPropTypes, needsContext } from '../context';
import {StyleAlias} from '../../themekit';

export default
@needsContext('styles', 'state')
class Guides extends Component {

  static styles = {
    line: {
      stroke: new StyleAlias('grid.guide.color'),
      strokewidth:'2.5px'
    }
  }

  render () {
    const styles = this.props.styles;
    const scene = this.props.state.scene;
    let {width, height} = scene;
    const hori = scene.getIn(['guides','horizontal']).entrySeq();
    const vert = scene.getIn(['guides','vertical']).entrySeq();

    return (
      <g className="Guides">
        {hori.map( ([ hgKey, hgVal ]) =>
          <line id={'hGuide' + hgKey} key={hgKey} x1={0} y1={hgVal} x2={width} y2={hgVal} style={styles.line}/> )}

        {vert.map( ([ vgKey, vgVal ]) =>
          <line key={vgKey} x1={vgVal} y1={0} x2={vgVal} y2={height} style={styles.line}/> )}
      </g>
    );
  }
}

Guides.propTypes = {
  styles: ContextPropTypes.styles,
  state: ContextPropTypes.state,
};
