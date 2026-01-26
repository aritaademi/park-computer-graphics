import * as THREE from 'three';

export default class Ground {
  constructor(scene) {
    const textureLoader = new THREE.TextureLoader();

    // Load textures (PBR)
    const grassColor = textureLoader.load('/assets/textures/grass/color.jpg');
    const grassNormal = textureLoader.load('/assets/textures/grass/normal.jpg');
    const grassRoughness = textureLoader.load('/assets/textures/grass/roughness.jpg');

    // Repeat texture for realism
    grassColor.wrapS = grassColor.wrapT = THREE.RepeatWrapping;
    grassNormal.wrapS = grassNormal.wrapT = THREE.RepeatWrapping;
    grassRoughness.wrapS = grassRoughness.wrapT = THREE.RepeatWrapping;

    grassColor.repeat.set(20, 20);
    grassNormal.repeat.set(20, 20);
    grassRoughness.repeat.set(20, 20);

    const material = new THREE.MeshStandardMaterial({
      map: grassColor,
      normalMap: grassNormal,
      roughnessMap: grassRoughness,
      roughness: 1,
    });

    const geometry = new THREE.PlaneGeometry(100, 100);
    const ground = new THREE.Mesh(geometry, material);

    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;

    scene.add(ground);
  }
}
