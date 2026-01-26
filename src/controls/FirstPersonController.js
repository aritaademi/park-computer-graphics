import { PointerLockControls } from 'three/examples/jsm/controls/PointerLockControls.js';
import * as THREE from 'three';

export default class FirstPersonController {
  //camera → the camera you see through (player’s eyes)
  //domElement → where mouse input is captured (usually document.body)
  //scene → needed to add the player object
  //keyboard → your custom keyboard handler
  constructor(camera, domElement, scene, keyboard) {
    this.camera = camera;
    this.scene = scene;
    this.keyboard = keyboard;

    //this attaches camera to mouse movement, Internally creates an Object3D that holds the camera - That object is what actually moves in the scene
    this.controls = new PointerLockControls(camera, domElement);

    this.velocity = new THREE.Vector3(); //how fast the player moves
    this.direction = new THREE.Vector3(); //where the player wants to move
    this.moveSpeed = 6;

    // Player height
    camera.position.set(0, 1.7, 10); //1.7 ≈ average human eye height,Camera starts slightly above ground, Z = 10 → starting position in the park

    scene.add(this.controls.object); //add player to the scene
    //important: controls.object is the actual player object and the camera is a child of this object
    this.enabled = false; //Player starts disabled, Prevents movement before clicking
  }

  enable() {
    this.enabled = true; 
    this.controls.lock(); //Locks mouse pointer, Starts FPS mode
  }

  disable() {
    this.enabled = false; //Releases mouse, Stops movement
    this.controls.unlock();
  }

  //delta → time between frames (for smooth movement)
  //collisionManager → checks walls, trees, benches, etc.
  update(delta, collisionManager) { //update method id called every frame
    //Movement only works when: Controller is enabled and Mouse is locked
    if (!this.enabled || !this.controls.isLocked) return;

    const prevPosition = this.controls.object.position.clone(); //used for collision: Move player, If collision happens → revert back

    this.direction.set(0, 0, 0); //reset direction, No movement by default

    if (this.keyboard.isPressed('KeyW')) this.direction.z -= 1; //forward
    if (this.keyboard.isPressed('KeyS')) this.direction.z += 1; //backward
    if (this.keyboard.isPressed('KeyA')) this.direction.x -= 1; //left
    if (this.keyboard.isPressed('KeyD')) this.direction.x += 1; //right

    this.direction.normalize(); //Prevents faster diagonal movement, Keeps movement speed consistent

    this.controls.moveRight(this.direction.x * this.moveSpeed * delta); //formula: distance = speed × time
    this.controls.moveForward(this.direction.z * this.moveSpeed * delta);

    // Lock height: Prevents flying or sinking, Player stays on ground
    this.controls.object.position.y = 1.7;

    // PLAYER COLLISION BOX, creates invisible box: width-0.6, height-1.7, depth-0.6
    const playerBox = new THREE.Box3().setFromCenterAndSize(
        this.controls.object.position,
        new THREE.Vector3(0.6, 1.7, 0.6)
    );

    // COLLISION → revert position
    if (collisionManager && collisionManager.checkCollision(playerBox)) {
        this.controls.object.position.copy(prevPosition); //if a player hits something: cancel movement, Go back to previous position
    }
  }

}
