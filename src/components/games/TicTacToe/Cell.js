// TicTacToe cell component
export class TicTacToeCell {
  constructor(index, onClick) {
    this.index = index;
    this.onClick = onClick;
    this.value = null;
  }
  
  render() {
    const cell = document.createElement('div');
    cell.className = 'cell';
    
    cell.addEventListener('click', () => {
      this.onClick(this.index);
    });
    
    return cell;
  }
  
  update(value) {
    this.value = value;
    const cellElement = document.querySelector(`.cell:nth-child(${this.index + 1})`);
    if (cellElement) {
      cellElement.textContent = value || '';
      
      // Reset classes
      cellElement.classList.remove('x', 'o');
      
      // Add class based on value
      if (value === 'X') {
        cellElement.classList.add('x');
      } else if (value === 'O') {
        cellElement.classList.add('o');
      }
    }
  }
} 