import * as THREE from 'three';

export default class Fountain {
  constructor(scene, model, position = { x: 0, y: 0, z: 0 }) {
    this.scene = scene;

    this.model = model;

    // Fix common FBX issues
    this.model.scale.set(0.01, 0.01, 0.01); // FBX models are HUGE
    this.model.position.set(position.x, position.y, position.z);
    this.model.rotation.y = Math.PI; // optional, adjust if needed

    this.scene.add(this.model);
  }

  getObject() {
    return this.model;
  }
}
