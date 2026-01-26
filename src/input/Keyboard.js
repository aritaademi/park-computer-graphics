export default class Keyboard { //purpose: Keeps track of which keys are currently pressed
  constructor() {
    this.keys = {}; //An object (dictionary / map) that stores key states like: {"KeyW": true, "KeyA: false"}

    //when user presses a key , browser fires 'keydown'
    window.addEventListener('keydown', (e) => {
      this.keys[e.code] = true; // e.code is physical key (like KeyW), Store true = “currently pressed”
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.code] = false; //when key is released - Mark it as not pressed
    });
  }
  //checks key state
  isPressed(code) {
    return this.keys[code] === true;
  }
}
