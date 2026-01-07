// // src/world/Lighting.js
// import * as THREE from 'three';

// export default class Lighting {
//   constructor(scene) {
//     // Ambient light
//     this.ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
//     ambientLight.name = 'ambientLight';
//     scene.add(this.ambientLight);

//     // Sun light
//     this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
//     this.directionalLight.position.set(10, 20, 10);
//     sunLight.name = 'sunLight';
//     this.directionalLight.castShadow = true;

//     // this.directionalLight.shadow.mapSize.width = 2048;
//     // this.directionalLight.shadow.mapSize.height = 2048;
//     this.directionalLight.shadow.mapSize.set(1024, 1024);


//     this.directionalLight.shadow.camera.near = 1;
//     this.directionalLight.shadow.camera.far = 40;
//     this.directionalLight.shadow.camera.left = -30;
//     this.directionalLight.shadow.camera.right = 30;
//     this.directionalLight.shadow.camera.top = 30;
//     this.directionalLight.shadow.camera.bottom = -30;


//     scene.add(this.directionalLight);
//   }

//   setNightMode(isNight) {
//     this.ambientLight.intensity = isNight ? 0.1 : 0.4;
//     this.directionalLight.intensity = isNight ? 0.2 : 1;
//   }
// }


// src/world/Lighting.js
import * as THREE from 'three';

export default class Lighting {
  constructor(scene) {

    // 🌞 Ambient light
    this.ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
    this.ambientLight.name = 'ambientLight'; // ✅ FIX
    scene.add(this.ambientLight);

    // ☀️ Sun light
    this.directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    this.directionalLight.position.set(10, 20, 10);
    this.directionalLight.name = 'sunLight'; // ✅ FIX
    this.directionalLight.castShadow = true;

    this.directionalLight.shadow.mapSize.set(1024, 1024);
    this.directionalLight.shadow.camera.near = 1;
    this.directionalLight.shadow.camera.far = 40;
    this.directionalLight.shadow.camera.left = -30;
    this.directionalLight.shadow.camera.right = 30;
    this.directionalLight.shadow.camera.top = 30;
    this.directionalLight.shadow.camera.bottom = -30;

    scene.add(this.directionalLight);
  }

  setNightMode(isNight) {
    this.ambientLight.intensity = isNight ? 0.1 : 0.4;
    this.directionalLight.intensity = isNight ? 0.2 : 1;
  }
}
