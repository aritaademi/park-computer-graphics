import * as THREE from 'three';

export default class DayNightManager {
  //scene → world
  //lights → lamp objects
  constructor(scene, lights = []) {
    this.scene = scene;  //store scene
    this.lamps = lights;  //store lights
    this.isNight = false;  //store state

    // DAY lighting settings
    this.daySettings = {
      ambient: 0.6,  //bright ambient
      directional: 1.0, //strong sunlight
      background: 0xbfd1e5  //light blue sky
    };

    // NIGHT lighting (soft, not dark)
    this.nightSettings = { 
      ambient: 0.25,  //dim but visible
      directional: 0.35,  //soft moonlight
      background: 0x0b1c2d  //dark blue sky
    };

    //get lights from scene, Requires lights to be named when created
    this.ambientLight = scene.getObjectByName('ambientLight');
    this.directionalLight = scene.getObjectByName('sunLight');
  }

  toggle() {
    this.isNight = !this.isNight;  //flip state

    const settings = this.isNight  //choose settings
      ? this.nightSettings
      : this.daySettings;

    // Change light intensities
    this.ambientLight.intensity = settings.ambient;
    this.directionalLight.intensity = settings.directional;

    // Change background color
    this.scene.background = new THREE.Color(settings.background);

    // Toggle lamps
    this.lamps.forEach(lamp => lamp.setLight(this.isNight));
    console.log('Night mode:', this.isNight);

  }
}
