import * as Three from 'three';
import React from 'react';
import { MdBrokenImage } from 'react-icons/md'

export default {
  name: "image",
  prototype: "items",

  info: {
    title: "broken",
    tag: [],
    description: "Broken Item",
    image: null,
  },

  properties: {},

  render2D: function ({element, layer, scene}) {

    return (
      <MdBrokenImage />
    );
  },

  render3D: function (element, layer, scene) {
    return Promise.resolve(new Three.Object3D());
  }
};
