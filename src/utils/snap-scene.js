import {
  SNAP_POINT,
  SNAP_LINE,
  SNAP_SEGMENT,
  SNAP_GRID,
  SNAP_GUIDE,
  addPointSnap,
  addLineSnap,
  addLineSegmentSnap,
  addGridSnap
} from './snap';
import * as Geometry from './geometry';
import { Map, List } from 'immutable';

export function sceneSnapElements(scene, snapElements = new List(), snapMask = new Map()) {

  let { width, height } = scene;

  let a, b, c;
  return snapElements.withMutations(snapElements => {
    scene.layers.forEach(layer => {

      let { lines, vertices } = layer;

      vertices.forEach(({ id: vertexID, x, y }) => {

        if (snapMask.get(SNAP_POINT)) {
          addPointSnap(snapElements, x, y, 10, 10, vertexID);
        }

        if (snapMask.get(SNAP_LINE)) {
          ({ a, b, c } = Geometry.horizontalLine(y));
          addLineSnap(snapElements, a, b, c, 10, 1, vertexID);
          ({ a, b, c } = Geometry.verticalLine(x));
          addLineSnap(snapElements, a, b, c, 10, 1, vertexID);
        }

      });

      if (snapMask.get(SNAP_SEGMENT)) {
        lines.forEach(({ id: lineID, vertices: [v0, v1] }) => {
          let { x: x1, y: y1 } = vertices.get(v0);
          let { x: x2, y: y2 } = vertices.get(v1);

          addLineSegmentSnap(snapElements, x1, y1, x2, y2, 20, 1, lineID);
        });
      }

    });

    if (snapMask.get(SNAP_GRID)) {
      const hori = scene.grids.valueSeq().filter((g) => g.type == 'horizontal-streak').map((g) => steps(g, height));
      const vert = scene.grids.valueSeq().filter((g) => g.type == 'vertical-streak').map((g) => steps(g, width));

      const stepSort = ([ a ], [ b ]) => a > b;
      const Xs = [].concat(...hori).sort(stepSort);
      const Ys = [].concat(...vert).sort(stepSort);

      Xs.forEach(([ x, xMajor ]) => {
        Ys.forEach(([ y, yMajor ]) => {
          addGridSnap(snapElements, x, y, 10, xMajor && yMajor ? 15 : 10, null);
        });
      });

    }

    if (snapMask.get(SNAP_GUIDE)) {

      let horizontal = scene.getIn(['guides', 'horizontal']);
      let vertical = scene.getIn(['guides', 'vertical']);

      let hValues = horizontal.valueSeq();
      let vValues = vertical.valueSeq();

      hValues.forEach(hVal => {
        vValues.forEach(vVal => {
          addPointSnap(snapElements, vVal, hVal, 10, 10);
        });
      });

      hValues.forEach(hVal => addLineSegmentSnap(snapElements, 0, hVal, width, hVal, 20, 1));
      vValues.forEach(vVal => addLineSegmentSnap(snapElements, vVal, 0, vVal, height, 20, 1));

    }

  })
}

function steps ({ step, majorStep }, end) {
  const len = Math.floor(end / step) + 1
  return Array(len).fill().map((_, idx) => {
    const i = idx * step;
    const major = !(i % majorStep);
    return [ i, major ];
  })
}
