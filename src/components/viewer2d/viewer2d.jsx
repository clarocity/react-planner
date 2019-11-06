import React, {Fragment} from 'react';
import PropTypes from 'prop-types';
import ContainerDimensions from 'react-container-dimensions';

import { ReactSVGPanZoom, TOOL_NONE, TOOL_PAN, TOOL_ZOOM_IN, TOOL_ZOOM_OUT, TOOL_AUTO } from 'react-svg-pan-zoom';
import * as constants from '../../constants';
import State from './state';
import * as SharedStyle from '../../shared-style';
import { RulerX, RulerY } from './export';
import { ContextPropTypes, needsContext } from '../context';

function mode2Tool(mode) {
  switch (mode) {
    case constants.MODE_2D_PAN:
      return TOOL_PAN;
    case constants.MODE_2D_ZOOM_IN:
      return TOOL_ZOOM_IN;
    case constants.MODE_2D_ZOOM_OUT:
      return TOOL_ZOOM_OUT;
    case constants.MODE_IDLE:
      return TOOL_AUTO;
    default:
      return TOOL_NONE;
  }
}

function mode2Cursor({ mode, alternate }) {
  switch (mode) {
    case constants.MODE_DRAGGING_HOLE:
    case constants.MODE_DRAGGING_LINE:
    case constants.MODE_DRAGGING_VERTEX:
    case constants.MODE_DRAGGING_ITEM:
      if (alternate) return { cursor: SharedStyle.CURSORS.crosshairAdd };
      return { cursor: SharedStyle.CURSORS.move };

    case constants.MODE_ROTATING_ITEM:
      return { cursor: SharedStyle.CURSORS.rotate };

    case constants.MODE_WAITING_DRAWING_LINE:
    case constants.MODE_DRAWING_LINE:
      if (alternate) return { cursor: SharedStyle.CURSORS.crosshairAdd };
      return { cursor: SharedStyle.CURSORS.crosshair };
    default:
      return { cursor: SharedStyle.CURSORS.default };
  }
}

function mode2DetectAutopan(mode) {
  switch (mode) {
    case constants.MODE_DRAWING_LINE:
    case constants.MODE_DRAGGING_LINE:
    case constants.MODE_DRAGGING_VERTEX:
    case constants.MODE_DRAGGING_HOLE:
    case constants.MODE_DRAGGING_ITEM:
    case constants.MODE_DRAWING_HOLE:
    case constants.MODE_DRAWING_ITEM:
      return true;

    default:
      return false;
  }
}

function extractElementData(node) {
  while (!node.attributes.getNamedItem('data-element-root') && node.tagName !== 'svg') {
    node = node.parentNode;
  }
  if (node.tagName === 'svg') return null;

  return {
    part: node.attributes.getNamedItem('data-part') ? node.attributes.getNamedItem('data-part').value : undefined,
    layer: node.attributes.getNamedItem('data-layer').value,
    prototype: node.attributes.getNamedItem('data-prototype').value,
    selected: node.attributes.getNamedItem('data-selected').value === 'true',
    id: node.attributes.getNamedItem('data-id').value
  }
}

function Viewer2D({ state, catalog, actions }) {

  let { viewer2D, mode, scene } = state;

  let layerID = scene.selectedLayer;

  let mapCursorPosition = ({ x, y }) => {
    return { x, y: -y + scene.height }
  };

  let onMouseMove = (viewerEvent) => {

    //workaround that allow imageful component to work
    let evt = new Event('mousemove-planner-event');
    evt.viewerEvent = viewerEvent;
    document.dispatchEvent(evt);

    let { x, y } = mapCursorPosition(viewerEvent);

    actions.project.updateMouseCoord({ x, y });

    switch (mode) {
      case constants.MODE_DRAWING_LINE:
        actions.lines.updateDrawingLine(x, y, state.snapMask);
        break;

      case constants.MODE_DRAWING_HOLE:
        actions.holes.updateDrawingHole(layerID, x, y);
        break;

      case constants.MODE_DRAWING_ITEM:
        actions.items.updateDrawingItem(layerID, x, y);
        break;

      case constants.MODE_DRAGGING_HOLE:
        actions.holes.updateDraggingHole(x, y);
        break;

      case constants.MODE_DRAGGING_LINE:
        actions.lines.updateDraggingLine(x, y, state.snapMask);
        break;

      case constants.MODE_DRAGGING_VERTEX:
        actions.vertices.updateDraggingVertex(x, y, state.snapMask);
        break;

      case constants.MODE_DRAGGING_ITEM:
        actions.items.updateDraggingItem(x, y);
        break;

      case constants.MODE_ROTATING_ITEM:
        actions.items.updateRotatingItem(x, y);
        break;
    }

    viewerEvent.originalEvent.stopPropagation();
  };

  let onMouseDown = viewerEvent => {
    let event = viewerEvent.originalEvent;

    //workaround that allow imageful component to work
    let evt = new Event('mousedown-planner-event');
    evt.viewerEvent = viewerEvent;
    document.dispatchEvent(evt);

    let { x, y } = mapCursorPosition(viewerEvent);

    if (mode === constants.MODE_IDLE) {
      let elementData = extractElementData(event.target);
      if (!elementData || !elementData.selected) return;

      switch (elementData.prototype) {
        case 'lines':
          actions.lines.beginDraggingLine(elementData.layer, elementData.id, x, y, state.snapMask);
          break;

        case 'vertices':
          actions.vertices.beginDraggingVertex(elementData.layer, elementData.id, x, y, state.snapMask);
          break;

        case 'items':
          if (elementData.part === 'rotation-anchor')
            actions.items.beginRotatingItem(elementData.layer, elementData.id, x, y);
          else
            actions.items.beginDraggingItem(elementData.layer, elementData.id, x, y);
          break;

        case 'holes':
          actions.holes.beginDraggingHole(elementData.layer, elementData.id, x, y);
          break;

        default: break;
      }
    }
    event.stopPropagation();
  };

  let onMouseUp = viewerEvent => {
    let event = viewerEvent.originalEvent;

    let evt = new Event('mouseup-planner-event');
    evt.viewerEvent = viewerEvent;
    document.dispatchEvent(evt);

    let { x, y } = mapCursorPosition(viewerEvent);

    switch (mode) {

      case constants.MODE_IDLE: {
        let elementData = extractElementData(event.target);

        if (elementData && elementData.selected) return;

        switch (elementData ? elementData.prototype : 'none') {
          case 'areas':
            actions.area.selectArea(elementData.layer, elementData.id);
            break;

          case 'lines':
            actions.lines.selectLine(elementData.layer, elementData.id);
            break;

          case 'holes':
            actions.holes.selectHole(elementData.layer, elementData.id);
            break;

          case 'items':
            actions.items.selectItem(elementData.layer, elementData.id);
            break;

          case 'none':
            actions.project.unselectAll();
            break;
        }
        break;
      }
      case constants.MODE_WAITING_DRAWING_LINE:
        actions.lines.beginDrawingLine(layerID, x, y, state.snapMask);
        break;

      case constants.MODE_DRAWING_LINE:
        actions.lines.endDrawingLine(x, y, state.snapMask);
        if (state.alternate) {
          actions.lines.beginDrawingLine(layerID, x, y, state.snapMask);
        }
        break;

      case constants.MODE_DRAWING_HOLE:
        actions.holes.endDrawingHole(layerID, x, y);
        break;

      case constants.MODE_DRAWING_ITEM:
        actions.items.endDrawingItem(layerID, x, y, state.alternate);
        break;

      case constants.MODE_DRAGGING_LINE:
        actions.lines.endDraggingLine(x, y, state.snapMask);
        break;

      case constants.MODE_DRAGGING_VERTEX:
        actions.vertices.endDraggingVertex(x, y, state.snapMask);
        break;

      case constants.MODE_DRAGGING_ITEM:
        actions.items.endDraggingItem(x, y);
        break;

      case constants.MODE_DRAGGING_HOLE:
        actions.holes.endDraggingHole(x, y);
        break;

      case constants.MODE_ROTATING_ITEM:
        actions.items.endRotatingItem(x, y);
        break;
    }

    event.stopPropagation();
  };

  let onChangeValue = (value) => {
    actions.project.updateZoomScale(value.a);
    return actions.viewer2D.updateCameraView(value)
  };

  let onChangeTool = (tool) => {
    switch (tool) {
      case TOOL_NONE:
        actions.project.selectToolEdit();
        break;

      case TOOL_PAN:
        actions.viewer2D.selectToolPan();
        break;

      case TOOL_ZOOM_IN:
        actions.viewer2D.selectToolZoomIn();
        break;

      case TOOL_ZOOM_OUT:
        actions.viewer2D.selectToolZoomOut();
        break;
    }
  };

  let { e, f, SVGWidth, SVGHeight } = state.get('viewer2D').toJS();

  const grids = state.getIn(['scene', 'grids']);
  const gridY = grids.valueSeq().filter((g) => g.type == 'horizontal-streak').first();
  const gridX = grids.valueSeq().filter((g) => g.type == 'vertical-streak').first();
  const sceneWidth = SVGWidth || state.getIn(['scene', 'width']);
  const sceneHeight = SVGHeight || state.getIn(['scene', 'height']);
  const sceneZoom = state.zoom || 1;

  let rulerSize = 15; //px
  let rulerBgColor = SharedStyle.PRIMARY_COLOR.main;
  let rulerFnColor = SharedStyle.COLORS.white;
  let rulerMkColor = SharedStyle.SECONDARY_COLOR.main;

  return (
    <ContainerDimensions>{
      ({ width, height }) =>
      <div style={{
        margin: 0,
        padding: 0,
        display: 'grid',
        gridRowGap: '0',
        gridColumnGap: '0',
        gridTemplateColumns: `${rulerSize}px 1fr`,
        gridTemplateRows: `${rulerSize}px 1fr`,
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
      }}>

          <div style={{ gridColumn: 1, gridRow: 1, backgroundColor: rulerBgColor }}></div>
          <div style={{ gridRow: 1, gridColumn: 2, position: 'relative', overflow: 'hidden', backgroundColor: rulerBgColor }} id="rulerX">
          { gridX && sceneWidth ? <RulerX
              grid={gridX}
              zoom={sceneZoom}
              mouseX={state.mouse.get('x')}
              sceneWidth={sceneWidth}
              width={width - rulerSize}
              zeroLeftPosition={e || 0}
              backgroundColor={rulerBgColor}
              fontColor={rulerFnColor}
              markerColor={rulerMkColor}
            /> : null }
          </div>
          <div style={{ gridColumn: 1, gridRow: 2, position: 'relative', overflow: 'hidden', backgroundColor: rulerBgColor }} id="rulerY">
            { gridY && sceneHeight ? <RulerY
              grid={gridY}
              zoom={sceneZoom}
              mouseY={state.mouse.get('y')}
              height={height - rulerSize}
              sceneHeight={sceneHeight}
              zeroTopPosition={((sceneHeight * sceneZoom) + f) || 0}
              backgroundColor={rulerBgColor}
              fontColor={rulerFnColor}
              markerColor={rulerMkColor}
            /> : null }
          </div>

          <ReactSVGPanZoom
            style={{ gridColumn: 2, gridRow: 2 }}
            width={width - rulerSize}
            height={height - rulerSize}
            value={/*viewer2D.isEmpty() ? null : */viewer2D.toJS()}
            onChangeValue={onChangeValue}
            tool={mode2Tool(mode)}
            onChangeTool={onChangeTool}
            detectAutoPan={mode2DetectAutopan(mode)}
            onMouseDown={onMouseDown}
            onMouseMove={onMouseMove}
            onMouseUp={onMouseUp}
            toolbarProps={{ position: "none" }}
            miniatureProps={{ position: "none" }}
          >

            <svg width={scene.width} height={scene.height}>
              <defs>
                <pattern id="diagonalFill" patternUnits="userSpaceOnUse" width="4" height="4" fill="#FFF">
                  <rect x="0" y="0" width="4" height="4" fill="#FFF" />
                  <path d="M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2" style={{ stroke: '#8E9BA2', strokeWidth: 1 }} />
                </pattern>
              </defs>
              <g style={{...mode2Cursor(state) }}>
                <State state={state} catalog={catalog} />
              </g>
            </svg>

          </ReactSVGPanZoom>
      </div>
    }</ContainerDimensions>
  );
}

Viewer2D.propTypes = {
  ...ContextPropTypes
};

export default needsContext(Viewer2D);
