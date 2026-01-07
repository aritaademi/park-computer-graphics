// src/physics/CollisionManager.js
import * as THREE from 'three';

export default class CollisionManager {
  constructor() {
    this.obstacles = [];
  }

  addObstacle(object) {
    const box = new THREE.Box3().setFromObject(object);
    this.obstacles.push({ object, box });
  }

  update() {
    this.obstacles.forEach(item => {
      item.box.setFromObject(item.object);
    });
  }

  checkCollision(playerBox) {
    for (const item of this.obstacles) {
      if (playerBox.intersectsBox(item.box)) {
        return true;
      }
    }
    return false;
  }
}
