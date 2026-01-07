
// import * as THREE from 'three';

// export default class Lamp {
//   constructor(scene, model, position) {
//     this.scene = scene;
//     this.isOn = true;

//     // Parent group
//     this.group = new THREE.Group();
//     this.group.position.copy(position);

//     // Add GLB model
//     this.model = model;
//     this.model.scale.set(1, 1, 1); // adjust based on your model size
//     this.model.position.y += 0.0; // lift above ground if needed
//     this.group.add(this.model);

//     // Point light
//     this.light = new THREE.PointLight(0xffeeaa, 1, 10);
//     this.light.position.set(0, 3, 0);
//     this.light.castShadow = true;
//     this.group.add(this.light);

//     // Shadow & emissive
//     this.model.traverse(child => {
//       if (child.isMesh) {
//         child.castShadow = true;
//         child.receiveShadow = true;
//         if (child.material) {
//           child.material.emissive = new THREE.Color(0xffcc66);
//           child.material.emissiveIntensity = 1;
//         }
//       }
//     });

//     scene.add(this.group);
//   }

//   toggle() {
//     this.isOn = !this.isOn;
//     this.light.intensity = this.isOn ? 1 : 0;

//     this.model.traverse(child => {
//       if (child.isMesh && child.material) {
//         child.material.emissive.set(this.isOn ? 0xffcc66 : 0x000000);
//       }
//     });
//   }

//   getObject() {
//     return this.group;
//   }
// }


// src/objects/Lamp.js
import * as THREE from 'three';

export default class Lamp {
  constructor(scene, model, position) {
    this.scene = scene;
    this.isOn = true;

    this.group = new THREE.Group();
    this.group.position.copy(position);

    // clone the model for each instance
    this.model = model.clone();
    this.model.scale.set(0.5, 0.5, 0.5);
    this.group.add(this.model);

    this.light = new THREE.PointLight(0xffeeaa, 1, 12);
    this.light.position.set(0, 3, 0);
    this.light.castShadow = true;
    this.group.add(this.light);

    this.model.traverse(child => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material.emissive = new THREE.Color(0xffcc66);
          child.material.emissiveIntensity = 1;
        }
      }
    });

    scene.add(this.group);
  }

  toggle() {
    this.isOn = !this.isOn;
    this.light.intensity = this.isOn ? 1 : 0;

    this.model.traverse(child => {
      if (child.isMesh && child.material) {
        child.material.emissive.set(this.isOn ? 0xffcc66 : 0x000000);
      }
    });
  }

  setLight(isOn) {
    if (this.light) {
      this.light.intensity = isOn ? 1.5 : 0;
    }
  }


  getObject() {
    return this.group;
  }
}
