import * as THREE from 'three';

export default class CollisionManager {  //Handles player collision with park objects
  constructor() {
    this.obstacles = [];  //Stores collision objects
  }

  addObstacle(object) {
    const box = new THREE.Box3().setFromObject(object);  //Create bounding box, Axis-aligned bounding box (AABB)
    this.obstacles.push({ object, box });  //Store object + box
  }

  update() {  //Called each frame.
    this.obstacles.forEach(item => {
      item.box.setFromObject(item.object);  //Updates bounding box if object moved
    });
  }

  checkCollision(playerBox) {
    for (const item of this.obstacles) {  //Loop obstacles
      if (playerBox.intersectsBox(item.box)) {  //intersection test, Simple and fast AABB collision
        return true;  //collision found
      }
    }
    return false; //no collision
  }
}
