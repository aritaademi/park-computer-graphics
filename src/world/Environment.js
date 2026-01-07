// src/world/Environment.js
import * as THREE from 'three';

export default class Environment {
  constructor(scene) {
    const groundGeometry = new THREE.PlaneGeometry(200, 200);
    const groundMaterial = new THREE.MeshStandardMaterial({
      color: 0x3a5f0b,
      roughness: 0.9
    });

    const ground = new THREE.Mesh(groundGeometry, groundMaterial);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;

    scene.add(ground);
  }
}
