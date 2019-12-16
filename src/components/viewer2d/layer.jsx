import React from 'react';
import PropTypes from 'prop-types';
import {
  Line,
  Area,
  Vertex,
  Item,
  Group
} from './export';

export default function Layer({ layer, scene }) {

  let { lines, areas, vertices, id: layerID, items, opacity, visible } = layer;

  if (!visible) opacity = Math.min(opacity, 0.35);

  return (
    <g opacity={opacity}>
      {
        areas.valueSeq().map(area =>
          <Area key={area.id} layer={layer} area={area} unit={scene.unit} />)
      }
      {
        lines.valueSeq().map(line =>
          <Line key={line.id} layer={layer} line={line} />)
      }
      {
        items.valueSeq().map(item =>
          <Item key={item.id} layer={layer} item={item} />)
      }
      {
        vertices
          .valueSeq()
          .filter(v => v.selected)
          .map(vertex => <Vertex key={vertex.id} layer={layer} vertex={vertex} />)
      }
      {
        scene.groups
          .valueSeq()
          .filter(g => g.hasIn(['elements', layerID]) && g.get('selected'))
          .map(group => <Group key={group.get('id')} layer={layer} group={group} />)
      }
    </g>
  );

}

Layer.propTypes = {
  layer: PropTypes.object.isRequired,
  scene: PropTypes.object.isRequired,
};
