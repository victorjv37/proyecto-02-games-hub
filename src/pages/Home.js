// Home page with game cards
import { BasePage } from '../components/common/BasePage.js';
import { GameCard } from '../components/common/GameCard.js';

export class HomePage extends BasePage {
  constructor() {
    super('Games Hub');
  }
  
  renderContent() {
    const main = document.createElement('main');
    
    const gamesGrid = document.createElement('div');
    gamesGrid.className = 'games-grid';
    
    // Create game cards
    const ticTacToeCard = new GameCard(
      'Tres en Raya',
      'Si no conoces este juego... en fin, te dejo el link para que puedas jugar',
      '/tictactoe',
      'top-left'
    );
    
    const memoryCard = new GameCard(
      'Memory',
      'Encontrar parejas, fácil, no?',
      '/memory',
      'top-right'
    );
    
    const snakeCard = new GameCard(
      'Snake',
      'El Snake de toda la vida, a ver cuanto duras.',
      '/snake',
      'bottom-left'
    );
    
    const asteroidsCard = new GameCard(
      'Asteroid DESTROYER!!!',
      'Me emocioné con el titulo',
      '/asteroids',
      'bottom-right'
    );
    
    // Append cards to grid
    gamesGrid.appendChild(ticTacToeCard.render());
    gamesGrid.appendChild(memoryCard.render());
    gamesGrid.appendChild(snakeCard.render());
    gamesGrid.appendChild(asteroidsCard.render());
    
    main.appendChild(gamesGrid);
    
    return main;
  }
  
  afterRender() {
    super.afterRender();
    // Create and position GIFs on the page
    setTimeout(() => {
      if (window.createDecorativeGifs) {
        window.createDecorativeGifs();
      }
    }, 100);
  }
} 