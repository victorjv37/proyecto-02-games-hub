import './style.css'

document.querySelector('#app').innerHTML = `
  <div class="container">
    <header>
      <h1>Games Hub</h1>
      <nav>
        <ul>
          <li><a href="/" class="active">Home</a></li>
          <li><a href="/src/games/tictactoe/tictactoe.html">Tic Tac Toe</a></li>
          <li><a href="/src/games/memory/memory.html">Memory Game</a></li>
          <li><a href="/src/games/snake/snake.html">Snake</a></li>
        </ul>
      </nav>
    </header>
    <main>
      <div class="welcome-section">
        <h2>Welcome to Games Hub!</h2>
        <p>Choose a game from below to start playing.</p>
      </div>
      <div class="games-grid">
        <div class="game-card">
          <h3>Tic Tac Toe</h3>
          <p>Classic X's and O's game. Challenge your friends or play against the computer!</p>
          <a href="/src/games/tictactoe/tictactoe.html" class="play-button">Play Now</a>
        </div>
        <div class="game-card">
          <h3>Memory Game</h3>
          <p>Test your memory by matching pairs of cards. How fast can you complete it?</p>
          <a href="/src/games/memory/memory.html" class="play-button">Play Now</a>
        </div>
        <div class="game-card">
          <h3>Snake</h3>
          <p>Classic snake game with modern controls. Try to beat your high score!</p>
          <a href="/src/games/snake/snake.html" class="play-button">Play Now</a>
        </div>
        <div class="game-card">
          <h3>OTRO</h3>
          <p>A new exciting game is under development. Stay tuned for updates!</p>
          <a href="#" class="play-button">Play Now</a>
        </div>
      </div>
    </main>
  </div>
`

// Handle navigation
document.querySelectorAll('nav a, .play-button').forEach(link => {
  link.addEventListener('click', (e) => {
    e.preventDefault();
    const path = e.target.getAttribute('href');
    
    // Update active state in navigation
    document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
    const navLink = document.querySelector(`nav a[href="${path}"]`);
    if (navLink) navLink.classList.add('active');
    
    // Navigate to the selected page
    window.location.href = path;
  });
});
