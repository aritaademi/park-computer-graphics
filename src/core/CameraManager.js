import * as THREE from 'three';

export default class CameraManager {
  constructor() {
    this.camera = new THREE.PerspectiveCamera(
      75,   //Field of View (human-like)
      window.innerWidth / window.innerHeight, //Screen ratio
      0.1,    //Near clipping plane
      1000    //Far clipping plane
    );

    this.camera.position.set(0, 5, 10); //camera starts above the ground and looking at the park
  }

  getCamera() {
    return this.camera;
  }

  resize() { //Without this → image stretches when resizing window
    this.camera.aspect = window.innerWidth / window.innerHeight;
    this.camera.updateProjectionMatrix();
  }
}
