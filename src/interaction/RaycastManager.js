// import * as THREE from 'three';

// export default class RaycastManager {
//   constructor(camera, scene) {
//     this.camera = camera;
//     this.scene = scene;

//     this.raycaster = new THREE.Raycaster();
//     this.mouse = new THREE.Vector2();

//     this.clickableObjects = [];
//   }

//   add(object, callback) {
//     this.clickableObjects.push({ object, callback });
//   }

//   onClick(event) {
//     this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
//     this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

//     this.raycaster.setFromCamera(this.mouse, this.camera);

//     const objects = this.clickableObjects.map(o => o.object);
//     const intersects = this.raycaster.intersectObjects(objects, true);

//     if (intersects.length > 0) {
//       const intersected = intersects[0].object;

//       const clickable = this.clickableObjects.find(entry =>
//         entry.object === intersected || entry.object.children.includes(intersected)
//       );

//       if (clickable) {
//         clickable.callback();
//       }
//     }
//   }
// }


// src/interaction/RaycastManager.js
import * as THREE from 'three';

export default class RaycastManager {
  constructor(camera) {
    this.camera = camera;
    this.raycaster = new THREE.Raycaster();
    this.mouse = new THREE.Vector2();
    this.clickables = [];
  }

  add(object, callback) {
    this.clickables.push({ object, callback });
  }

  onClick(event) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    this.raycaster.setFromCamera(this.mouse, this.camera);

    const objects = this.clickables.map(c => c.object);
    const intersects = this.raycaster.intersectObjects(objects, true);

    if (!intersects.length) return;

    let clickedObject = intersects[0].object;

    // 🔥 walk UP the hierarchy until we find a registered clickable
    while (clickedObject) {
      const match = this.clickables.find(c => c.object === clickedObject);
      if (match) {
        match.callback();
        return;
      }
      clickedObject = clickedObject.parent;
    }
  }
}
