import * as THREE from 'three';

export default class DayNightManager {
  constructor(scene, lights = []) {
    this.scene = scene;
    this.lamps = lights;
    this.isNight = false;

    // DAY lighting
    this.daySettings = {
      ambient: 0.6,
      directional: 1.0,
      background: 0xbfd1e5
    };

    // NIGHT lighting (soft, not dark)
    this.nightSettings = {
      ambient: 0.25,
      directional: 0.35,
      background: 0x0b1c2d
    };

    this.ambientLight = scene.getObjectByName('ambientLight');
    this.directionalLight = scene.getObjectByName('sunLight');
  }

  toggle() {
    this.isNight = !this.isNight;

    const settings = this.isNight
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
