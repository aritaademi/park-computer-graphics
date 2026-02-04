🎉 Live Demo [View the project in your browser](https://parkproject-omega.vercel.app/)

🚀 Getting Started (Run Locally)

Follow these steps to clone and run the project on your computer:

1. Clone the repository
   
git clone https://github.com/aritaademi/park-computer-graphics.git

 cd park-computer-graphics

2. Make sure you install the dependencies

npm install

3. Run the project locally
   
npm run dev

📌 Project Overview

This project is a 3D Interactive Park developed using Three.js as part of the Computer Graphics course. The goal of the project is to demonstrate core computer graphics concepts such as 3D modeling, transformations, lighting, textures, scene hierarchy, animation, and user interaction.
The scene represents a night-time park environment where the user can freely explore the space using a first-person view, interact with the environment, and experience animated and textured objects that bring the scene to life.

🎯 Project Objectives

Build a functional 3D scene using Three.js
Import and manage external 3D models and textures
Apply physically based materials (PBR)
Implement lighting and shadows realistically
Enable user interaction and navigation
Add animations to create a dynamic environment
Maintain clean, modular, and readable code

🧩 Technologies & Tools Used

Three.js – 3D rendering library
JavaScript (ES6 Modules)
HTML5 / CSS3
GLTF / FBX models
Git & GitHub – Version control

🌍 Scene Description

The scene depicts a park at day & night, surrounded by trees and populated with various objects such as:
 - Benches
 - Lamps
 - Flowers
 - Old rusty car
 - Dog
 - Playground elements (swing, slide)
 - Decorative trees
 - Picnic elements
The park is enclosed by a rectangular border of trees, with additional decorative trees placed behind them to create depth and realism.
A starry sky and night lighting enhance the atmosphere.

🌳 Custom Tree Implementation

Custom trees are created programmatically using Three.js primitives:
Trunk: CylinderGeometry
Leaves: SphereGeometry
Each tree is built as a THREE.Group, creating a hierarchical structure:
Parent: Tree group
Children: Trunk and Leaves meshes
Materials & Textures
Bark textures: diffuse, normal, roughness, AO maps
Leaves textures: diffuse and roughness maps
Materials: MeshStandardMaterial (PBR)
This demonstrates correct use of physically-based rendering.

🌲 Decorative Trees (External Models)

An external model (decorative_tree.glb) is imported using GLTFLoader.
Features:
Multiple instances are placed behind the main tree border
Trees are distributed in several layers to add depth
Models are scaled and positioned programmatically

🌬️ Wind Animation

A subtle wind animation is applied:
Trees gently sway using a sine-based rotation
Each tree has a random offset for natural movement
This animation runs inside the main render loop.

💡 Lighting System

Multiple light sources are used:
 - AmbientLight – soft global illumination
 - DirectionalLight – simulates moonlight
Shadows:
 - Shadows are enabled on lights
 - Objects such as trees and benches cast shadows
 - Shadow usage is optimized for performance

🎮 Camera & Controls

First-Person View (FPS)
Implemented in a separate controller file
Mouse look + WASD movement
Toggleable using the "Toggle POV" button
Orbit Controls
Default camera mode
Allows free rotation and inspection of the scene
The user can switch between the two modes at runtime.

🚧 Collision Detection

Basic collision detection is implemented to prevent the user from walking through:
 - Benches
 - Playground objects
This improves realism and user experience.

✨ Interactivity & Animation

First-person navigation
Toggle between camera modes
Wind animation on trees
Dynamic scene updates via animation loop
