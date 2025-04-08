// Game card component for home page
export class GameCard {
  constructor(title, description, path, position) {
    this.title = title;
    this.description = description;
    this.path = path;
    this.position = position; // 'top-left', 'top-right', 'bottom-left', 'bottom-right'
  }
  
  render() {
    const card = document.createElement('div');
    card.className = `game-card ${this.position}`;
    
    card.innerHTML = `
      <h3>${this.title}</h3>
      <p>${this.description}</p>
      <a href="${this.path}" class="play-button">Jugar Ahora</a>
    `;
    
    // Make entire card clickable
    card.addEventListener('click', (e) => {
      // Only handle clicks on the card itself, not on its child elements
      if (e.target === card) {
        const playButton = card.querySelector('.play-button');
        if (playButton) {
          const gameUrl = playButton.getAttribute('href');
          if (gameUrl) {
            history.pushState({}, '', gameUrl);
            // Dispatch a custom event that the router can listen for
            window.dispatchEvent(new CustomEvent('navigate', { detail: { path: gameUrl } }));
          }
        }
      }
    });
    
    return card;
  }
} 