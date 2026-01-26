// // src/world/WindSystem.js
// export default class WindSystem {
//   constructor() {
//     this.trees = [];
//     this.time = 0;

//     // 🌬️ Wind tuning
//     this.speed = 0.6;      // how fast wind moves
//     this.strength = 0.03;  // how strong sway is
//   }

//   add(tree) {
//     this.trees.push({
//       object: tree,
//       offset: Math.random() * Math.PI * 2
//     });
//   }

//   update(delta) {
//     this.time += delta * this.speed;

//     this.trees.forEach(t => {
//       const sway =
//         Math.sin(this.time + t.offset) * this.strength;

//       t.object.rotation.z = sway;
//       t.object.rotation.x = sway * 0.5;
//     });
//   }
// }

export default class WindSystem {
  constructor() {
    this.trees = [];  //All trees affected by wind
    this.time = 0;  //Drives sine wave
    this.enabled = true; // Allows turning wind on/off
  }

  add(tree) { //adds a tree
    this.trees.push(tree);  //Registers a tree for wind animation
  }

  setEnabled(value) {
    this.enabled = value;  //enable/disable wind
  }

  update(delta) {  //called every frame, delta = time since last frame
    if (!this.enabled) return; //stop wind if disabled

    this.time += delta;

    this.trees.forEach(tree => {  //animate sway
      tree.rotation.z =
        Math.sin(this.time * 0.5) * 0.01;  //Math.sin() → smooth back-and-forth, Small value → subtle movement
    });
  }
}
