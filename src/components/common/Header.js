// Header component for all pages
export class Header {
  constructor(title) {
    this.title = title;
  }
  
  render() {
    const header = document.createElement('header');
    header.className = 'fixed-header';
    
    header.innerHTML = `
      <h1>${this.title}</h1>
      <nav>
        <ul>
          <li><a href="/">Home</a></li>
          <li><a href="/tictactoe">Tic Tac Toe</a></li>
          <li><a href="/memory">Memory Game</a></li>
          <li><a href="/snake">Snake</a></li>
          <li><a href="/asteroids">Asteroids</a></li>
        </ul>
      </nav>
    `;
    
    return header;
  }
} 