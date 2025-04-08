// Memory card component
export class MemoryCard {
  constructor(card, onClick) {
    this.id = card.id;
    this.iconPath = card.iconPath;
    this.isFlipped = card.isFlipped;
    this.isMatched = card.isMatched;
    this.onClick = onClick;
  }
  
  render() {
    const cardElement = document.createElement('div');
    cardElement.className = 'memory-card';
    if (this.isFlipped) cardElement.classList.add('flipped');
    if (this.isMatched) cardElement.classList.add('matched');
    
    // Create front side (icon)
    const cardFront = document.createElement('div');
    cardFront.className = 'card-front';
    
    if (this.isFlipped || this.isMatched) {
      const iconImg = document.createElement('img');
      iconImg.src = this.iconPath;
      iconImg.alt = 'Retro game icon';
      iconImg.className = 'card-icon';
      cardFront.appendChild(iconImg);
    }
    
    // Create back side (question mark)
    const cardBack = document.createElement('div');
    cardBack.className = 'card-back';
    cardBack.textContent = '?';
    
    // Add front and back to the card
    cardElement.appendChild(cardFront);
    cardElement.appendChild(cardBack);
    
    // Add click handler
    cardElement.addEventListener('click', () => {
      this.onClick(this.id);
    });
    
    return cardElement;
  }
  
  // Update card state
  update(newState) {
    this.isFlipped = newState.isFlipped;
    this.isMatched = newState.isMatched;
    
    // Find card element and update classes
    const cardElement = document.querySelector(`.memory-card:nth-child(${this.id + 1})`);
    if (cardElement) {
      // Update classes
      cardElement.classList.toggle('flipped', this.isFlipped);
      cardElement.classList.toggle('matched', this.isMatched);
      
      // Update front image if needed
      const cardFront = cardElement.querySelector('.card-front');
      if (cardFront) {
        if (this.isFlipped || this.isMatched) {
          if (!cardFront.querySelector('img')) {
            const iconImg = document.createElement('img');
            iconImg.src = this.iconPath;
            iconImg.alt = 'Retro game icon';
            iconImg.className = 'card-icon';
            cardFront.appendChild(iconImg);
          }
        } else {
          // Remove image when card is flipped back
          const img = cardFront.querySelector('img');
          if (img) {
            cardFront.removeChild(img);
          }
        }
      }
    }
  }
} 