import * as THREE from 'three';

export default class Lamp {
  constructor(scene, model, position) {
    this.scene = scene; //store scene
    this.isOn = true;  //isOn tracks lamp state

    //why group? Combines model + light, Move/rotate as ONE object
    this.group = new THREE.Group();
    this.group.position.copy(position);

    this.model = model.clone(); //clone model, Each lamp is independent
    this.model.scale.set(0.5, 0.5, 0.5);  //fix model size
    this.group.add(this.model);  //add model to group

    //create light, color: warm yellow, intensity: 1, distance: 12 units
    this.light = new THREE.PointLight(0xffeeaa, 1, 12);
    this.light.position.set(0, 3, 0);  //positioned above light head
    this.light.castShadow = true;  //Lamp casts shadows on ground
    this.group.add(this.light);   //add light to group

    this.model.traverse(child => {  //traverse - Walks through all lamp meshes
      if (child.isMesh) {  //Only meshes need shadows/materials
        child.castShadow = true;
        child.receiveShadow = true;
        if (child.material) {
          child.material.emissive = new THREE.Color(0xffcc66);  //emissive glow
          child.material.emissiveIntensity = 1;
        }
      }
    });

    scene.add(this.group);
  }

  toggle() {  //Switch ON / OFF
    this.isOn = !this.isOn;  //Flip state
    this.light.intensity = this.isOn ? 1 : 0;  //ON → emits light, OFF → no light

    this.model.traverse(child => {
      if (child.isMesh && child.material) {
        child.material.emissive.set(this.isOn ? 0xffcc66 : 0x000000);  //ON → glowing lamp, OFF → dark lamp
      }
    });
  }

  setLight(isOn) {  //set light directly
    if (this.light) {
      this.light.intensity = isOn ? 1.5 : 0;  //Stronger intensity when ON
    }
  }


  getObject() {
    return this.group;
  }
}
