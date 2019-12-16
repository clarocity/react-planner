/* eslint react/prop-types: 0 */
import React from 'react';
import { createArea, updatedArea } from './area-factory-3d';
import Translator from '../../translator/translator';

let translator = new Translator();

export default function AreaFactory(name, info, textures) {

  let areaElement = {
    name,
    prototype: 'areas',
    info: {
      ...info,
      visibility: {
        catalog: false,
        layerElementsVisible: false
      }
    },
    properties: {
      patternColor: {
        label: translator.t('color'),
        type: 'color',
        defaultValue: '#8E9BA2',
      },
      thickness: {
        label: translator.t('thickness'),
        type: 'length-measure',
        defaultValue: {
          length: 0,
        }
      }
    },
    render2D: function ({element, layer, themekit}) {
      const colors = themekit.resolve('grid.item');

      let path = '';

      ///print area path
      element.vertices.forEach((vertexID, ind) => {
        let vertex = layer.vertices.get(vertexID);
        path += (ind ? 'L' : 'M') + vertex.x + ' ' + vertex.y + ' ';
      });

      //add holes
      element.holes.forEach(areaID => {
        let area = layer.areas.get(areaID);

        area.vertices.reverse().forEach((vertexID, ind) => {
          let vertex = layer.vertices.get(vertexID);
          path += (ind ? 'L' : 'M') + vertex.x + ' ' + vertex.y + ' ';
        });

      });

      let fill = element.selected ? colors.targetFill : element.properties.get('patternColor');

      return (<path d={path} fill={fill} />);
    },

    render3D: function (element, layer, scene) {
      return createArea(element, layer, scene, textures)
    },

    updateRender3D: (element, layer, scene, mesh, oldElement, differences, selfDestroy, selfBuild) => {
      return updatedArea(element, layer, scene, textures, mesh, oldElement, differences, selfDestroy, selfBuild);
    }

  };

  if (textures && textures !== {}) {

    let textureValues = { 'none': 'None' };

    for (let textureName in textures) {
      textureValues[textureName] = textures[textureName].name
    }

    areaElement.properties.texture = {
      label: translator.t('texture'),
      type: 'enum',
      defaultValue: 'none',
      values: textureValues
    };

  }

  return areaElement

}
