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
    this.trees = [];
    this.time = 0;
    this.enabled = true; // ✅ NEW
  }

  add(tree) {
    this.trees.push(tree);
  }

  setEnabled(value) {
    this.enabled = value;
  }

  update(delta) {
    if (!this.enabled) return; // ✅ STOP WIND

    this.time += delta;

    this.trees.forEach(tree => {
      tree.rotation.z =
        Math.sin(this.time * 0.5) * 0.01;
    });
  }
}
