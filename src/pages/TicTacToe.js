// TicTacToe game page
import { BasePage } from '../components/common/BasePage.js';
import { StatCard } from '../components/common/StatCard.js';
import { ControlButton } from '../components/common/ControlButton.js';
import { TicTacToeBoard } from '../components/games/TicTacToe/Board.js';
import { TicTacToeLogic } from '../components/games/TicTacToe/GameLogic.js';

export class TicTacToePage extends BasePage {
  constructor() {
    super('Tic Tac Toe');
    
    // Create game components
    this.game = new TicTacToeLogic();
    this.scoreX = new StatCard('Player X', 'score-x', '0');
    this.scoreO = new StatCard('Player O', 'score-o', '0');
    this.winnerMessage = document.createElement('div');
    this.resetButton = null;
    this.board = null;
  }
  
  renderContent() {
    const main = document.createElement('main');
    main.className = 'game-container';
    
    // Create score display
    const scoreContainer = document.createElement('div');
    scoreContainer.className = 'score';
    scoreContainer.appendChild(this.scoreX.render());
    scoreContainer.appendChild(this.scoreO.render());
    
    // Create winner message element
    this.winnerMessage.id = 'winner-message';
    this.winnerMessage.className = 'win-message';
    
    // Create board
    this.board = new TicTacToeBoard((index) => this.makeMove(index));
    
    // Create reset button
    this.resetButton = new ControlButton('Reset Game', 'reset-button', () => this.resetGame());
    
    // Add elements to main container
    main.appendChild(scoreContainer);
    main.appendChild(this.board.render());
    main.appendChild(this.winnerMessage);
    main.appendChild(this.resetButton.render());
    
    return main;
  }
  
  makeMove(index) {
    const result = this.game.makeMove(index);
    if (result) {
      // Board will be updated via the event handler
      
      if (result.winner) {
        this.winnerMessage.textContent = `Player ${result.winner} wins!`;
      } else if (result.draw) {
        this.winnerMessage.textContent = "It's a draw!";
      }
    }
  }
  
  resetGame() {
    this.game.resetGame();
    this.winnerMessage.textContent = '';
  }
  
  afterRender() {
    super.afterRender();
    
    // Set up event handlers
    this.game.onBoardUpdate = (boardState) => {
      this.board.update(boardState);
    };
    
    this.game.onScoreUpdate = (scores) => {
      this.scoreX.setValue(scores.X);
      this.scoreO.setValue(scores.O);
    };
    
    // Initialize scores
    const scores = this.game.getScores();
    this.scoreX.setValue(scores.X);
    this.scoreO.setValue(scores.O);
    
    // Create GIFs
    setTimeout(() => {
      if (window.createDecorativeGifs) {
        window.createDecorativeGifs();
      }
    }, 100);
  }
  
  destroy() {
    // Clean up any resources or event listeners
    this.game.onBoardUpdate = null;
    this.game.onScoreUpdate = null;
  }
} 