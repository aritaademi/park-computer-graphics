import * as THREE from 'three';

export default class Fountain {
  constructor(scene, model, position = { x: 0, y: 0, z: 0 }) {
    this.scene = scene; //save scene reference
    this.model = model;  //store model, This is usually an FBX model

    this.model.scale.set(0.01, 0.01, 0.01); // FBX models are HUGE, scale fix
    this.model.position.set(position.x, position.y, position.z);  //position the fountain
    this.model.rotation.y = Math.PI; // Rotates 180°, Fixes wrong forward direction

    this.scene.add(this.model);
  }

  getObject() {
    return this.model;
  }
}
