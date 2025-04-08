// Asteroids game page
import { BasePage } from '../components/common/BasePage.js';
import { StatCard } from '../components/common/StatCard.js';
import { ControlButton } from '../components/common/ControlButton.js';
import { AsteroidsLogic } from '../components/games/Asteroids/GameLogic.js';

export class AsteroidsPage extends BasePage {
  constructor() {
    super('Asteroids');
    
    // Game components
    this.scoreCard = new StatCard('Score', 'score', '0');
    this.bestScoreCard = new StatCard('Best Score', 'best-score', '0');
    this.startButton = null;
    this.pauseButton = null;
    this.restartButton = null;
    this.gameOverDiv = null;
    this.finalScoreSpan = null;
    this.mobileControls = null;
    
    // Canvas elements
    this.canvasContainer = null;
    this.canvas = null;
    this.activeBackground = null;
    this.pausedBackground = null;
    
    // The game instance will be created in afterRender
    this.game = null;
    
    // For keyboard event handling
    this.handleKeyDown = this.handleKeyDown.bind(this);
    this.handleKeyUp = this.handleKeyUp.bind(this);
  }
  
  renderContent() {
    const main = document.createElement('main');
    main.className = 'game-container';
    
    // Create stats display
    const statsContainer = document.createElement('div');
    statsContainer.className = 'game-stats';
    statsContainer.appendChild(this.scoreCard.render());
    statsContainer.appendChild(this.bestScoreCard.render());
    
    // Create canvas container
    this.canvasContainer = document.createElement('div');
    this.canvasContainer.className = 'game-canvas-container';
    
    // Create background images
    this.activeBackground = document.createElement('img');
    this.activeBackground.src = 'https://i.gifer.com/origin/d2/d2faff75e02534a3c687da2b7c4a95ab_w200.webp';
    this.activeBackground.className = 'animated-background hidden';
    this.activeBackground.id = 'active-background';
    
    this.pausedBackground = document.createElement('img');
    this.pausedBackground.src = 'https://i.gifer.com/origin/8a/8a39cf9d423e06c17971bf3cbf288b0d_w200.webp';
    this.pausedBackground.className = 'animated-background visible';
    this.pausedBackground.id = 'paused-background';
    
    // Create canvas element
    this.canvas = document.createElement('canvas');
    this.canvas.id = 'game-board';
    this.canvas.className = 'game-board';
    
    // Add elements to canvas container
    this.canvasContainer.appendChild(this.activeBackground);
    this.canvasContainer.appendChild(this.pausedBackground);
    this.canvasContainer.appendChild(this.canvas);
    
    // Create mobile controls
    this.mobileControls = document.createElement('div');
    this.mobileControls.className = 'mobile-controls';
    
    const leftButton = document.createElement('button');
    leftButton.id = 'left-button';
    leftButton.className = 'control-button';
    leftButton.textContent = '←';
    
    const fireButton = document.createElement('button');
    fireButton.id = 'fire-button';
    fireButton.className = 'control-button';
    fireButton.textContent = '🔫';
    
    const rightButton = document.createElement('button');
    rightButton.id = 'right-button';
    rightButton.className = 'control-button';
    rightButton.textContent = '→';
    
    this.mobileControls.appendChild(leftButton);
    this.mobileControls.appendChild(fireButton);
    this.mobileControls.appendChild(rightButton);
    
    // Create game controls
    const controlsContainer = document.createElement('div');
    controlsContainer.className = 'controls';
    
    this.startButton = new ControlButton('Start Game', 'start-button', () => this.startGame());
    this.pauseButton = new ControlButton('Pause', 'pause-button', () => this.togglePause(), { disabled: true });
    
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
    
    this.finalScoreSpan = document.createElement('span');
    this.finalScoreSpan.id = 'final-score';
    this.gameOverDiv.querySelector('p').appendChild(this.finalScoreSpan);
    
    // Add everything to the main container
    main.appendChild(statsContainer);
    main.appendChild(this.canvasContainer);
    main.appendChild(this.mobileControls);
    main.appendChild(controlsContainer);
    main.appendChild(this.gameOverDiv);
    
    return main;
  }
  
  // Game control methods
  startGame() {
    this.game.start();
    this.startButton.setText('Restart');
    this.pauseButton.enable();
    this.updateBackgroundVisibility();
  }
  
  togglePause() {
    if (this.game.isPaused) {
      this.game.resume();
      this.pauseButton.setText('Resume');
    } else {
      this.game.pause();
      this.pauseButton.setText('Pause');
    }
    
    this.updateBackgroundVisibility();
  }
  
  restartGame() {
    this.game.reset();
    this.gameOverDiv.classList.remove('visible');
    this.game.start();
    this.startButton.setText('Restart');
    this.pauseButton.enable();
    this.pauseButton.setText('Pause');
    this.updateBackgroundVisibility();
  }
  
  updateBackgroundVisibility() {
    if (this.game.isPaused || this.game.showStartScreen) {
      this.activeBackground.classList.add('hidden');
      this.activeBackground.classList.remove('visible');
      this.pausedBackground.classList.add('visible');
      this.pausedBackground.classList.remove('hidden');
    } else {
      this.activeBackground.classList.add('visible');
      this.activeBackground.classList.remove('hidden');
      this.pausedBackground.classList.add('hidden');
      this.pausedBackground.classList.remove('visible');
    }
  }
  
  // Event handlers
  handleKeyDown(e) {
    // Prevent default behavior for game controls
    if (['ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
      e.preventDefault();
    }
    
    if (this.game.showStartScreen && e.key === ' ') {
      // Start the game when pressing space on the start screen
      this.startGame();
      return;
    }
    
    // Only process controls if the game is running and not paused or over
    if (!this.game.gameLoop || this.game.isPaused || this.game.isGameOver) {
      return;
    }
    
    switch(e.key) {
      case 'ArrowLeft':
        this.game.moveLeft();
        break;
      case 'ArrowRight':
        this.game.moveRight();
        break;
      case ' ':
        this.game.shoot();
        break;
    }
  }
  
  handleKeyUp(e) {
    // Prevent default behavior for game controls
    if (['ArrowLeft', 'ArrowRight'].includes(e.key)) {
      e.preventDefault();
    }
    
    if (!this.game.gameLoop || this.game.isPaused || this.game.isGameOver) {
      return;
    }
    
    switch(e.key) {
      case 'ArrowLeft':
      case 'ArrowRight':
        this.game.stopMoving();
        break;
    }
  }
  
  setupMobileControls() {
    const leftButton = document.getElementById('left-button');
    const rightButton = document.getElementById('right-button');
    const fireButton = document.getElementById('fire-button');
    
    // Left button controls
    leftButton.addEventListener('mousedown', (e) => {
      e.preventDefault();
      this.game.moveLeft();
    });
    leftButton.addEventListener('mouseup', (e) => {
      e.preventDefault();
      this.game.stopMoving();
    });
    leftButton.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.game.moveLeft();
    });
    leftButton.addEventListener('touchend', (e) => {
      e.preventDefault();
      this.game.stopMoving();
    });
    
    // Right button controls
    rightButton.addEventListener('mousedown', (e) => {
      e.preventDefault();
      this.game.moveRight();
    });
    rightButton.addEventListener('mouseup', (e) => {
      e.preventDefault();
      this.game.stopMoving();
    });
    rightButton.addEventListener('touchstart', (e) => {
      e.preventDefault();
      this.game.moveRight();
    });
    rightButton.addEventListener('touchend', (e) => {
      e.preventDefault();
      this.game.stopMoving();
    });
    
    // Fire button controls
    fireButton.addEventListener('click', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!this.game.showStartScreen && !this.game.isGameOver && this.game.gameLoop) {
        this.game.shoot();
      }
    });
    
    fireButton.addEventListener('mousedown', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!this.game.showStartScreen && !this.game.isGameOver && this.game.gameLoop) {
        this.game.shoot();
      }
    });
    
    fireButton.addEventListener('touchstart', (e) => {
      e.preventDefault();
      e.stopPropagation();
      if (!this.game.showStartScreen && !this.game.isGameOver && this.game.gameLoop) {
        this.game.shoot();
      }
    });
  }
  
  afterRender() {
    super.afterRender();
    
    // Create game instance
    try {
      this.game = new AsteroidsLogic(this.canvas);
      
      // Set up game event handlers
      this.game.onScoreUpdate = (score, bestScore) => {
        this.scoreCard.setValue(score);
        this.bestScoreCard.setValue(bestScore);
      };
      
      this.game.onGameStart = () => {
        this.startButton.setText('Restart');
        this.pauseButton.enable();
      };
      
      this.game.onGamePause = () => {
        this.pauseButton.setText('Resume');
      };
      
      this.game.onGameResume = () => {
        this.pauseButton.setText('Pause');
      };
      
      this.game.onGameOver = (score) => {
        this.finalScoreSpan.textContent = score;
        this.gameOverDiv.classList.add('visible');
      };
      
      // Initialize score display
      this.scoreCard.setValue('0');
      this.bestScoreCard.setValue(this.game.scores.bestScore);
      
      // Set up keyboard controls
      document.addEventListener('keydown', this.handleKeyDown);
      document.addEventListener('keyup', this.handleKeyUp);
      
      // Set up mobile controls
      this.setupMobileControls();
      
      // Do initial draw
      this.game.draw();
      
      // Update background visibility
      this.updateBackgroundVisibility();
      
      // Handle window resize
      window.addEventListener('resize', () => {
        this.game.handleResize();
      });
    } catch (error) {
      console.error('Error initializing Asteroids game:', error);
      this.startButton.setText('Error Loading Game');
      this.startButton.disable();
    }
    
    // Create GIFs
    setTimeout(() => {
      if (window.createDecorativeGifs) {
        window.createDecorativeGifs();
      }
    }, 100);
  }
  
  destroy() {
    // Clean up event listeners and game resources
    document.removeEventListener('keydown', this.handleKeyDown);
    document.removeEventListener('keyup', this.handleKeyUp);
    
    if (this.game) {
      this.game.destroy();
    }
  }
} 