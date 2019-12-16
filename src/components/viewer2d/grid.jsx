import React, {Component} from 'react';
import { ContextPropTypes, needsContext } from '../context';
import {get, propCompare} from '../../utils';

export default
@needsContext('themekit', 'state')
class Grid extends Component {

  shouldComponentUpdate(nextProps) {
    return this.props.state.scene.grids.hashCode() !== nextProps.state.scene.grids.hashCode() ||
      propCompare(this.props, nextProps, [ 'state.scene.width', 'state.scene.height']);
  }

  renderVertical (gridID, grid) {
    const {width, height} = this.props.state.scene;

    const step = grid.step;
    const colors = this.computeColors(grid)

    let rendered = [];
    let i = 0;
    for (let x = 0; x <= width; x += step) {
      let color = colors[i % colors.length];
      i++;
      rendered.push(<line key={x} x1={x} y1="0" x2={x} y2={height} strokeWidth="1" stroke={color}/>);
    }

    return (<g key={gridID}>{rendered}</g>);
  }

  renderHorizontal (gridID, grid) {
    const {width, height} = this.props.state.scene;

    const step = grid.step;
    const colors = this.computeColors(grid)

    let rendered = [];
    let i = 0;
    for (let y = 0; y <= height; y += step) {
      let color = colors[i % colors.length];
      i++;
      rendered.push(<line key={y} x1="0" y1={y} x2={width} y2={y} strokeWidth="1" stroke={color}/>);
    }

    return (<g key={gridID}>{rendered}</g>);
  }

  computeColors (grid) {
    const {themekit} = this.props;

    const colors = get(grid, 'properties.colors', [0]).map((c) => {
      if (typeof c === 'string') return c;
      if (typeof c !== 'number') return null;
      return themekit.resolve(['grid', 'lines', c]);
    });

    return colors;
  }

  render () {
    let renderedGrids = this.props.state.scene.grids.entrySeq().map(([gridID, grid]) => {
      switch (grid.type) {
        case 'horizontal-streak':
          return this.renderHorizontal(gridID, grid.toJS());

        case 'vertical-streak':
          return this.renderVertical(gridID, grid.toJS());

        default:
          console.warn(`grid ${grid.type} not allowed`);
      }
    }).toList();

    return <g className='Grid'>{renderedGrids}</g>;
  }
}

Grid.propTypes = {
  themekit: ContextPropTypes.themekit,
  state: ContextPropTypes.state,
};
