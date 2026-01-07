export default class InfoPanel {
  constructor() {
    this.panel = document.createElement('div');
    this.panel.style.position = 'absolute';
    this.panel.style.bottom = '20px';
    this.panel.style.left = '50%';
    this.panel.style.transform = 'translateX(-50%)';
    this.panel.style.padding = '15px 20px';
    this.panel.style.background = 'rgba(0, 0, 0, 0.7)';
    this.panel.style.color = 'white';
    this.panel.style.fontFamily = 'Arial';
    this.panel.style.borderRadius = '8px';
    this.panel.style.display = 'none';
    this.panel.style.maxWidth = '300px';
    this.panel.style.textAlign = 'center';

    document.body.appendChild(this.panel);
  }

  show(text) {
    this.panel.innerHTML = `
      <p>${text}</p>
      <button id="closeInfo">Close</button>
    `;
    this.panel.style.display = 'block';

    document.getElementById('closeInfo').onclick = () => {
      this.hide();
    };
  }

  hide() {
    this.panel.style.display = 'none';
  }
}
