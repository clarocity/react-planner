import React from 'react';
import PropTypes from 'prop-types';
import * as Geometry from '../../utils/geometry';
import Ruler from './ruler';
import { ContextPropTypes, needsContext } from '../context';

function Line({line, layer, state, catalog, themekit}) {
  const {scene} = state;

  let vertex0 = layer.vertices.get(line.vertices.get(0));
  let vertex1 = layer.vertices.get(line.vertices.get(1));

  if (vertex0.id === vertex1.id || Geometry.samePoints(vertex0, vertex1)) return null; //avoid 0-length lines

  let {x: x1, y: y1} = vertex0;
  let {x: x2, y: y2} = vertex1;

  if (x1 > x2) {
    ({x: x1, y: y1} = vertex1);
    ({x: x2, y: y2} = vertex0);
  }

  let length = Geometry.pointsDistance(x1, y1, x2, y2);
  let angle = Geometry.angleBetweenTwoPointsAndOrigin(x1, y1, x2, y2);

  let renderedHoles = line.holes.map(holeID => {
    let hole = layer.holes.get(holeID);
    let startAt = length * hole.offset;
    const CatalogHole = catalog.getElement(hole.type).render2D;

    return (
      <g
        key={holeID}
        transform={`translate(${startAt}, 0)`}
        data-element-root
        data-prototype={hole.prototype}
        data-id={hole.id}
        data-selected={hole.selected}
        data-layer={layer.id}
      >
        <CatalogHole element={hole} layer={layer} scene={scene} themekit={themekit}/>
      </g>
    );
  });

  let thickness = line.getIn(['properties', 'thickness', 'length']);
  let half_thickness = thickness / 2;

  let CatalogLine = catalog.getElement(line.type).render2D

  return (
    <g
      transform={`translate(${x1}, ${y1}) rotate(${angle}, 0, 0)`}
      data-element-root
      data-prototype={line.prototype}
      data-id={line.id}
      data-selected={line.selected}
      data-layer={layer.id}
      style={line.selected ? {cursor: themekit.resolve('cursors.move')} : {}}
    >
      {line.selected &&
        <Ruler
          unit={scene.unit}
          length={length}
          transform={`translate(0, ${half_thickness + 10} )`}
          themekit={themekit}
        />
      }
      <CatalogLine element={line} layer={layer} scene={scene} themekit={themekit} />
      {renderedHoles}
    </g>
  );

}

Line.propTypes = {
  line: PropTypes.object.isRequired,
  layer: PropTypes.object.isRequired,

  catalog: ContextPropTypes.catalog,
  themekit: ContextPropTypes.themekit,
  state: ContextPropTypes.state,
};

export default needsContext('themekit', 'state', 'catalog')(Line);
