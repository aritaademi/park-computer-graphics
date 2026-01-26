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

// Core Setup
const sceneManager = new SceneManager();
const scene = sceneManager.getScene();
const cameraManager = new CameraManager();  //creates the perspective camera
const camera = cameraManager.getCamera();
const renderer = new Renderer(camera);  //Creates WebGL renderer and connects it to the camera

// OrbitControls
const controls = new OrbitControls(camera, renderer.renderer.domElement);
controls.target.set(0, 0, 0); //Mouse rotates around (0,0,0)
controls.update();  //Used when NOT in first-person mode
// Keyboard
const keyboard = new Keyboard();  //Tracks key presses (WASD, etc.)

// First Person Controller
const fpController = new FirstPersonController(  //First-person movement system:
  camera,   //Uses camera, Uses keyboard, Checks collisions, Locks mouse
  renderer.renderer.domElement,
  scene,
  keyboard
);

// POV state
let isFirstPerson = false;  //Tracks current camera mode

const collisionManager = new CollisionManager(); //Stores all obstacles (benches, slide, swing, playground)
//used by: fpController.update(delta, collisionManager);

// Raycasting & UI
const raycastManager = new RaycastManager(camera, scene);  //Raycasting = clicking 3D objects
const infoPanel = new InfoPanel();  //InfoPanel = HTML popup
window.addEventListener('click', (e) => raycastManager.onClick(e));  //Every click → check what object was clicked

const clock = new Clock();  //Gives delta time (seconds between frames), This makes animations frame-rate independent.

// --------------------
// World
// --------------------
new Environment(scene);  //creates base world
new Lighting(scene);  //creates lights
new Ground(scene);  //creates grass terrain
const stars = new Stars(scene);  
stars.setVisible(false); //stars exist but are hidden during day

// --------------------
// Trees – Large Rectangle Border
// --------------------
const treeDistance = 18;
const treePositions = [];

// Top & Bottom rows - calculate positions in a rectangle to form a park boundary
for (let x = -treeDistance; x <= treeDistance; x += 6) {
  treePositions.push({ x, y: 0, z: -treeDistance });
  treePositions.push({ x, y: 0, z: treeDistance });
}
// Left & Right rows - calculate positions in a rectangle to form a park boundary
for (let z = -treeDistance + 6; z <= treeDistance - 6; z += 6) {
  treePositions.push({ x: -treeDistance, y: 0, z });
  treePositions.push({ x: treeDistance, y: 0, z });
}

treePositions.forEach(pos => new Tree(scene, pos));  //Procedural generation = no manual placement

const gltfLoader = new GLTFLoader();
const windSystem = new WindSystem();

// --------------------
// Decorative Trees – Background Forest
// --------------------
gltfLoader.load(   //load decorative trees
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

function spawnDecorativeTree(scene, template, x, y, z) {
  const tree = template.clone(true);  //clone many times

  const scale = 2 + Math.random() * 1.5;
  tree.scale.set(scale, scale, scale);

  tree.position.set(
    x + Math.random() * 1.5,
    y,
    z + Math.random() * 1.5
  );

  tree.rotation.y = Math.random() * Math.PI * 2;
  scene.add(tree);

  // Register for wind animation
  windSystem.add(tree);
}

// --------------------
// Load Models
// --------------------
const modelLoader = new ModelLoader();

// --------------------
//  Benches – Inner Rectangle Corners
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
    collisionManager.addObstacle(bench.getObject());  //Bench blocks player

    raycastManager.add(bench.getObject(), () => {
      infoPanel.show('Park Bench<br>A place to rest and enjoy the park.');  //Clicking shows info panel
    });
  });

    // --------------------
  //  Sketchfab Car (GLTF) – Between Upper-Left and Lower-Left Benches
  // --------------------
  modelLoader.load('/assets/models/car/scene.gltf').then(car => {  //modelLoader.load() returns a Promis, When the GLTF finishes loading: car is a THREE.Group, It contains many meshes, materials, and children
    car.traverse(child => { //we traverse it, Walks through every child object, Including meshes inside groups inside groups
      if (child.isMesh) {  //check if child is a mesh
        child.castShadow = true;  //can cast shadows
        child.receiveShadow = true;   //can receive shadows

        // Sketchfab models often use non-PBR materials, Or materials that don’t react correctly to Three.js light
        //that's why we enforce MeshStandardMaterial → correct lighting + textures
        if (!child.material || !child.material.isMeshStandardMaterial) {
          child.material = new THREE.MeshStandardMaterial({
            map: child.material?.map || null,  //If texture exists → reuse it, If not → fallback to safe defaults
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
    scene.add(car);

    // When we click it shows information
    raycastManager.add(car, () => {
      infoPanel.show('Old Rusty Car<br>A classic Sketchfab car.');
    });

  }).catch(error => console.error('Error loading old car GLTF:', error));

});

// --------------------
// Hotdog Machine – Between Upper-Left and Upper-Right Benches
// --------------------
modelLoader.load('/assets/models/hotdog_machine/scene.gltf').then(machine => {  //machine = THREE.Group
  machine.traverse(child => {  //Traverse + shadows + materials, same logic as car
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

  console.log('Hotdog machine loaded!');
}).catch(error => console.error('Error loading hotdog machine:', error));

//Day/Night manager needs access to all lamps
const lamps = [];  //each lamp has mesh, light, is controlled by day/night

modelLoader.load('/assets/models/lamps/lamp.glb').then(model => { //load once
  const lampPositions = [  //four corners in the park
    new THREE.Vector3(-10, 0, -10),
    new THREE.Vector3(10, 0, -10),
    new THREE.Vector3(-10, 0, 10),
    new THREE.Vector3(10, 0, 10),
  ];

  lampPositions.forEach(pos => {  //create lamps, loop through positions
    const lamp = new Lamp(scene, model, pos);  //create lamp instance, inside lamp there is clone model, point light, position
    lamps.push(lamp); //store it

    raycastManager.add(lamp.getObject(), () => lamp.toggle());  //click interaction
  });
});

const dayNightManager = new DayNightManager(scene, lamps);  //controls sky color, ambient light, directional light, lamps on at night

// Hook stars + wind into day/night system
const originalToggle = dayNightManager.toggle.bind(dayNightManager); //override toggle

dayNightManager.toggle = () => {  //extend behavior without modifying the class
  originalToggle(); //call original logic
  // ⭐ Stars
  stars.setVisible(dayNightManager.isNight);  //night -ON, day-OFF
  // 🌬️ Wind
  windSystem.setEnabled(!dayNightManager.isNight); //day -ON, night -OFF
};

// --------------------
// Fountain (FBX)
// --------------------
const fbxLoader = new FBXLoader();  //Creates an FBXLoader instance from Three.js.

fbxLoader.load(
  '/assets/models/fountain/fountain.fbx',
  (model) => {
    const fountain = new Fountain(  //creates fountain class instance
      scene,
      model,
      { x: 0, y: 0, z: 0 } // CENTER
    );

    raycastManager.add(fountain.getObject(), () => {
      infoPanel.show('Fountain<br>Central attraction of the park.'); //shows information when we click
    });
  },
  undefined,
  (error) => {
    console.error('Error loading fountain:', error);
  }
);

let waterSystems = []; //Array to store all water tiers of the fountain
//Each tier has different height, radius, and number of particles, creating realistic water flow.

waterSystems.push(
  // Top tier
  //adds water particles to the scene, {x,y,z} → position relative to fountain.
  new FountainWater(scene, { x: 0, y: 1.6, z: 0 }, {
    ////{count, minHeight, maxHeight, radius} → controls particle fountain effect:
    count: 40,  //count: number of water drops
    minHeight: 1.6,  //minHeight / maxHeight: vertical range
    maxHeight: 2.2,
    radius: 0.15 //radius: horizontal spread
  }),

  // Middle tier
  //More drops, lower, wider spread → realistic layered fountain
  new FountainWater(scene, { x: 0, y: 1.0, z: 0 }, {
    count: 50,
    minHeight: 1.0,
    maxHeight: 1.4,
    radius: 0.35
  }),

  // Bottom tier - Gentle bubbling effect at base
  new FountainWater(scene, { x: 0, y: 0.4, z: 0 }, {
    count: 60,
    minHeight: 0.4,
    maxHeight: 0.6,
    radius: 0.7
  })
);

// --------------------
// Picnic Blanket – Simple GLTF – Between Car and Lower-Left Bench
// --------------------
modelLoader.load('/assets/models/picnic_simple/scene.gltf').then(picnic => {

  // Ensures blanket interacts with lighting correctly:
  picnic.traverse(child => {
    if (child.isMesh) {
      child.castShadow = true; //Casts shadows on ground
      child.receiveShadow = true;  //Can receive shadows from benches, trees, etc.
    }
  });

  // Scale & rotate
  picnic.scale.set(0.05,0.05,0.05);
  picnic.rotation.y = 0;

  // Position – between Car (-8,0,0) and Lower-left Bench (-8,0,8)
  picnic.position.set(-8, 0, 4); // X = -8 → aligned with car / bench row, Z = 4 → halfway between car (0) and lower-left bench (8), Y = 0 → sits on ground.
  scene.add(picnic);

  console.log('🧺 Simple picnic blanket loaded!');
}).catch(error => console.error('Error loading picnic blanket:', error));


// --------------------
//  Agapanthus (FBX) – Around Fountain
// --------------------
const fbxPlantLoader = new FBXLoader();

fbxPlantLoader.load(
  '/assets/models/plants/agapanthus/Agapanthus_01.fbx',
  (model) => {
    model.traverse(child => {  //traverse walks through all objects inside model
      if (child.isMesh) {  //isMesh checks if the object is a renderable 3D mesh.
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    model.scale.set(0.01, 0.01, 0.01); // FBX usually huge

    //Arrange plants in a circle
    const count = 16;  //number of plants around the fountain.
    const radius = 2.6;  //how far from the center of the fountain they should be.

    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;  //evenly space plants in a circle around the fountain, converts the iteration index to radians around a full circle

      const plant = model.clone();  //Clone and position each plant
      plant.position.set(
        Math.cos(angle) * radius,  //X coordinate on the circle.
        0,   //Y = 0 → sits on ground.
        Math.sin(angle) * radius  //Z coordinate on the circle.
      );

      plant.rotation.y = angle + Math.PI / 2;  //Rotate around Y axis so plants face outward from the circle
      scene.add(plant);
    }
  },
  undefined,
  (error) => {
    console.error('Error loading Agapanthus:', error);
  }
);

// --------------------
// Tulips (OBJ) – Near Benches
// --------------------
const objLoader = new OBJLoader();

objLoader.load('/assets/models/plants/tulips/tulips.obj', (model) => {  //model is loaded as a Three.js Group / Mesh.
  model.traverse(child => {
    if (child.isMesh) {
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });

  model.scale.set(0.02, 0.02, 0.02);

  const benchPositions = [  //Define positions near benches
    new THREE.Vector3(-8, 0, -8),
    new THREE.Vector3(8, 0, -8),
    new THREE.Vector3(-8, 0, 8),
    new THREE.Vector3(8, 0, 8),
  ];

  benchPositions.forEach(pos => {  //Plant tulips in two rows (left/right side of benches)
    // Left side
    for (let i = 0; i < 3; i++) {
      const tulip = model.clone();
      tulip.position.set(
        pos.x - 1 + Math.random() * 0.3,  //X = pos.x - 1 → left of bench, slight random offset (+0~0.3) for natural look
        0,
        pos.z + i * 0.4 - 0.4  //spreads 3 tulips along Z-axis in front of bench
      );
      tulip.rotation.y = Math.random() * Math.PI;
      scene.add(tulip);
    }

    // Right side
    for (let i = 0; i < 3; i++) {
      const tulip = model.clone();
      tulip.position.set(
        pos.x + 1 + Math.random() * 0.3,  //X = pos.x + 1 → right of bench.
        0,
        pos.z + i * 0.4 - 0.4
      );
      tulip.rotation.y = Math.random() * Math.PI;
      scene.add(tulip);
    }
  });
});

// --------------------
// Dog – back-and-forth animation
// --------------------
let dog;  //will hold the 3D model object once loaded
let dogSpeed = 2; // units per second
let dogDirection = 1; // 1 = forward, -1 = backward
const dogStartX = 5;
const dogEndX = 8;

const dogLoader = new GLTFLoader();
dogLoader.setPath('/assets/models/dog/'); // base folder for gltf

dogLoader.load(
  'scene.gltf',
  (gltf) => {
    dog = gltf.scene;   //the actual 3D object loaded from the GLTF file
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
// Slide – Between Right-Upper Bench and Dog
// --------------------
fbxLoader.load(
  '/assets/models/slide/Slide.fbx',
  (slide) => {

    // Traverse all child meshes to enable shadows
    slide.traverse(child => {
      if (child.isMesh) {
        child.castShadow = true;  //Enables the slide to cast and receive shadows, same as with the dog
        child.receiveShadow = true;
      }
    });

    // Scale & rotate
    slide.scale.set(0.01, 0.01, 0.01); // FBX models are usually huge
    slide.rotation.y = Math.PI / 4;     // otates the slide 45° clockwise around Y-axis, so it aligns properly with other park objects.

    // Position somewhere between right-upper bench (8,0,-8) and dog
    // Example: place at (5,0,-4)
    slide.position.set(5, 0, -4);

    // Add to scene
    scene.add(slide);
    collisionManager.addObstacle(slide);

    console.log('Slide loaded!');
  },
  undefined,
  (error) => console.error('Error loading slide:', error)
);

// --------------------
// Swing – Near the slide
// --------------------
fbxLoader.load(
  '/assets/models/swing/Swing.fbx',
  (swing) => {

    // Enable shadows on all meshes
    swing.traverse(child => { //Loops through all child meshes of the swing
      if (child.isMesh) {
        child.castShadow = true;  //the swing will cast shadows on the ground.
        child.receiveShadow = true;  //it can receive shadows from other objects
      }
    });

    // Scale & rotation
    swing.scale.set(0.002, 0.002, 0.002); // FBX is usually very large
    swing.rotation.y = -Math.PI / 6;    // rotates the swing about 30° counterclockwise so it faces correctly relative to the slide.

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
// Playground – Between the dog and lower-right bench
// --------------------
fbxLoader.load(
  '/assets/models/playground/3d-model.fbx',
  (playground) => {

    // Enable shadows for all child meshes
    playground.traverse(child => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });

    // Scale & rotation
    playground.scale.set(0.01, 0.01, 0.01);  // FBX is usually very large
    playground.rotation.y = 0;                //keeps the model facing forward

    // Position: example values (between dog and lower-right bench)
    // If dog is at (-4,0,0) and lower-right bench at (8,0,8), adjust as needed
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
// Resize - Listens for browser window resize events
// --------------------
window.addEventListener('resize', () => {
  cameraManager.resize();  //Listens for browser window resize events
  renderer.resize();  //updates the renderer size to match the new window dimensions
});

// --------------------
// Animate Loop
// --------------------
function animate() {
  requestAnimationFrame(animate); //repeatedly calls animate() at ~60fps
  //delta = time (in seconds) since the last frame
  const delta = clock.getDelta(); //Used for frame-independent movement, so objects move smoothly regardless of FPS

  windSystem.update(delta);  //Updates the wind animations
  waterSystems.forEach(w => w.update());  //Updates fountain water particles for each tier

  if (dog) {
    //Moves the dog along X-axis using dogSpeed and dogDirection
    dog.position.x += dogSpeed * dogDirection * delta;

    //Checks if the dog reached the bounds (dogStartX or dogEndX) → flips direction
    if (dog.position.x >= dogEndX) {
      dogDirection = -1;
      dog.rotation.y = Math.PI;  //rotates dog 180° when changing direction
    }
    if (dog.position.x <= dogStartX) {
      dogDirection = 1;
      dog.rotation.y = 0;
    }
  }

  collisionManager.update();  //Updates collision detection for the FPS player
  fpController.update(delta, collisionManager);  //Updates the first-person controller based on user input and collisions

  if (!isFirstPerson) {
    controls.update();  //Updates OrbitControls only if the player is not in FPS mode
  }

  renderer.render(scene);
}

animate();

//Listens for button click to switch between day and night
document.getElementById('toggleDay').addEventListener('click', () => {
  dayNightManager.toggle();  //Calls the DayNightManager to handle lights, stars, and wind.

});

//Switches camera control between first-person view and orbit view.
document.getElementById('toggleView').addEventListener('click', () => {
  isFirstPerson = !isFirstPerson;

  if (isFirstPerson) {
    //Updates isFirstPerson state, Enables/disables the appropriate controller: OrbitControls → mouse orbit around the scene, FPSController → move like a game character.
    controls.enabled = false;     // disable orbit
    fpController.enable();        // enable FPS
  } else {
    fpController.disable();       // disable FPS
    controls.enabled = true;      // enable orbit
  }
});
