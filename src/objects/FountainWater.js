// import * as THREE from 'three';

// export default class FountainWater {
//   constructor(scene, center, options) {
//     this.scene = scene;
//     this.center = center;

//     this.count = options.count || 80;
//     this.minHeight = options.minHeight;
//     this.maxHeight = options.maxHeight;
//     this.radius = options.radius;

//     this.particles = [];

//     const geometry = new THREE.SphereGeometry(0.04, 8, 8);
//     const material = new THREE.MeshStandardMaterial({
//       color: 0x66ccff,
//       transparent: true,
//       opacity: 0.75
//     });

//     for (let i = 0; i < this.count; i++) {
//       const angle = Math.random() * Math.PI * 2;
//       const r = Math.random() * this.radius;

//       const particle = new THREE.Mesh(geometry, material);

//       particle.position.set(
//         center.x + Math.cos(angle) * r,
//         this.minHeight + Math.random() * 0.2,
//         center.z + Math.sin(angle) * r
//       );

//       particle.userData.speed =
//         Math.random() * 0.02 + 0.01;

//       this.scene.add(particle);
//       this.particles.push(particle);
//     }
//   }

//   update() {
//     this.particles.forEach(p => {
//       p.position.y += p.userData.speed;

//       if (p.position.y > this.maxHeight) {
//         p.position.y = this.minHeight;
//       }
//     });
//   }
// }


// src/objects/FountainWater.js
import * as THREE from 'three';

export default class FountainWater {
  constructor(scene, position, options) {
    this.scene = scene;
    this.position = new THREE.Vector3(position.x, position.y, position.z);

    // Configurable options with defaults
    this.count = options.count || 30;           // total particles
    this.minHeight = options.minHeight || 0.5;  // min particle height
    this.maxHeight = options.maxHeight || 1.0;  // max particle height
    this.radius = options.radius || 0.5;        // radius around the center

    // Array to hold particles
    this.particles = [];

    // Create particles
    const geometry = new THREE.SphereGeometry(0.05, 8, 8);
    const material = new THREE.MeshStandardMaterial({
      color: 0x66ccff,
      emissive: 0x66ccff,
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.8
    });

    for (let i = 0; i < this.count; i++) {
      const particle = new THREE.Mesh(geometry, material);

      // Random position inside a circle
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * this.radius;
      particle.position.set(
        this.position.x + r * Math.cos(angle),
        this.position.y,
        this.position.z + r * Math.sin(angle)
      );

      particle.userData = {
        speed: Math.random() * 0.02 + 0.01, // upward speed
        maxY: this.position.y + Math.random() * (this.maxHeight - this.minHeight) + this.minHeight
      };

      scene.add(particle);
      this.particles.push(particle);
    }

    // Frame skip for performance
    this.frameSkip = 0;
  }

  update() {
    this.frameSkip++;
    if (this.frameSkip % 2 !== 0) return; // update every 2nd frame

    this.particles.forEach(p => {
      p.position.y += p.userData.speed;

      // Reset particle to base if it reaches max
      if (p.position.y > p.userData.maxY) {
        const angle = Math.random() * Math.PI * 2;
        const r = Math.random() * this.radius;
        p.position.set(
          this.position.x + r * Math.cos(angle),
          this.position.y,
          this.position.z + r * Math.sin(angle)
        );

        p.userData.maxY = this.position.y + Math.random() * (this.maxHeight - this.minHeight) + this.minHeight;
        p.userData.speed = Math.random() * 0.02 + 0.01;
      }
    });
  }
}
