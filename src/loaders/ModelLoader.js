import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';

export default class ModelLoader {
  constructor() {
    this.loader = new GLTFLoader(); //One loader instance reused for all models
  }

  load(path) {
    return new Promise((resolve, reject) => {
      this.loader.load(
        path,
        gltf => resolve(gltf.scene), //on success loads in the scene
        undefined,
        error => reject(error)
      );
    });
  }
}
