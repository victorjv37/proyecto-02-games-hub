// Snake game page
import { BasePage } from '../components/common/BasePage.js';
import { StatCard } from '../components/common/StatCard.js';
import { ControlButton } from '../components/common/ControlButton.js';
import { SnakeBoard } from '../components/games/Snake/Board.js';
import { SnakeLogic } from '../components/games/Snake/GameLogic.js';

export class SnakePage extends BasePage {
  constructor() {
    super('Snake');
    
    // Create game components
    this.game = new SnakeLogic();
    this.scoreCard = new StatCard('Score', 'score', '0');
    this.bestScoreCard = new StatCard('Best Score', 'best-score', '0');
    this.board = null;
    this.startButton = null;
    this.pauseButton = null;
    this.restartButton = null;
    this.gameOverDiv = null;
    this.finalScoreSpan = null;
    this.swipeInstruction = null;
    
    // Detect if we're on mobile
    this.isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
  }
  
  renderContent() {
    const main = document.createElement('main');
    main.className = 'game-container';
    
    // Create stats display
    const statsContainer = document.createElement('div');
    statsContainer.className = 'game-stats';
    statsContainer.appendChild(this.scoreCard.render());
    statsContainer.appendChild(this.bestScoreCard.render());
    
    // Create swipe instruction if on mobile
    this.swipeInstruction = document.createElement('p');
    this.swipeInstruction.id = 'swipe-instruction';
    this.swipeInstruction.className = 'swipe-instruction';
    this.swipeInstruction.textContent = 'Desliza el dedo para mover';
    if (!this.isMobile) {
      this.swipeInstruction.style.display = 'none';
    }
    
    // Create game board
    this.board = new SnakeBoard('game-board', this.game.gridSize);
    
    // Create game controls
    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'controls';
    
    this.startButton = new ControlButton('Start Game', 'start-button', () => this.startGame());
    this.pauseButton = new ControlButton('Pause', 'pause-button', () => this.togglePause());
    
    controlsContainer.appendChild(this.startButton.render());
    controlsContainer.appendChild(this.pauseButton.render());
    
    // Create game over overlay
    this.gameOverDiv = document.createElement('div');
    this.gameOverDiv.id = 'game-over';
    this.gameOverDiv.className = 'game-over';
    
    this.gameOverDiv.innerHTML = `
      <h2>Game Over!</h2>
      <p>Your score: <span id="final-score">0</span></p>
    `;
    
    this.restartButton = new ControlButton('Play Again', 'restart-button', () => this.restartGame());
    this.gameOverDiv.appendChild(this.restartButton.render());
    
    this.finalScoreSpan = this.gameOverDiv.querySelector('#final-score');
    
    // Add everything to the main container
    main.appendChild(statsContainer);
    main.appendChild(this.swipeInstruction);
    main.appendChild(this.board.render());
    main.appendChild(controlsContainer);
    main.appendChild(this.gameOverDiv);
    
    return main;
  }
  
  startGame() {
    this.game.start();
    this.startButton.disable();
  }
  
  togglePause() {
    if (this.game.isPaused) {
      this.game.resume();
      this.pauseButton.setText('Pause');
    } else {
      this.game.pause();
      this.pauseButton.setText('Resume');
    }
  }
  
  restartGame() {
    this.game.reset();
    this.gameOverDiv.classList.remove('visible');
    this.startButton.enable();
    this.pauseButton.setText('Pause');
  }
  
  afterRender() {
    super.afterRender();
    
    // Set up keyboard controls
    document.addEventListener('keydown', this.handleKeyDown.bind(this));
    
    // Set up board event handlers
    this.board.onSwipe = (direction) => {
      this.game.changeDirection(direction);
    };
    
    // Set up game event handlers
    this.game.onBoardUpdate = (snake, food) => {
      this.board.draw(snake, food);
    };
    
    this.game.onScoreUpdate = (score, bestScore) => {
      this.scoreCard.setValue(score);
      this.bestScoreCard.setValue(bestScore);
    };
    
    this.game.onGameOver = (score) => {
      this.finalScoreSpan.textContent = score;
      this.gameOverDiv.classList.add('visible');
      this.startButton.enable();
    };
    
    // Initialize board and scores
    this.scoreCard.setValue(this.game.score);
    this.bestScoreCard.setValue(this.game.scores.bestScore);
    this.board.draw(this.game.snake, this.game.food);
    
    // Create GIFs
    setTimeout(() => {
      if (window.createDecorativeGifs) {
        window.createDecorativeGifs();
      }
    }, 100);
  }
  
  handleKeyDown(e) {
    switch(e.key) {
      case 'ArrowLeft':
        this.game.changeDirection('left');
        break;
      case 'ArrowRight':
        this.game.changeDirection('right');
        break;
      case 'ArrowUp':
        this.game.changeDirection('up');
        break;
      case 'ArrowDown':
        this.game.changeDirection('down');
        break;
    }
  }
  
  destroy() {
    // Clean up event listeners and game loop
    document.removeEventListener('keydown', this.handleKeyDown);
    this.game.destroy();
    this.game.onBoardUpdate = null;
    this.game.onScoreUpdate = null;
    this.game.onGameOver = null;
    this.board.onSwipe = null;
  }
} 