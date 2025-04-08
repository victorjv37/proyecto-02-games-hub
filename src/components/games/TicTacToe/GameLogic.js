// TicTacToe game logic component
export class TicTacToeLogic {
  constructor() {
    this.board = Array(9).fill(null);
    this.currentPlayer = 'X';
    this.gameActive = true;
    this.winningCombinations = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
      [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
      [0, 4, 8], [2, 4, 6]             // Diagonals
    ];
    this.scores = JSON.parse(localStorage.getItem('tictactoeScores')) || { X: 0, O: 0 };
    
    // Event callbacks
    this.onBoardUpdate = null;
    this.onGameEnd = null;
    this.onScoreUpdate = null;
  }

  makeMove(index) {
    if (!this.gameActive || this.board[index] !== null) return false;
    
    this.board[index] = this.currentPlayer;
    
    // Notify about board update
    if (this.onBoardUpdate) {
      this.onBoardUpdate(this.board);
    }
    
    if (this.checkWin()) {
      this.scores[this.currentPlayer]++;
      localStorage.setItem('tictactoeScores', JSON.stringify(this.scores));
      this.gameActive = false;
      
      // Notify about game end (win)
      if (this.onGameEnd) {
        this.onGameEnd({ winner: this.currentPlayer, scores: this.scores });
      }
      
      // Notify about score update
      if (this.onScoreUpdate) {
        this.onScoreUpdate(this.scores);
      }
      
      return { winner: this.currentPlayer, scores: this.scores };
    }
    
    if (this.checkDraw()) {
      this.gameActive = false;
      
      // Notify about game end (draw)
      if (this.onGameEnd) {
        this.onGameEnd({ draw: true });
      }
      
      return { draw: true };
    }
    
    this.currentPlayer = this.currentPlayer === 'X' ? 'O' : 'X';
    
    // Notify about score update
    if (this.onScoreUpdate) {
      this.onScoreUpdate(this.scores);
    }
    
    return { scores: this.scores };
  }

  checkWin() {
    return this.winningCombinations.some(combination => {
      return combination.every(index => {
        return this.board[index] === this.currentPlayer;
      });
    });
  }

  checkDraw() {
    return this.board.every(cell => cell !== null);
  }

  resetGame() {
    this.board = Array(9).fill(null);
    this.currentPlayer = 'X';
    this.gameActive = true;
    
    // Notify about board update
    if (this.onBoardUpdate) {
      this.onBoardUpdate(this.board);
    }
  }

  getScores() {
    return this.scores;
  }
} 