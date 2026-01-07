// src/controls/FirstPersonController.js
import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import * as THREE from 'three';

export default class FirstPersonController {
  constructor(camera, domElement, scene, keyboard) {
    this.camera = camera;
    this.scene = scene;
    this.keyboard = keyboard;

    this.controls = new PointerLockControls(camera, domElement);

    this.velocity = new THREE.Vector3();
    this.direction = new THREE.Vector3();

    this.moveSpeed = 6;

    // Player height
    camera.position.set(0, 1.7, 10);

    // ✅ FIX: use controls.object (NOT getObject)
    scene.add(this.controls.object);

    this.enabled = false;
  }

  enable() {
    this.enabled = true;
    this.controls.lock();
  }

  disable() {
    this.enabled = false;
    this.controls.unlock();
  }

//   update(delta) {
//     if (!this.enabled || !this.controls.isLocked) return;

//     this.direction.set(0, 0, 0);

//     if (this.keyboard.isPressed('KeyW')) this.direction.z -= 1;
//     if (this.keyboard.isPressed('KeyS')) this.direction.z += 1;
//     if (this.keyboard.isPressed('KeyA')) this.direction.x -= 1;
//     if (this.keyboard.isPressed('KeyD')) this.direction.x += 1;

//     this.direction.normalize();

//     this.controls.moveRight(this.direction.x * this.moveSpeed * delta);
//     this.controls.moveForward(this.direction.z * this.moveSpeed * delta);

//     // Lock player to ground
//     this.controls.object.position.y = 1.7;
//   }

    update(delta, collisionManager) {
    if (!this.enabled || !this.controls.isLocked) return;

    const prevPosition = this.controls.object.position.clone();

    this.direction.set(0, 0, 0);

    if (this.keyboard.isPressed('KeyW')) this.direction.z -= 1;
    if (this.keyboard.isPressed('KeyS')) this.direction.z += 1;
    if (this.keyboard.isPressed('KeyA')) this.direction.x -= 1;
    if (this.keyboard.isPressed('KeyD')) this.direction.x += 1;

    this.direction.normalize();

    this.controls.moveRight(this.direction.x * this.moveSpeed * delta);
    this.controls.moveForward(this.direction.z * this.moveSpeed * delta);

    // Lock height
    this.controls.object.position.y = 1.7;

    // 🧱 PLAYER COLLISION BOX
    const playerBox = new THREE.Box3().setFromCenterAndSize(
        this.controls.object.position,
        new THREE.Vector3(0.6, 1.7, 0.6)
    );

    // ❌ COLLISION → revert position
    if (collisionManager && collisionManager.checkCollision(playerBox)) {
        this.controls.object.position.copy(prevPosition);
    }
    }


}
