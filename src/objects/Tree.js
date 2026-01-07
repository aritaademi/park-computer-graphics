
import * as THREE from 'three';

export default class Tree {
  constructor(scene, position) {
    const tree = new THREE.Group();

    const textureLoader = new THREE.TextureLoader();

    // 🌳 Bark Textures
    const barkColor = textureLoader.load('/assets/textures/trees/bark/bark_diffuse.jpg');
    const barkNormal = textureLoader.load('/assets/textures/trees/bark/bark_normal.jpg');
    const barkRoughness = textureLoader.load('/assets/textures/trees/bark/bark_roughness.jpg');
    const barkAO = textureLoader.load('/assets/textures/trees/bark/bark_ao.jpg');

    const trunkMaterial = new THREE.MeshStandardMaterial({
      map: barkColor,
      normalMap: barkNormal,
      roughnessMap: barkRoughness,
      aoMap: barkAO,
      roughness: 1
    });

    // 🌲 Leaves Textures
    const leavesColor = textureLoader.load('/assets/textures/trees/leaves/leaves_diffuse.jpg');
    const leavesNormal = textureLoader.load('/assets/textures/trees/leaves/leaves_normal.jpg');
    const leavesRoughness = textureLoader.load('/assets/textures/trees/leaves/leaves_roughness.jpg');
    const leavesAO = textureLoader.load('/assets/textures/trees/leaves/leaves_ao.jpg');

    const leavesMaterial = new THREE.MeshStandardMaterial({
      map: leavesColor,
      //normalMap: leavesNormal,
      roughnessMap: leavesRoughness,
      //aoMap: leavesAO,
      roughness: 0.8
    });

    // Trunk
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.3, 0.5, 3, 16),
      trunkMaterial
    );
    trunk.position.y = 1.5;
    trunk.castShadow = true;
    // trunk.receiveShadow = true;
    trunk.receiveShadow = false;

    // Leaves
    const leaves = new THREE.Mesh(
      new THREE.SphereGeometry(1.6, 24, 24),
      leavesMaterial
    );
    leaves.position.y = 3.6;
    // leaves.castShadow = true;
    leaves.castShadow = false;
    leaves.receiveShadow = false;

    // IMPORTANT for AO maps
    trunk.geometry.setAttribute(
      'uv2',
      new THREE.BufferAttribute(trunk.geometry.attributes.uv.array, 2)
    );
    leaves.geometry.setAttribute(
      'uv2',
      new THREE.BufferAttribute(leaves.geometry.attributes.uv.array, 2)
    );

    tree.add(trunk);
    tree.add(leaves);

    tree.position.copy(position);
    scene.add(tree);
  }
}
