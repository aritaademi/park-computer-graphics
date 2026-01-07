
// src/main.js
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import SceneManager from './core/SceneManager';
import CameraManager from './core/CameraManager';
import Renderer from './core/Renderer';
import Lighting from './world/Lighting';
import Environment from './world/Environment';
import Ground from './world/Ground';
import Tree from './objects/Tree';
import Bench from './objects/Bench';
import Lamp from './objects/Lamp';
import ModelLoader from './loaders/ModelLoader';
import RaycastManager from './interaction/RaycastManager';
import InfoPanel from './ui/InfoPanel';
import { FBXLoader } from 'three/examples/jsm/loaders/FBXLoader.js';
import Fountain from './objects/Fountain';
import FountainWater from './objects/FountainWater';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { Clock } from 'three';
import DayNightManager from './world/DayNightManager';
import Stars from './world/Stars';
import FirstPersonController from './controls/FirstPersonController';
import Keyboard from './input/Keyboard';
import CollisionManager from './physics/CollisionManager';
import WindSystem from './world/WindSystem';


// --------------------
// Core Setup
// --------------------
const sceneManager = new SceneManager();
const scene = sceneManager.getScene();

const cameraManager = new CameraManager();
const camera = cameraManager.getCamera();

const renderer = new Renderer(camera);

// OrbitControls
const controls = new OrbitControls(camera, renderer.renderer.domElement);
controls.target.set(0, 0, 0);
controls.update();
// Keyboard
const keyboard = new Keyboard();

// First Person Controller
const fpController = new FirstPersonController(
  camera,
  renderer.renderer.domElement,
  scene,
  keyboard
);

// POV state
let isFirstPerson = false;

const collisionManager = new CollisionManager();


// Raycasting & UI
const raycastManager = new RaycastManager(camera, scene);
const infoPanel = new InfoPanel();
window.addEventListener('click', (e) => raycastManager.onClick(e));

const clock = new Clock();

// --------------------
// World
// --------------------
new Environment(scene);
new Lighting(scene);
new Ground(scene);
const stars = new Stars(scene);
stars.setVisible(false); // hidden during day


// --------------------
// 🌳 Trees – Large Rectangle Border
// --------------------
const treeDistance = 18;
const treePositions = [];

// Top & Bottom rows
for (let x = -treeDistance; x <= treeDistance; x += 6) {
  treePositions.push({ x, y: 0, z: -treeDistance });
  treePositions.push({ x, y: 0, z: treeDistance });
}

// Left & Right rows
for (let z = -treeDistance + 6; z <= treeDistance - 6; z += 6) {
  treePositions.push({ x: -treeDistance, y: 0, z });
  treePositions.push({ x: treeDistance, y: 0, z });
}

treePositions.forEach(pos => new Tree(scene, pos));

const gltfLoader = new GLTFLoader();
const windSystem = new WindSystem();

// --------------------
// 🌲 Decorative Trees – Background Forest
// --------------------
gltfLoader.load(
  '/assets/models/trees/decorative_tree.glb',
  (gltf) => {

    const treeModel = gltf.scene;

    treeModel.traverse(child => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    // Base scale (adjust if needed)
    treeModel.scale.set(1.5, 1.5, 1.5);

    addDecorativeTrees(scene, treeModel);
  },
  undefined,
  (error) => console.error('Error loading decorative tree:', error)
);
function addDecorativeTrees(scene, treeTemplate) {
  const layers = 3;          // how many rows behind
  const spacing = 6;         // distance between trees
  const layerOffset = 5;     // distance between rows
  const baseDistance = 18;   // your existing treeDistance

  for (let layer = 1; layer <= layers; layer++) {

    const offset = baseDistance + layer * layerOffset;

    // TOP & BOTTOM
    for (let x = -offset; x <= offset; x += spacing) {
      spawnDecorativeTree(scene, treeTemplate, x, 0, -offset);
      spawnDecorativeTree(scene, treeTemplate, x, 0, offset);
    }

    // LEFT & RIGHT
    for (let z = -offset + spacing; z <= offset - spacing; z += spacing) {
      spawnDecorativeTree(scene, treeTemplate, -offset, 0, z);
      spawnDecorativeTree(scene, treeTemplate, offset, 0, z);
    }
  }
}
// function spawnDecorativeTree(scene, template, x, y, z) {
//   const tree = template.clone(true);

//   // Slight randomness
//   const scale = 2 + Math.random() * 1.5;
//   tree.scale.set(scale, scale, scale);

//   tree.position.set(
//     x + Math.random() * 1.5,
//     y,
//     z + Math.random() * 1.5
//   );

//   tree.rotation.y = Math.random() * Math.PI * 2;

//   scene.add(tree);
// }

function spawnDecorativeTree(scene, template, x, y, z) {
  const tree = template.clone(true);

  const scale = 2 + Math.random() * 1.5;
  tree.scale.set(scale, scale, scale);

  tree.position.set(
    x + Math.random() * 1.5,
    y,
    z + Math.random() * 1.5
  );

  tree.rotation.y = Math.random() * Math.PI * 2;

  scene.add(tree);

  // 🌬️ Register for wind animation
  windSystem.add(tree);
}



// --------------------
// Load Models
// --------------------
const modelLoader = new ModelLoader();

// --------------------
// 🪑 Benches – Inner Rectangle Corners
// --------------------
modelLoader.load('/assets/models/benches/bench.glb').then(model => {
  const benchPositions = [
    new THREE.Vector3(-8, 0, -8), // upper-left
    new THREE.Vector3(8, 0, -8),  // upper-right
    new THREE.Vector3(-8, 0, 8),  // lower-left
    new THREE.Vector3(8, 0, 8),   // lower-right
  ];

  benchPositions.forEach(pos => {
    const bench = new Bench(scene, model, pos);
    collisionManager.addObstacle(bench.getObject());

    raycastManager.add(bench.getObject(), () => {
      infoPanel.show('Park Bench<br>A place to rest and enjoy the park.');
    });
  });

    // --------------------
  // 🚗 Sketchfab Car (GLTF) – Between Upper-Left and Lower-Left Benches
  // --------------------
  modelLoader.load('/assets/models/car/scene.gltf').then(car => {
    car.traverse(child => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;

        // Ensure MeshStandardMaterial for three.js
        if (!child.material || !child.material.isMeshStandardMaterial) {
          child.material = new THREE.MeshStandardMaterial({
            map: child.material?.map || null,
            normalMap: child.material?.normalMap || null,
            roughnessMap: child.material?.roughnessMap || null,
            metalnessMap: child.material?.metalnessMap || null,
            aoMap: child.material?.aoMap || null,
            color: child.material?.color || new THREE.Color(0xffffff)
          });
        }
      }
    });

    // Scale and rotate
    car.scale.set(0.005, 0.005, 0.005);   // Adjust as needed
    car.rotation.y = -Math.PI / 2;

    // Place between upper-left (-8,0,-8) and lower-left (-8,0,8) benches
    car.position.set(-8, 0, 0);

    // Add to scene
    scene.add(car);

    // Optional raycast info
    raycastManager.add(car, () => {
      infoPanel.show('Old Rusty Car<br>A classic Sketchfab car.');
    });

  }).catch(error => console.error('Error loading old car GLTF:', error));



});

// --------------------
// 🌭 Hotdog Machine – Between Upper-Left and Upper-Right Benches
// --------------------
modelLoader.load('/assets/models/hotdog_machine/scene.gltf').then(machine => {
  machine.traverse(child => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;

      // Ensure MeshStandardMaterial for three.js (so textures work)
      if (!child.material || !child.material.isMeshStandardMaterial) {
        child.material = new THREE.MeshStandardMaterial({
          map: child.material?.map || null,
          normalMap: child.material?.normalMap || null,
          roughnessMap: child.material?.roughnessMap || null,
          metalnessMap: child.material?.metalnessMap || null,
          aoMap: child.material?.aoMap || null,
          color: child.material?.color || new THREE.Color(0xffffff)
        });
      }
    }
  });

  // Scale & rotate if needed
  machine.scale.set(1.5, 1.5, 1.5);  // adjust based on model size
  machine.rotation.y = 0;

  // Position – between upper-left (-8,0,-8) and upper-right (8,0,-8) benches
  machine.position.set(0, 0, -8); // X=0 is center, Z=-8 for upper row

  scene.add(machine);

  console.log('🌭 Hotdog machine loaded!');
}).catch(error => console.error('Error loading hotdog machine:', error));


const lamps = [];

modelLoader.load('/assets/models/lamps/lamp.glb').then(model => {
  const lampPositions = [
    new THREE.Vector3(-10, 0, -10),
    new THREE.Vector3(10, 0, -10),
    new THREE.Vector3(-10, 0, 10),
    new THREE.Vector3(10, 0, 10),
  ];

  lampPositions.forEach(pos => {
    const lamp = new Lamp(scene, model, pos);
    lamps.push(lamp);

    raycastManager.add(lamp.getObject(), () => lamp.toggle());
  });
});

const dayNightManager = new DayNightManager(scene, lamps);
// Hook stars into day/night system
// const originalToggle = dayNightManager.toggle.bind(dayNightManager);

// dayNightManager.toggle = () => {
//   originalToggle();
//   stars.setVisible(dayNightManager.isNight);
// };

// Hook stars + wind into day/night system
const originalToggle = dayNightManager.toggle.bind(dayNightManager);

dayNightManager.toggle = () => {
  originalToggle();

  // ⭐ Stars
  stars.setVisible(dayNightManager.isNight);

  // 🌬️ Wind
  windSystem.setEnabled(!dayNightManager.isNight);
};



// --------------------
// Fountain (FBX)
// --------------------
const fbxLoader = new FBXLoader();

fbxLoader.load(
  '/assets/models/fountain/fountain.fbx',
  (model) => {
    const fountain = new Fountain(
      scene,
      model,
      { x: 0, y: 0, z: 0 } // CENTER
    );

    raycastManager.add(fountain.getObject(), () => {
      infoPanel.show('Fountain<br>Central attraction of the park.');
    });
  },
  undefined,
  (error) => {
    console.error('Error loading fountain:', error);
  }
);

let waterSystems = [];

waterSystems.push(
  // Top tier
  new FountainWater(scene, { x: 0, y: 1.6, z: 0 }, {
    count: 40,
    minHeight: 1.6,
    maxHeight: 2.2,
    radius: 0.15
  }),

  // Middle tier
  new FountainWater(scene, { x: 0, y: 1.0, z: 0 }, {
    count: 50,
    minHeight: 1.0,
    maxHeight: 1.4,
    radius: 0.35
  }),

  // Bottom tier (gentle bubbling)
  new FountainWater(scene, { x: 0, y: 0.4, z: 0 }, {
    count: 60,
    minHeight: 0.4,
    maxHeight: 0.6,
    radius: 0.7
  })
);

// --------------------
// 🧺 Picnic Blanket – Simple GLTF – Between Car and Lower-Left Bench
// --------------------
modelLoader.load('/assets/models/picnic_simple/scene.gltf').then(picnic => {

  // Make sure it casts/receives shadows
  picnic.traverse(child => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  // Scale & rotate
  
  picnic.scale.set(0.05,0.05,0.05);
  picnic.rotation.y = 0;

  // Position – between Car (-8,0,0) and Lower-left Bench (-8,0,8)
  picnic.position.set(-8, 0, 4); // halfway between 0 and 8 on Z

  // Add to scene
  scene.add(picnic);

  console.log('🧺 Simple picnic blanket loaded!');
}).catch(error => console.error('Error loading picnic blanket:', error));


// --------------------
// 🌿 Agapanthus (FBX) – Around Fountain
// --------------------
const fbxPlantLoader = new FBXLoader();

fbxPlantLoader.load(
  '/assets/models/plants/agapanthus/Agapanthus_01.fbx',
  (model) => {
    model.traverse(child => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    model.scale.set(0.01, 0.01, 0.01); // FBX usually huge

    const count = 16;
    const radius = 2.6;

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;

      const plant = model.clone();
      plant.position.set(
        Math.cos(angle) * radius,
        0,
        Math.sin(angle) * radius
      );

      plant.rotation.y = angle + Math.PI / 2;
      scene.add(plant);
    }
  },
  undefined,
  (error) => {
    console.error('Error loading Agapanthus:', error);
  }
);

// --------------------
// 🌷 Tulips (OBJ) – Near Benches
// --------------------
const objLoader = new OBJLoader();

objLoader.load('/assets/models/plants/tulips/tulips.obj', (model) => {
  model.traverse(child => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  model.scale.set(0.02, 0.02, 0.02);

  const benchPositions = [
    new THREE.Vector3(-8, 0, -8),
    new THREE.Vector3(8, 0, -8),
    new THREE.Vector3(-8, 0, 8),
    new THREE.Vector3(8, 0, 8),
  ];

  benchPositions.forEach(pos => {
    // Left side
    for (let i = 0; i < 3; i++) {
      const tulip = model.clone();
      tulip.position.set(
        pos.x - 1 + Math.random() * 0.3,
        0,
        pos.z + i * 0.4 - 0.4
      );
      tulip.rotation.y = Math.random() * Math.PI;
      scene.add(tulip);
    }

    // Right side
    for (let i = 0; i < 3; i++) {
      const tulip = model.clone();
      tulip.position.set(
        pos.x + 1 + Math.random() * 0.3,
        0,
        pos.z + i * 0.4 - 0.4
      );
      tulip.rotation.y = Math.random() * Math.PI;
      scene.add(tulip);
    }
  });
});

// --------------------
// 🐶 Dog – back-and-forth animation
// --------------------
let dog;
let dogSpeed = 2; // units per second
let dogDirection = 1; // 1 = forward, -1 = backward
const dogStartX = 5;
const dogEndX = 8;

const dogLoader = new GLTFLoader();
dogLoader.setPath('/assets/models/dog/'); // base folder for gltf

dogLoader.load(
  'scene.gltf',
  (gltf) => {
    dog = gltf.scene;
    dog.scale.set(0.01, 0.01, 0.01); // adjust as needed
    dog.position.set(dogStartX, 0, 2); // starting position in the park
    dog.rotation.y = 0;

    // Ensure the meshes cast and receive shadows
    dog.traverse(child => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    scene.add(dog);
    console.log(' Dog loaded!');
  },
  undefined,
  (error) => console.error('Error loading dog model:', error)
);

// --------------------
// 🛝 Slide – Between Right-Upper Bench and Dog
// --------------------
fbxLoader.load(
  '/assets/models/slide/Slide.fbx',
  (slide) => {

    // Traverse all child meshes to enable shadows
    slide.traverse(child => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    // Scale & rotate
    slide.scale.set(0.01, 0.01, 0.01); // FBX models are usually huge
    slide.rotation.y = Math.PI / 4;     // adjust rotation as needed

    // Position somewhere between right-upper bench (8,0,-8) and dog
    // Example: place at (5,0,-4)
    slide.position.set(5, 0, -4);

    // Add to scene
    scene.add(slide);
    collisionManager.addObstacle(slide);

    console.log('🛝 Slide loaded!');
  },
  undefined,
  (error) => console.error('Error loading slide:', error)
);

// --------------------
// 🛝 Swing – Near the slide
// --------------------
fbxLoader.load(
  '/assets/models/swing/Swing.fbx',
  (swing) => {

    // Enable shadows on all meshes
    swing.traverse(child => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    // Scale & rotation
    swing.scale.set(0.002, 0.002, 0.002); // FBX is usually very large
    swing.rotation.y = -Math.PI / 6;    // adjust rotation to face the right way

    // Position: somewhere near the slide
    // Example: slide is at (5,0,-4), swing at (6,0,-5)
    swing.position.set(7, 0, -5);

    // Add to scene
    scene.add(swing);
    collisionManager.addObstacle(swing);

    console.log('🛝 Swing loaded!');
  },
  undefined,
  (error) => console.error('Error loading swing:', error)
);

// --------------------
// 🏰 Playground – Between the dog and lower-right bench
// --------------------
fbxLoader.load(
  '/assets/models/playground/3d-model.fbx',
  (playground) => {

    // Enable shadows for all meshes
    playground.traverse(child => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    // Scale & rotation
    playground.scale.set(0.01, 0.01, 0.01);  // FBX is usually very large
    playground.rotation.y = 0;                // Adjust rotation if needed

    // Position: example values (between dog and lower-right bench)
    // If your dog is at (-4,0,0) and lower-right bench at (8,0,8), adjust as needed
    playground.position.set(5, 0, 4);

    // Add to scene
    scene.add(playground);
    collisionManager.addObstacle(playground);

    console.log('Playground loaded!');
  },
  undefined,
  (error) => console.error('Error loading playground:', error)
);

// --------------------
// Resize
// --------------------
window.addEventListener('resize', () => {
  cameraManager.resize();
  renderer.resize();
});

// --------------------
// Animate Loop
// --------------------


function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();

  windSystem.update(delta);
  waterSystems.forEach(w => w.update());

  if (dog) {
    dog.position.x += dogSpeed * dogDirection * delta;

    if (dog.position.x >= dogEndX) {
      dogDirection = -1;
      dog.rotation.y = Math.PI;
    }
    if (dog.position.x <= dogStartX) {
      dogDirection = 1;
      dog.rotation.y = 0;
    }
  }

  // ✅ Update FPS only if active
  //fpController.update(delta);

  collisionManager.update();
  fpController.update(delta, collisionManager);


  if (!isFirstPerson) {
    controls.update();
  }

  renderer.render(scene);
}



animate();

document.getElementById('toggleDay').addEventListener('click', () => {
  dayNightManager.toggle();

});

document.getElementById('toggleView').addEventListener('click', () => {
  isFirstPerson = !isFirstPerson;

  if (isFirstPerson) {
    controls.enabled = false;     // disable orbit
    fpController.enable();        // enable FPS
  } else {
    fpController.disable();       // disable FPS
    controls.enabled = true;      // enable orbit
  }
});
