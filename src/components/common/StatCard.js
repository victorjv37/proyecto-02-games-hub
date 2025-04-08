// Reusable stat card component for game statistics
export class StatCard {
  constructor(title, id, initialValue = '0') {
    this.title = title;
    this.id = id;
    this.value = initialValue;
  }
  
  render() {
    const card = document.createElement('div');
    card.className = 'stat-card';
    
    card.innerHTML = `
      <h3>${this.title}</h3>
      <p id="${this.id}">${this.value}</p>
    `;
    
    return card;
  }
  
  // Method to update the value
  setValue(newValue) {
    this.value = newValue;
    const element = document.getElementById(this.id);
    if (element) {
      element.textContent = newValue;
    }
  }
} 