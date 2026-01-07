// src/loaders/ModelLoader.js
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default class ModelLoader {
  constructor() {
    this.loader = new GLTFLoader();
  }

  load(path) {
    return new Promise((resolve, reject) => {
      this.loader.load(
        path,
        gltf => resolve(gltf.scene),
        undefined,
        error => reject(error)
      );
    });
  }
}
