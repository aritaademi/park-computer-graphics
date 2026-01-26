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



import * as THREE from 'three';

//Simulates fountain water particles using animated meshes.
export default class FountainWater {
  //scene → where to add particles
  //position → fountain center
  //options → configurable water behavior
  constructor(scene, position, options) {
    this.scene = scene;
    this.position = new THREE.Vector3(position.x, position.y, position.z);  //store position, ensures proper vector math and consistent 3D position

    // Configurable options with defaults
    this.count = options.count || 30;           // total particles, If not provided → default to 30 particles.
    //this controls: water height, spread radius and visual styles
    this.minHeight = options.minHeight || 0.5;  // min particle height
    this.maxHeight = options.maxHeight || 1.0;  // max particle height
    this.radius = options.radius || 0.5;        // radius around the center

    // Array to hold particles
    this.particles = []; //Keeps references for animation.

    // Create particles
    const geometry = new THREE.SphereGeometry(0.05, 8, 8); //each particle is a small sphere
    const material = new THREE.MeshStandardMaterial({
      color: 0x66ccff,  //blue water
      emissive: 0x66ccff,  //Emissive makes it “glow”
      emissiveIntensity: 0.6,
      transparent: true,
      opacity: 0.8
    });

    for (let i = 0; i < this.count; i++) {  //Creates many water drops
      const particle = new THREE.Mesh(geometry, material);

      // Random position inside a circle
      const angle = Math.random() * Math.PI * 2;
      const r = Math.random() * this.radius;
      particle.position.set(  //Converts polar → Cartesian coordinates.
        this.position.x + r * Math.cos(angle),
        this.position.y,
        this.position.z + r * Math.sin(angle)
      );

      particle.userData = { //Store animation data
        speed: Math.random() * 0.02 + 0.01, // upward speed
        maxY: this.position.y + Math.random() * (this.maxHeight - this.minHeight) + this.minHeight  //each particle: Moves at different speed and Reaches different height
      };

      scene.add(particle);
      this.particles.push(particle);
    }
    this.frameSkip = 0; // Frame skip used for performance
  }

  update() {  //Called every animation frame.
    this.frameSkip++;
    if (this.frameSkip % 2 !== 0) return; // update every 2nd frame - Reduces CPU usage

    this.particles.forEach(p => {  //animate particles
      p.position.y += p.userData.speed;  //move upward - Simulates water rising

      // Reset particle to base if it reaches max
      if (p.position.y > p.userData.maxY) {
        const angle = Math.random() * Math.PI * 2;
        const r = Math.random() * this.radius;
        p.position.set(  //Random restart position - Creates continuous water flow illusion
          this.position.x + r * Math.cos(angle),
          this.position.y,
          this.position.z + r * Math.sin(angle)
        );

        //new height and speed, Adds randomness → natural look
        p.userData.maxY = this.position.y + Math.random() * (this.maxHeight - this.minHeight) + this.minHeight;
        p.userData.speed = Math.random() * 0.02 + 0.01;
      }
    });
  }
}
