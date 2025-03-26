export class SnakeGame {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.gridSize = 20;
    this.tileSize = this.canvas.width / this.gridSize;
    
    this.reset();
    this.loadScores();
  }

  reset() {
    this.snake = [
      { x: 10, y: 10 },
      { x: 9, y: 10 },
      { x: 8, y: 10 }
    ];
    this.direction = 'right';
    this.nextDirection = 'right';
    this.food = this.generateFood();
    this.score = 0;
    this.gameLoop = null;
    this.isPaused = false;
    this.isGameOver = false;
  }

  loadScores() {
    const savedScores = localStorage.getItem('snakeScores');
    this.scores = savedScores ? JSON.parse(savedScores) : { bestScore: 0 };
  }

  saveScores() {
    localStorage.setItem('snakeScores', JSON.stringify(this.scores));
  }

  generateFood() {
    let food;
    do {
      food = {
        x: Math.floor(Math.random() * this.gridSize),
        y: Math.floor(Math.random() * this.gridSize)
      };
    } while (this.snake.some(segment => segment.x === food.x && segment.y === food.y));
    return food;
  }

  start() {
    if (!this.gameLoop) {
      this.gameLoop = setInterval(() => this.update(), 150);
      this.draw();
    }
  }

  pause() {
    this.isPaused = true;
  }

  resume() {
    this.isPaused = false;
  }

  update() {
    if (this.isPaused || this.isGameOver) return;

    this.direction = this.nextDirection;
    const head = { ...this.snake[0] };

    switch (this.direction) {
      case 'up': head.y--; break;
      case 'down': head.y++; break;
      case 'left': head.x--; break;
      case 'right': head.x++; break;
    }

    // Check for collisions
    if (this.checkCollision(head)) {
      this.gameOver();
      return;
    }

    this.snake.unshift(head);

    // Check if food is eaten
    if (head.x === this.food.x && head.y === this.food.y) {
      this.score += 10;
      this.food = this.generateFood();
      if (this.onScoreUpdate) this.onScoreUpdate();
    } else {
      this.snake.pop();
    }

    this.draw();
  }

  checkCollision(head) {
    // Wall collision
    if (head.x < 0 || head.x >= this.gridSize || head.y < 0 || head.y >= this.gridSize) {
      return true;
    }

    // Self collision
    return this.snake.some(segment => segment.x === head.x && segment.y === head.y);
  }

  draw() {
    // Clear canvas
    this.ctx.fillStyle = '#1a1a1a';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

    // Draw snake
    this.ctx.fillStyle = '#646cff';
    this.snake.forEach((segment, index) => {
      this.ctx.fillRect(
        segment.x * this.tileSize,
        segment.y * this.tileSize,
        this.tileSize - 1,
        this.tileSize - 1
      );
    });

    // Draw food
    this.ctx.fillStyle = '#ff4444';
    this.ctx.fillRect(
      this.food.x * this.tileSize,
      this.food.y * this.tileSize,
      this.tileSize - 1,
      this.tileSize - 1
    );
  }

  changeDirection(newDirection) {
    const opposites = {
      'up': 'down',
      'down': 'up',
      'left': 'right',
      'right': 'left'
    };

    if (opposites[newDirection] !== this.direction) {
      this.nextDirection = newDirection;
    }
  }

  gameOver() {
    this.isGameOver = true;
    clearInterval(this.gameLoop);
    this.gameLoop = null;

    if (this.score > this.scores.bestScore) {
      this.scores.bestScore = this.score;
      this.saveScores();
    }

    if (this.onGameOver) {
      this.onGameOver(this.score);
    }
  }
} 