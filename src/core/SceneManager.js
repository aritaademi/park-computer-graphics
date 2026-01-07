// src/core/SceneManager.js
import * as THREE from 'three';

export default class SceneManager {
  constructor() {
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x87ceeb); // sky blue
  }

  getScene() {
    return this.scene;
  }
}
