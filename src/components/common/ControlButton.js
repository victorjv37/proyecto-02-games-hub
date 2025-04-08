// Reusable control button component
export class ControlButton {
  constructor(text, id, onClick, options = {}) {
    this.text = text;
    this.id = id;
    this.onClick = onClick;
    this.disabled = options.disabled || false;
    this.className = options.className || 'control-button';
  }
  
  render() {
    const button = document.createElement('button');
    button.id = this.id;
    button.className = this.className;
    button.textContent = this.text;
    
    if (this.disabled) {
      button.disabled = true;
    }
    
    button.addEventListener('click', this.onClick);
    
    return button;
  }
  
  // Method to disable the button
  disable() {
    this.disabled = true;
    const element = document.getElementById(this.id);
    if (element) {
      element.disabled = true;
    }
  }
  
  // Method to enable the button
  enable() {
    this.disabled = false;
    const element = document.getElementById(this.id);
    if (element) {
      element.disabled = false;
    }
  }
  
  // Method to update button text
  setText(text) {
    this.text = text;
    const element = document.getElementById(this.id);
    if (element) {
      element.textContent = text;
    }
  }
} 