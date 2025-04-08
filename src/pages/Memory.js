// Memory game page
import { BasePage } from '../components/common/BasePage.js';
import { StatCard } from '../components/common/StatCard.js';
import { ControlButton } from '../components/common/ControlButton.js';
import { MemoryGrid } from '../components/games/Memory/Grid.js';
import { MemoryLogic } from '../components/games/Memory/GameLogic.js';

export class MemoryPage extends BasePage {
  constructor() {
    super('Memory Game');
    
    // Create game components
    this.game = new MemoryLogic();
    this.movesCard = new StatCard('Moves', 'moves', '0');
    this.bestScoreCard = new StatCard('Best Score', 'best-score', '-');
    this.grid = null;
    this.resetButton = null;
    this.winMessage = null;
  }
  
  renderContent() {
    const main = document.createElement('main');
    main.className = 'game-container';
    
    // Create stats display
    const statsContainer = document.createElement('div');
    statsContainer.className = 'game-stats';
    statsContainer.appendChild(this.movesCard.render());
    statsContainer.appendChild(this.bestScoreCard.render());
    
    // Create card grid
    this.grid = new MemoryGrid((cardId) => this.flipCard(cardId));
    
    // Create win message element
    this.winMessage = document.createElement('div');
    this.winMessage.id = 'win-message';
    this.winMessage.className = 'win-message';
    
    // Create reset button
    this.resetButton = new ControlButton('Reset Game', 'reset-button', () => this.resetGame());
    
    // Add elements to main container
    main.appendChild(statsContainer);
    main.appendChild(this.grid.render());
    main.appendChild(this.winMessage);
    main.appendChild(this.resetButton.render());
    
    return main;
  }
  
  flipCard(cardId) {
    const result = this.game.flipCard(cardId);
    if (result && result.status === 'win') {
      this.winMessage.textContent = `Congratulations! You won in ${result.moves} moves!`;
    }
  }
  
  resetGame() {
    this.game.resetGame();
    this.winMessage.textContent = '';
  }
  
  afterRender() {
    super.afterRender();
    
    // Set up event handlers
    this.game.onCardUpdate = (cards) => {
      // Initialize grid on first update, then just update
      if (this.grid.cardComponents.length === 0) {
        this.grid.initializeCards(cards);
      } else {
        this.grid.updateCards(cards);
      }
    };
    
    this.game.onScoreUpdate = (moves, bestMoves) => {
      this.movesCard.setValue(moves);
      this.bestScoreCard.setValue(bestMoves === Infinity ? '-' : bestMoves);
    };
    
    this.game.onGameWin = (moves) => {
      this.winMessage.textContent = `Congratulations! You won in ${moves} moves!`;
    };
    
    // Initialize stats
    const scores = this.game.getScores();
    this.bestScoreCard.setValue(scores.bestMoves === Infinity ? '-' : scores.bestMoves);
    
    // Create GIFs
    setTimeout(() => {
      if (window.createDecorativeGifs) {
        window.createDecorativeGifs();
      }
    }, 100);
  }
  
  destroy() {
    // Clean up event handlers
    this.game.onCardUpdate = null;
    this.game.onScoreUpdate = null;
    this.game.onGameWin = null;
  }
} 