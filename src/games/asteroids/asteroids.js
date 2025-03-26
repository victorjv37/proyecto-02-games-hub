export class AsteroidsGame {
  constructor(canvasId) {
    this.canvas = document.getElementById(canvasId);
    this.ctx = this.canvas.getContext('2d');
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    
    // Game state
    this.score = 0;
    this.lives = 3;
    this.level = 1;
    this.asteroids = [];
    this.bullets = [];
    this.gameLoop = null;
    this.isPaused = false;
    this.isGameOver = false;
    
    // Load ship image
    this.shipImage = new Image();
    this.shipImage.src = 'https://i.gifer.com/1pIq.gif';
    this.shipImageLoaded = false;
    this.shipImage.onload = () => {
      this.shipImageLoaded = true;
    };
    
    // Ship properties
    this.ship = {
      x: this.width / 2,
      y: this.height / 2,
      radius: 15,
      angle: 0,
      rotation: 0,
      thrusting: false,
      thrust: {
        x: 0,
        y: 0
      },
      invulnerable: false,
      width: 40,  // Width of ship image
      height: 40  // Height of ship image
    };
    
    this.loadScores();
  }
  
  loadScores() {
    const savedScores = localStorage.getItem('asteroidsScores');
    this.scores = savedScores ? JSON.parse(savedScores) : { bestScore: 0 };
  }
  
  saveScores() {
    localStorage.setItem('asteroidsScores', JSON.stringify(this.scores));
  }
  
  start() {
    if (!this.gameLoop) {
      this.initializeAsteroids();
      this.gameLoop = setInterval(() => this.update(), 1000 / 60); // 60 FPS
      this.draw();
    }
  }
  
  pause() {
    this.isPaused = true;
  }
  
  resume() {
    this.isPaused = false;
  }
  
  reset() {
    clearInterval(this.gameLoop);
    this.gameLoop = null;
    this.score = 0;
    this.lives = 3;
    this.level = 1;
    this.asteroids = [];
    this.bullets = [];
    this.isPaused = false;
    this.isGameOver = false;
    
    this.ship = {
      x: this.width / 2,
      y: this.height / 2,
      radius: 15,
      angle: 0,
      rotation: 0,
      thrusting: false,
      thrust: {
        x: 0,
        y: 0
      },
      invulnerable: false,
      width: 40,  // Width of ship image
      height: 40  // Height of ship image
    };
    
    this.draw();
  }
  
  initializeAsteroids() {
    const numAsteroids = 3 + (this.level - 1) * 2;
    this.asteroids = [];
    
    for (let i = 0; i < numAsteroids; i++) {
      this.createAsteroid();
    }
  }
  
  createAsteroid(x, y, size = 'large') {
    // Define asteroid sizes and scores
    const sizes = {
      large: { radius: 40, score: 20 },
      medium: { radius: 25, score: 50 },
      small: { radius: 15, score: 100 }
    };
    
    // Random position if not specified
    let posX = x;
    let posY = y;
    
    if (posX === undefined || posY === undefined) {
      // Make sure asteroids don't spawn too close to the ship
      const safeDistance = 100;
      let validPos = false;
      
      while (!validPos) {
        posX = Math.random() * this.width;
        posY = Math.random() * this.height;
        
        const distanceToShip = Math.sqrt(
          Math.pow(posX - this.ship.x, 2) + 
          Math.pow(posY - this.ship.y, 2)
        );
        
        if (distanceToShip > safeDistance) {
          validPos = true;
        }
      }
    }
    
    // Create the asteroid
    this.asteroids.push({
      x: posX,
      y: posY,
      xVelocity: (Math.random() * 2 - 1) * (4 - sizes[size].radius / 20),
      yVelocity: (Math.random() * 2 - 1) * (4 - sizes[size].radius / 20),
      radius: sizes[size].radius,
      angle: Math.random() * Math.PI * 2,
      vertices: Math.floor(Math.random() * 4) + 7, // 7-10 vertices
      jaggedness: 0.4, // how jagged the asteroid looks
      size: size,
      scoreValue: sizes[size].score
    });
  }
  
  shoot() {
    // Create a bullet
    const bulletSpeed = 7;
    const angle = this.ship.angle;
    
    // Calculate bullet starting position from the front of the ship
    const bulletOffsetFromShip = this.ship.radius + 5; // Offset from ship center
    
    this.bullets.push({
      x: this.ship.x + Math.cos(angle) * bulletOffsetFromShip,
      y: this.ship.y - Math.sin(angle) * bulletOffsetFromShip,
      xVelocity: bulletSpeed * Math.cos(angle),
      yVelocity: -bulletSpeed * Math.sin(angle),
      radius: 2,
      lifespan: 60 // frames
    });
  }
  
  update() {
    if (this.isPaused || this.isGameOver) return;
    
    // Update ship position and rotation
    this.updateShip();
    
    // Update bullets
    this.updateBullets();
    
    // Update asteroids
    this.updateAsteroids();
    
    // Check collisions
    this.checkCollisions();
    
    // Check if level is completed
    if (this.asteroids.length === 0) {
      this.level++;
      this.initializeAsteroids();
    }
    
    // Draw everything
    this.draw();
  }
  
  updateShip() {
    // Rotate ship
    this.ship.angle += this.ship.rotation;
    
    // Apply thrust
    if (this.ship.thrusting) {
      const thrustX = 0.1 * Math.cos(this.ship.angle);
      const thrustY = -0.1 * Math.sin(this.ship.angle);
      
      this.ship.thrust.x += thrustX;
      this.ship.thrust.y += thrustY;
      
      // Limit thrust
      const maxThrust = 4;
      const currentThrust = Math.sqrt(
        Math.pow(this.ship.thrust.x, 2) + 
        Math.pow(this.ship.thrust.y, 2)
      );
      
      if (currentThrust > maxThrust) {
        this.ship.thrust.x = (this.ship.thrust.x / currentThrust) * maxThrust;
        this.ship.thrust.y = (this.ship.thrust.y / currentThrust) * maxThrust;
      }
    } else {
      // Apply friction
      this.ship.thrust.x *= 0.98;
      this.ship.thrust.y *= 0.98;
    }
    
    // Update ship position
    this.ship.x += this.ship.thrust.x;
    this.ship.y += this.ship.thrust.y;
    
    // Wrap around the screen edges
    this.wrapAround(this.ship);
  }
  
  updateBullets() {
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      // Update bullet position
      this.bullets[i].x += this.bullets[i].xVelocity;
      this.bullets[i].y += this.bullets[i].yVelocity;
      
      // Wrap around screen edges
      this.wrapAround(this.bullets[i]);
      
      // Reduce bullet lifespan
      this.bullets[i].lifespan--;
      
      // Remove bullets that have expired
      if (this.bullets[i].lifespan <= 0) {
        this.bullets.splice(i, 1);
      }
    }
  }
  
  updateAsteroids() {
    for (let i = this.asteroids.length - 1; i >= 0; i--) {
      // Update asteroid position
      this.asteroids[i].x += this.asteroids[i].xVelocity;
      this.asteroids[i].y += this.asteroids[i].yVelocity;
      
      // Wrap around screen edges
      this.wrapAround(this.asteroids[i]);
    }
  }
  
  wrapAround(object) {
    // Wrap horizontally
    if (object.x < 0 - object.radius) {
      object.x = this.width + object.radius;
    } else if (object.x > this.width + object.radius) {
      object.x = 0 - object.radius;
    }
    
    // Wrap vertically
    if (object.y < 0 - object.radius) {
      object.y = this.height + object.radius;
    } else if (object.y > this.height + object.radius) {
      object.y = 0 - object.radius;
    }
  }
  
  checkCollisions() {
    // Check bullet-asteroid collisions
    for (let i = this.asteroids.length - 1; i >= 0; i--) {
      for (let j = this.bullets.length - 1; j >= 0; j--) {
        const asteroid = this.asteroids[i];
        const bullet = this.bullets[j];
        
        const distance = Math.sqrt(
          Math.pow(asteroid.x - bullet.x, 2) + 
          Math.pow(asteroid.y - bullet.y, 2)
        );
        
        if (distance < asteroid.radius + bullet.radius) {
          // Remove bullet
          this.bullets.splice(j, 1);
          
          // Score points
          this.score += asteroid.scoreValue;
          if (this.onScoreUpdate) this.onScoreUpdate();
          
          // Break asteroid into smaller pieces
          this.breakAsteroid(i);
          
          // Break out of bullet loop since this bullet is gone
          break;
        }
      }
    }
    
    // Check ship-asteroid collisions (if ship is not invulnerable)
    if (!this.ship.invulnerable) {
      for (let i = this.asteroids.length - 1; i >= 0; i--) {
        const asteroid = this.asteroids[i];
        
        const distance = Math.sqrt(
          Math.pow(asteroid.x - this.ship.x, 2) + 
          Math.pow(asteroid.y - this.ship.y, 2)
        );
        
        // Use a slightly smaller collision radius than visual radius for better gameplay
        const shipCollisionRadius = this.ship.radius * 0.7;
        
        if (distance < asteroid.radius + shipCollisionRadius) {
          this.lives--;
          if (this.onScoreUpdate) this.onScoreUpdate();
          
          if (this.lives <= 0) {
            this.gameOver();
          } else {
            this.resetShip();
          }
          
          break;
        }
      }
    }
  }
  
  breakAsteroid(index) {
    const asteroid = this.asteroids[index];
    
    // Split asteroid based on size
    if (asteroid.size === 'large') {
      // Create 2 medium asteroids
      for (let i = 0; i < 2; i++) {
        this.createAsteroid(asteroid.x, asteroid.y, 'medium');
      }
    } else if (asteroid.size === 'medium') {
      // Create 2 small asteroids
      for (let i = 0; i < 2; i++) {
        this.createAsteroid(asteroid.x, asteroid.y, 'small');
      }
    }
    
    // Remove original asteroid
    this.asteroids.splice(index, 1);
  }
  
  resetShip() {
    this.ship.x = this.width / 2;
    this.ship.y = this.height / 2;
    this.ship.thrust = { x: 0, y: 0 };
    this.ship.angle = 0;
    this.ship.invulnerable = true;
    
    // Reset invulnerability after 3 seconds
    setTimeout(() => {
      this.ship.invulnerable = false;
    }, 3000);
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
  
  draw() {
    // Clear canvas
    this.ctx.fillStyle = '#111';
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    // Draw ship
    this.drawShip();
    
    // Draw bullets
    this.drawBullets();
    
    // Draw asteroids
    this.drawAsteroids();
  }
  
  drawShip() {
    if (this.ship.invulnerable && Math.floor(Date.now() / 100) % 2 === 0) {
      return; // Skip drawing to create blinking effect
    }
    
    this.ctx.save();
    this.ctx.translate(this.ship.x, this.ship.y);
    this.ctx.rotate(this.ship.angle);
    
    // Draw ship using the loaded image
    if (this.shipImageLoaded) {
      // Add glow effect when thrusting
      if (this.ship.thrusting) {
        this.ctx.shadowColor = '#00f2ff';
        this.ctx.shadowBlur = 15;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
      }
      
      // Draw the ship image centered on the ship's position
      this.ctx.drawImage(
        this.shipImage, 
        -this.ship.width / 2, 
        -this.ship.height / 2, 
        this.ship.width, 
        this.ship.height
      );
    } else {
      // Fallback to drawing a simple triangle if image is not loaded
      this.ctx.strokeStyle = '#00f2ff';
      this.ctx.lineWidth = 2;
      this.ctx.beginPath();
      this.ctx.moveTo(this.ship.radius, 0);
      this.ctx.lineTo(-this.ship.radius, -this.ship.radius / 2);
      this.ctx.lineTo(-this.ship.radius, this.ship.radius / 2);
      this.ctx.closePath();
      this.ctx.stroke();
      
      // Draw thrust if thrusting (only for fallback triangle)
      if (this.ship.thrusting) {
        this.ctx.beginPath();
        this.ctx.moveTo(-this.ship.radius, 0);
        this.ctx.lineTo(-this.ship.radius - 10, 0);
        this.ctx.strokeStyle = '#ff4081';
        this.ctx.stroke();
      }
    }
    
    this.ctx.restore();
  }
  
  drawBullets() {
    this.ctx.fillStyle = '#ff4081';
    
    this.bullets.forEach(bullet => {
      this.ctx.beginPath();
      this.ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
      this.ctx.fill();
    });
  }
  
  drawAsteroids() {
    this.ctx.strokeStyle = '#00f2ff';
    this.ctx.lineWidth = 2;
    
    this.asteroids.forEach(asteroid => {
      this.ctx.beginPath();
      
      // Draw a jagged circle for the asteroid
      for (let i = 0; i < asteroid.vertices; i++) {
        const angle = (i / asteroid.vertices) * Math.PI * 2;
        const jitter = 1 - (Math.random() * asteroid.jaggedness);
        const radius = asteroid.radius * jitter;
        
        const x = asteroid.x + Math.cos(angle + asteroid.angle) * radius;
        const y = asteroid.y + Math.sin(angle + asteroid.angle) * radius;
        
        if (i === 0) {
          this.ctx.moveTo(x, y);
        } else {
          this.ctx.lineTo(x, y);
        }
      }
      
      this.ctx.closePath();
      this.ctx.stroke();
    });
  }
  
  // Control methods
  rotate(direction) {
    const rotationSpeed = 0.1;
    this.ship.rotation = direction * rotationSpeed;
  }
  
  thrust(isThrusting) {
    this.ship.thrusting = isThrusting;
  }
}

// Initialize the game when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
  const game = new AsteroidsGame('game-board');
  const startButton = document.getElementById('start-button');
  const pauseButton = document.getElementById('pause-button');
  const restartButton = document.getElementById('restart-button');
  const gameOver = document.getElementById('game-over');
  const finalScore = document.getElementById('final-score');
  const scoreDisplay = document.getElementById('score');
  const bestScoreDisplay = document.getElementById('best-score');
  const livesDisplay = document.getElementById('lives');

  // Mobile controls
  const leftButton = document.getElementById('left-button');
  const rightButton = document.getElementById('right-button');
  const thrustButton = document.getElementById('thrust-button');
  const fireButton = document.getElementById('fire-button');

  function updateScore() {
    scoreDisplay.textContent = game.score;
    bestScoreDisplay.textContent = game.scores.bestScore;
    livesDisplay.textContent = game.lives;
  }

  startButton.addEventListener('click', () => {
    game.start();
    startButton.disabled = true;
  });

  pauseButton.addEventListener('click', () => {
    if (game.isPaused) {
      game.resume();
      pauseButton.textContent = 'Pause';
    } else {
      game.pause();
      pauseButton.textContent = 'Resume';
    }
  });

  restartButton.addEventListener('click', () => {
    game.reset();
    gameOver.classList.remove('visible');
    startButton.disabled = false;
    pauseButton.textContent = 'Pause';
    updateScore();
  });

  // Mobile controls
  leftButton.addEventListener('mousedown', () => game.rotate(1));
  leftButton.addEventListener('mouseup', () => game.rotate(0));
  leftButton.addEventListener('touchstart', () => game.rotate(1));
  leftButton.addEventListener('touchend', () => game.rotate(0));

  rightButton.addEventListener('mousedown', () => game.rotate(-1));
  rightButton.addEventListener('mouseup', () => game.rotate(0));
  rightButton.addEventListener('touchstart', () => game.rotate(-1));
  rightButton.addEventListener('touchend', () => game.rotate(0));

  thrustButton.addEventListener('mousedown', () => game.thrust(true));
  thrustButton.addEventListener('mouseup', () => game.thrust(false));
  thrustButton.addEventListener('touchstart', () => game.thrust(true));
  thrustButton.addEventListener('touchend', () => game.thrust(false));

  fireButton.addEventListener('click', () => game.shoot());

  // Keyboard controls
  document.addEventListener('keydown', (e) => {
    switch(e.key) {
      case 'ArrowLeft':
        game.rotate(1);
        break;
      case 'ArrowRight':
        game.rotate(-1);
        break;
      case 'ArrowUp':
        game.thrust(true);
        break;
      case ' ':
        game.shoot();
        break;
    }
  });

  document.addEventListener('keyup', (e) => {
    switch(e.key) {
      case 'ArrowLeft':
      case 'ArrowRight':
        game.rotate(0);
        break;
      case 'ArrowUp':
        game.thrust(false);
        break;
    }
  });

  // Game over handler
  game.onGameOver = (score) => {
    finalScore.textContent = score;
    gameOver.classList.add('visible');
    startButton.disabled = false;
    updateScore();
  };

  // Score update handler
  game.onScoreUpdate = updateScore;

  // Initialize the game
  updateScore();
});
