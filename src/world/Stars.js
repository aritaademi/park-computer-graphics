import * as THREE from 'three';

export default class Stars {
  constructor(scene) {
    const starCount = 3000; //number of stars in the sky

    const geometry = new THREE.BufferGeometry();  //Efficient geometry for lots of points
    const positions = [];

    for (let i = 0; i < starCount; i++) {  //generate positions
      const x = (Math.random() - 0.5) * 400;  //random placement , x and z: spread wide
      const y = Math.random() * 200 + 50; //y: keep stars above ground
      const z = (Math.random() - 0.5) * 400;

      positions.push(x, y, z);
    }

    geometry.setAttribute(  //attach positions
      'position',
      new THREE.Float32BufferAttribute(positions, 3)  //Every 3 numbers = 1 star (x, y, z)
    );

    const material = new THREE.PointsMaterial({  //star material
      color: 0xffffff, //Each vertex renders as a glowing point
      size: 1,
      sizeAttenuation: true
    });

    this.stars = new THREE.Points(geometry, material); //point object- Efficient way to render thousands of stars
    this.stars.name = 'stars';

    scene.add(this.stars);
  }

  setVisible(isNight) {  
    this.stars.visible = isNight; //Stars only show at night
  }
}
