// TicTacToe board component
import { TicTacToeCell } from './Cell.js';

export class TicTacToeBoard {
  constructor(onCellClick) {
    this.cells = Array(9).fill(null).map((_, index) => {
      return new TicTacToeCell(index, onCellClick);
    });
  }
  
  render() {
    const board = document.createElement('div');
    board.id = 'board';
    board.className = 'game-board';
    
    // Add cells to board
    this.cells.forEach(cell => {
      board.appendChild(cell.render());
    });
    
    return board;
  }
  
  update(boardState) {
    boardState.forEach((value, index) => {
      this.cells[index].update(value);
    });
  }
} 