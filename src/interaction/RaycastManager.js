import * as THREE from 'three';

export default class RaycastManager { //purpose: Lets the user click on 3D objects using the mouse.

  constructor(camera) {
    this.camera = camera; //  //camera is needed because Raycasting depends on view direction and Click direction changes with camera movement
    this.raycaster = new THREE.Raycaster(); //raycaster=invisible layer, Starts from camera, Goes through mouse position, Checks what it hits
    this.mouse = new THREE.Vector2(); //Stores mouse position in Normalized Device Coordinates (NDC): X: -1 → 1, Y: -1 → 1
    this.clickables = []; //Clickable objects list
  }

  add(object, callback) { //Register clickable objects
    this.clickables.push({ object, callback });
  }

  onClick(event) {
    this.mouse.x = (event.clientX / window.innerWidth) * 2 - 1; //Convert mouse position to NDC
    this.mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;

    //Create ray from camera
    this.raycaster.setFromCamera(this.mouse, this.camera); //this ray: Origin = camera position, Direction = mouse point in 3D space

    const objects = this.clickables.map(c => c.object); //object to test: Extract only the meshes (ignore callbacks).
    const intersects = this.raycaster.intersectObjects(objects, true); //true → also check child meshes, Returns array sorted by distance (closest first)

    if (!intersects.length) return; //if nothing hits

    let clickedObject = intersects[0].object;  //get closest objects

    // walk UP the hierarchy until we find a registered clickable - because GLTF models have many child meshes, You clicked a child, not the main model
    while (clickedObject) {
      const match = this.clickables.find(c => c.object === clickedObject);  //match registered object
      if (match) { //if found: 
        match.callback();
        return;
      }
      clickedObject = clickedObject.parent; //Move up parent chain, Stops when root is reached.
    }
  }
}
