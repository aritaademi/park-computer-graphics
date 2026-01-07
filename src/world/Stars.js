// src/world/Stars.js
import * as THREE from 'three';

export default class Stars {
  constructor(scene) {
    const starCount = 3000;

    const geometry = new THREE.BufferGeometry();
    const positions = [];

    for (let i = 0; i < starCount; i++) {
      const x = (Math.random() - 0.5) * 400;
      const y = Math.random() * 200 + 50; // keep stars above ground
      const z = (Math.random() - 0.5) * 400;

      positions.push(x, y, z);
    }

    geometry.setAttribute(
      'position',
      new THREE.Float32BufferAttribute(positions, 3)
    );

    const material = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 1,
      sizeAttenuation: true
    });

    this.stars = new THREE.Points(geometry, material);
    this.stars.name = 'stars';

    scene.add(this.stars);
  }

  setVisible(isNight) {
    this.stars.visible = isNight;
  }
}
