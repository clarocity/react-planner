
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';

export function loadObjWithMaterial(mtlFile, objFile, imgPath) {
  let mtlLoader = new MTLLoader();
  mtlLoader.setResourcePath(imgPath);
  let url = mtlFile;
  return new Promise((resolve) => {

    mtlLoader.load(url, materials => {
      materials.preload();
      let objLoader = new OBJLoader();
      objLoader.setMaterials(materials);
      objLoader.load(objFile, object => resolve(object));

    });
  });
}

