// src/core/Renderer.js
import * as THREE from 'three';

export default class Renderer {
  constructor(camera) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    //this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));

    // IMPORTANT for grading
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    document.body.appendChild(this.renderer.domElement);
    this.camera = camera;
  }

  render(scene) {
    this.renderer.render(scene, this.camera);
  }

  resize() {
    this.renderer.setSize(window.innerWidth, window.innerHeight);
  }
}
