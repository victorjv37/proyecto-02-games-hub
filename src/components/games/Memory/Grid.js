// Memory grid component
import { MemoryCard } from './Card.js';

export class MemoryGrid {
  constructor(onCardClick) {
    this.onCardClick = onCardClick;
    this.cardComponents = [];
  }
  
  render() {
    const gridElement = document.createElement('div');
    gridElement.id = 'cards-grid';
    gridElement.className = 'cards-grid';
    
    return gridElement;
  }
  
  // Initialize grid with cards
  initializeCards(cards) {
    const gridElement = document.getElementById('cards-grid');
    if (!gridElement) return;
    
    // Clear grid
    gridElement.innerHTML = '';
    
    // Create card components
    this.cardComponents = cards.map(card => {
      const cardComponent = new MemoryCard(card, this.onCardClick);
      gridElement.appendChild(cardComponent.render());
      return cardComponent;
    });
  }
  
  // Update existing cards
  updateCards(cards) {
    // Update each card component with its new state
    cards.forEach(card => {
      const cardComponent = this.cardComponents.find(c => c.id === card.id);
      if (cardComponent) {
        cardComponent.update(card);
      }
    });
  }
} 