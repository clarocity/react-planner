'use strict';

import React from 'react';
import PropTypes from 'prop-types';
import * as Three from 'three';
import { parseData, updateScene } from './scene-creator';
import { disposeScene } from './three-memory-cleaner';
import OrbitControls from './libs/orbit-controls';
import diff from 'immutablediff';
import * as SharedStyle from '../../shared-style';
import ContainerDimensions from 'react-container-dimensions';
import { ContextPropTypes, Consumer as ContextConsumer } from '../context';
import memoize from 'memoize-one';

export default function Viewer3D (props) {
  return (
    <ContainerDimensions>{({ width, height }) =>
      <ContextConsumer>{(context) =>
        <Scene3DViewer {...props} {...context} height={height} width={width} />
      }</ContextConsumer>
    }</ContainerDimensions>
  );
}

class Scene3DViewer extends React.Component {

  constructor(props) {
    super(props);

    this.lastMousePosition = {};
    this.width = props.width;
    this.height = props.height;
    this.renderingID = 0;
    this.canvasWrapper = React.createRef();

    this.renderer = window.__threeRenderer || new Three.WebGLRenderer({ preserveDrawingBuffer: true });
    window.__threeRenderer = this.renderer;
  }

  componentDidMount() {
    const {catalog, actions} = this.props;

    let sceneActions = {
      areaActions:    actions.area,
      holesActions:   actions.holes,
      itemsActions:   actions.items,
      linesActions:   actions.lines,
      projectActions: actions.project
    };

    let { state } = this.props;
    let data = this.previousScene = state.scene;

    let scene3D = new Three.Scene();

    //RENDERER
    this.renderer.setClearColor(new Three.Color(SharedStyle.COLORS.white));
    this.renderer.setSize(this.width, this.height);

    // LOAD DATA
    let planData = parseData(data, sceneActions, catalog);

    scene3D.add(planData.plan);
    scene3D.add(planData.grid);

    let aspectRatio = this.width / this.height;
    let camera = new Three.PerspectiveCamera(45, aspectRatio, 1, 300000);

    scene3D.add(camera);

    // Set position for the camera
    let cameraPositionX = -(planData.boundingBox.max.x - planData.boundingBox.min.x) / 2;
    let cameraPositionY = (planData.boundingBox.max.y - planData.boundingBox.min.y) / 2 * 10;
    let cameraPositionZ = (planData.boundingBox.max.z - planData.boundingBox.min.z) / 2;

    camera.position.set(cameraPositionX, cameraPositionY, cameraPositionZ);
    camera.up = new Three.Vector3(0, 1, 0);

    // HELPER AXIS
    // let axisHelper = new Three.AxisHelper(100);
    // scene3D.add(axisHelper);

    // LIGHT
    let light = new Three.AmbientLight(0xafafaf); // soft white light
    scene3D.add(light);

    // Add another light

    let spotLight1 = new Three.SpotLight(SharedStyle.COLORS.white, 0.30);
    spotLight1.position.set(cameraPositionX, cameraPositionY, cameraPositionZ);
    scene3D.add(spotLight1);

    // OBJECT PICKING
    let toIntersect = [planData.plan];
    let mouse = new Three.Vector2();
    let raycaster = new Three.Raycaster();

    this.mouseDownEvent = (event) => {
      this.lastMousePosition.x = event.offsetX / this.width * 2 - 1;
      this.lastMousePosition.y = -event.offsetY / this.height * 2 + 1;
    };

    this.mouseUpEvent = (event) => {
      event.preventDefault();

      mouse.x = (event.offsetX / this.width) * 2 - 1;
      mouse.y = -(event.offsetY / this.height) * 2 + 1;

      if (Math.abs(mouse.x - this.lastMousePosition.x) <= 0.02 && Math.abs(mouse.y - this.lastMousePosition.y) <= 0.02) {

        raycaster.setFromCamera(mouse, camera);
        let intersects = raycaster.intersectObjects(toIntersect, true);

        if (intersects.length > 0 && !(isNaN(intersects[0].distance))) {
          intersects[0].object.interact && intersects[0].object.interact();
        } else {
          actions.project.unselectAll();
        }
      }
    };

    this.renderer.domElement.addEventListener('mousedown', this.mouseDownEvent);
    this.renderer.domElement.addEventListener('mouseup', this.mouseUpEvent);
    this.renderer.domElement.style.display = 'block';

    // add the output of the renderer to the html element
    this.canvasWrapper.current.appendChild(this.renderer.domElement);

    // create orbit controls
    let orbitController = new OrbitControls(camera, this.renderer.domElement);
    let spotLightTarget = new Three.Object3D();
    spotLightTarget.name = 'spotLightTarget';
    spotLightTarget.position.set(orbitController.target.x, orbitController.target.y, orbitController.target.z);
    scene3D.add(spotLightTarget);
    spotLight1.target = spotLightTarget;

    let render = () => {
      orbitController.update();
      spotLight1.position.set(camera.position.x, camera.position.y, camera.position.z);
      spotLightTarget.position.set(orbitController.target.x, orbitController.target.y, orbitController.target.z);
      camera.updateMatrix();
      camera.updateMatrixWorld();

      for (let elemID in planData.sceneGraph.LODs) {
        planData.sceneGraph.LODs[elemID].update(camera);
      }

      this.renderer.render(scene3D, camera);
      this.renderingID = requestAnimationFrame(render);
    };

    render();

    this.orbitControls = orbitController;
    this.camera = camera;
    this.scene3D = scene3D;
    this.planData = planData;
  }

  componentWillUnmount() {
    cancelAnimationFrame(this.renderingID);

    this.orbitControls.dispose();

    this.renderer.domElement.removeEventListener('mousedown', this.mouseDownEvent);
    this.renderer.domElement.removeEventListener('mouseup', this.mouseUpEvent);

    disposeScene(this.scene3D);
    this.scene3D.remove(this.planData.plan);
    this.scene3D.remove(this.planData.grid);

    this.scene3D = null;
    this.planData = null;
    this.camera = null;
    this.orbitControls = null;
    this.renderer.renderLists.dispose();
  }

  updateProps = memoize(function (width, height, actions, catalog, scene) {

    let sceneActions = {
      areaActions:    actions.area,
      holesActions:   actions.holes,
      itemsActions:   actions.items,
      linesActions:   actions.lines,
      projectActions: actions.project
    };

    this.width = width;
    this.height = height;

    this.camera.aspect = width / height;

    this.camera.updateProjectionMatrix();

    if (scene !== this.previousScene) {
      let changedValues = diff(this.previousScene, scene);
      updateScene(this.planData, scene, this.previousScene, changedValues.toJS(), sceneActions, catalog);
      this.previousScene = scene;
    }

    this.renderer.setSize(width, height);
  })

  render() {
    const { width, height, actions, catalog } = this.props;
    const scene = this.props.state.scene;

    if (this.camera) this.updateProps(width, height, actions, catalog, scene);
    return <div ref={this.canvasWrapper} />
  }
}

Scene3DViewer.propTypes = {
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  ...ContextPropTypes
};
