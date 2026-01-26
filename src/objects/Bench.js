export default class Bench {
  //scene → where to place the bench
  //model → preloaded bench model (GLTF/GLB)
  //position → where in the park it goes
  constructor(scene, model, position) {
    // clone model to create independent instance
    this.bench = model.clone(); //We must clone models if we want multiple copies, Without cloning → moving one bench moves all benches

    this.bench.scale.set(0.5, 0.5, 0.5);
    this.bench.position.copy(position); //copies { x, y, z } into the 3D object’s position vector.
    this.bench.position.y += 0.1;  //lift the bench slightly to prevent z-fighting

    //traverse walks through: bench root, all child meshes, all nested objects
    this.bench.traverse(child => { //enable shadows
      if (child.isMesh) {  //only meshes can receive/cast shadows
        child.castShadow = true;  //Bench casts shadow on ground
        child.receiveShadow = true;  //Bench receives shadows from trees, lights
      }
    });

    scene.add(this.bench);
  }

  getObject() {
    return this.bench;
  }
}
