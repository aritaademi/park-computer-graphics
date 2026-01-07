

// export default class Bench {
//   constructor(scene, model, position) {
//     this.bench = model;

//     this.bench.scale.set(1, 1, 1); // adjust based on model size
//     this.bench.position.copy(position);
//     this.bench.position.y += 0.0; // lift above ground if needed

//     this.bench.traverse(child => {
//       if (child.isMesh) {
//         child.castShadow = true;
//         child.receiveShadow = true;
//       }
//     });

//     scene.add(this.bench);
//   }

//   getObject() {
//     return this.bench;
//   }
// }


// src/objects/Bench.js
export default class Bench {
  constructor(scene, model, position) {
    // clone model to create independent instance
    this.bench = model.clone();

    this.bench.scale.set(0.5, 0.5, 0.5);
    this.bench.position.copy(position);
    this.bench.position.y += 0.1;

    this.bench.traverse(child => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    scene.add(this.bench);
  }

  getObject() {
    return this.bench;
  }
}
