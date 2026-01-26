export default class InfoPanel {
  constructor() {
    this.panel = document.createElement('div');  //creates html element, Rendered on top of WebGL canvas
    this.panel.style.position = 'absolute';  //position - Centered horizontally at bottom
    this.panel.style.bottom = '20px';
    this.panel.style.left = '50%';
    this.panel.style.transform = 'translateX(-50%)';
    this.panel.style.padding = '15px 20px';
    this.panel.style.background = 'rgba(0, 0, 0, 0.7)';
    this.panel.style.color = 'white';
    this.panel.style.fontFamily = 'Arial';
    this.panel.style.borderRadius = '8px';
    this.panel.style.display = 'none';  //visibility: hidden by default
    this.panel.style.maxWidth = '300px';  //Prevents huge panels
    this.panel.style.textAlign = 'center';

    document.body.appendChild(this.panel);  //add to dom
  }

  show(text) {  //show panel 
    //insert content
    this.panel.innerHTML = `
      <p>${text}</p>
      <button id="closeInfo">Close</button>
    `;
    this.panel.style.display = 'block';  //make it visible

    document.getElementById('closeInfo').onclick = () => {  //close button logics
      this.hide();
    };
  }

  hide() {
    this.panel.style.display = 'none';
  }
}
