function disposeGeometry(geometry) {
  geometry.dispose();
}

function disposeTexture(texture) {
  if (!texture) {
    return;
  }
  texture.dispose();
}

function disposeMultimaterial(material) {
  if (!(material instanceof Three.MultiMaterial)) {
    return;
  }
  material.materials.forEach(material => {
    disposeMaterial(material);
  });

}

function disposeMaterial(material) {
  if (!(material instanceof Three.Material)) {
    return;
  }

  disposeTexture(material.map);
  material.dispose();
}

function disposeMesh(scene3D, mesh) {
  if (!(mesh instanceof Three.Mesh || mesh instanceof Three.BoxHelper)) {
    return;
  }
  scene3D.remove(mesh);
  disposeGeometry(mesh.geometry);
  disposeMultimaterial(mesh.material);
  disposeMaterial(mesh.material);
}

export function disposeScene(scene3D) {
  scene3D.traverse(child => {
    disposeMesh(scene3D, child);
  });
}

export function disposeObject(scene3D, object) {
  object.traverse(child => {
    disposeMesh(scene3D, child);
  });
}