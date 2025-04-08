// Snake game logic component
export class SnakeLogic {
  constructor() {
    this.gridSize = 20;
    this.reset();
    this.loadScores();
    
    // Event callbacks
    this.onBoardUpdate = null;
    this.onGameOver = null;
    this.onScoreUpdate = null;
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
    this.lastDirectionChange = Date.now();
    
    // Notify score update
    if (this.onScoreUpdate) {
      this.onScoreUpdate(this.score, this.scores.bestScore);
    }
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
      
      // Notify board update
      if (this.onBoardUpdate) {
        this.onBoardUpdate(this.snake, this.food);
      }
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
      
      // Notify score update
      if (this.onScoreUpdate) {
        this.onScoreUpdate(this.score, this.scores.bestScore);
      }
    } else {
      this.snake.pop();
    }

    // Notify board update
    if (this.onBoardUpdate) {
      this.onBoardUpdate(this.snake, this.food);
    }
  }

  checkCollision(head) {
    // Wall collision
    if (head.x < 0 || head.x >= this.gridSize || head.y < 0 || head.y >= this.gridSize) {
      return true;
    }

    // Self collision (skip the head/first element when checking)
    return this.snake.some((segment, index) => {
      // Skip the tail segment that will be removed (unless we've eaten food)
      if (index === this.snake.length - 1) return false;
      return segment.x === head.x && segment.y === head.y;
    });
  }

  changeDirection(newDirection) {
    const opposites = {
      'up': 'down',
      'down': 'up',
      'left': 'right',
      'right': 'left'
    };

    // Limit direction change frequency to 100ms to prevent accidental 180 degree turns
    const now = Date.now();
    if (now - this.lastDirectionChange < 100) {
      return;
    }
    
    if (opposites[newDirection] !== this.direction) {
      this.nextDirection = newDirection;
      this.lastDirectionChange = now;
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

    // Notify game over
    if (this.onGameOver) {
      this.onGameOver(this.score);
    }
  }
  
  destroy() {
    if (this.gameLoop) {
      clearInterval(this.gameLoop);
      this.gameLoop = null;
    }
  }
} 