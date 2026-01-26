import * as THREE from 'three';

export default class Renderer {
  constructor(camera) {
    this.renderer = new THREE.WebGLRenderer({ antialias: true }); //Antialiasing = smoother edges
    this.renderer.setSize(window.innerWidth, window.innerHeight); //screen size
    //this.renderer.setPixelRatio(window.devicePixelRatio);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5)); //pizel ratio: improves quality and Prevents performance issues on 4K screens

    this.renderer.shadowMap.enabled = true; //Enables realistic shadows
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap; //Soft edges

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
