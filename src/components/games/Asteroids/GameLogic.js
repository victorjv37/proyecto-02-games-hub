// Asteroids game logic component
export class AsteroidsLogic {
  /**
   * Constructor for the Asteroids game
   * @param {HTMLCanvasElement} canvas - Canvas element for the game
   */
  constructor(canvas) {
    if (!canvas) {
      throw new Error('Canvas element is required');
    }
    
    // Canvas setup
    this.canvas = canvas;
    this.ctx = this.canvas.getContext('2d');
    
    // Game state initialization
    this.reset();
    
    // Event callbacks
    this.onScoreUpdate = null;
    this.onGameOver = null;
    this.onGameStart = null;
    this.onGamePause = null;
    this.onGameResume = null;
    this.onGameReset = null;
  }
  
  /**
   * Initialize or reset the game state
   */
  reset() {
    // Ensure canvas fills its container
    const container = this.canvas.parentElement;
    this.canvas.width = container.clientWidth;
    this.canvas.height = container.clientHeight;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    
    // Adjust margin for mobile screens
    if (window.innerWidth <= 768) {
      this.canvas.style.margin = '0';
    } else {
      this.canvas.style.margin = '0.4rem auto';
    }
    
    // Game state initialization
    this.score = 0;
    this.lives = 3;
    this.level = 1;
    this.asteroids = [];
    this.bullets = [];
    this.gameLoop = null;
    this.isPaused = false;
    this.isGameOver = false;
    this.showStartScreen = true;
    this.heartBlinkTime = 0;
    
    // Check for small screens
    this.isSmallScreen = window.innerWidth <= 350;
    
    // Ship properties - adjusted based on screen size
    this.ship = {
      x: this.width / 2,
      y: this.height - 60,
      radius: this.isSmallScreen ? 12 : 15,
      width: this.isSmallScreen ? 30 : 40,
      height: this.isSmallScreen ? 30 : 40,
      invulnerable: false,
      speed: 7
    };
    
    this.shipImageLoaded = false;
    this.asteroidImageLoaded = false;
    this.bulletImageLoaded = false;
    
    this.loadImages();
    this.loadScores();
  }
  
  /**
   * Load all game images
   */
  loadImages() {
    // Ship image
    this.shipImage = new Image();
    this.shipImage.src = 'https://i.gifer.com/origin/a2/a2efb3cf71b7b2a95d8d0c6236f00c88_w200.webp';
    this.shipImage.onload = () => {
      this.shipImageLoaded = true;
    };
    
    // Asteroid image
    this.asteroidImage = new Image();
    this.asteroidImage.src = 'https://images.vexels.com/media/users/3/203033/isolated/preview/bad8b13b449cf80e9cdbf1c355d63f4f-ilustracion-de-gran-asteroide.png';
    this.asteroidImage.onload = () => {
      this.asteroidImageLoaded = true;
    };
    
    // Bullet image
    this.bulletImage = new Image();
    this.bulletImage.src = '/—Pngtree—red bullet effect light effect_7150008.png';
    this.bulletImage.onload = () => {
      this.bulletImageLoaded = true;
    };
  }
  
  /**
   * Load player scores from localStorage
   */
  loadScores() {
    const savedScores = localStorage.getItem('asteroidsScores');
    this.scores = savedScores ? JSON.parse(savedScores) : { bestScore: 0 };
    
    // Notify score update
    if (this.onScoreUpdate) {
      this.onScoreUpdate(this.score, this.scores.bestScore);
    }
  }
  
  /**
   * Save player scores to localStorage
   */
  saveScores() {
    localStorage.setItem('asteroidsScores', JSON.stringify(this.scores));
  }
  
  /**
   * Start the game
   */
  start() {
    if (!this.gameLoop) {
      this.showStartScreen = false;
      this.isPaused = false;
      this.isGameOver = false;
      this.initializeAsteroids();
      this.gameLoop = setInterval(() => this.update(), 1000 / 60); // 60 FPS
      this.draw();
      
      // Notify UI that game has started
      if (this.onGameStart) {
        this.onGameStart();
      }
    }
  }
  
  /**
   * Pause the game
   */
  pause() {
    this.isPaused = true;
    this.draw();
    
    // Notify UI that game has paused
    if (this.onGamePause) {
      this.onGamePause();
    }
  }
  
  /**
   * Resume the game
   */
  resume() {
    this.isPaused = false;
    this.draw();
    
    // Notify UI that game has resumed
    if (this.onGameResume) {
      this.onGameResume();
    }
  }
  
  /**
   * Game over handler
   */
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
  
  /**
   * Initialize asteroids at the start of a level
   */
  initializeAsteroids() {
    // Reduced number of asteroids per level
    const numAsteroids = 2 + Math.floor((this.level - 1) * 0.7);
    this.asteroids = [];
    
    for (let i = 0; i < numAsteroids; i++) {
      this.createAsteroid();
    }
  }
  
  /**
   * Create a new asteroid
   * @param {number} x - Optional x position
   * @param {number} y - Optional y position
   * @param {string} size - Size of asteroid ('large', 'medium', 'small')
   */
  createAsteroid(x, y, size = 'large') {
    // Define asteroid sizes and scores, with adjustments for small screens
    const sizeScaleFactor = this.isSmallScreen ? 0.75 : 1;
    const sizes = {
      large: { radius: 25 * sizeScaleFactor, score: 20 },
      medium: { radius: 15 * sizeScaleFactor, score: 50 },
      small: { radius: 8 * sizeScaleFactor, score: 100 }
    };
    
    // Random position if not specified
    let posX = x;
    let posY = y;
    
    if (posX === undefined || posY === undefined) {
      // Make sure asteroids don't spawn too close to the ship
      const safeDistance = this.isSmallScreen ? 80 : 100;
      let validPos = false;
      
      while (!validPos) {
        posX = Math.random() * this.width;
        posY = -sizes[size].radius; // Start above the screen
        
        const distanceToShip = Math.abs(posX - this.ship.x);
        
        if (distanceToShip > safeDistance) {
          validPos = true;
        }
      }
    }
    
    // Velocidad reducida para pantallas pequeñas (móviles)
    const speedFactor = this.isSmallScreen ? 0.6 : 1;
    
    // Create the asteroid with slower downward movement
    this.asteroids.push({
      x: posX,
      y: posY,
      xVelocity: (Math.random() * 2 - 1) * 1.2 * speedFactor, // Reduced horizontal movement for small screens
      yVelocity: (1 + Math.random() * 1.5 + (this.level - 1) * 0.3) * speedFactor, // Reduced speed for small screens
      radius: sizes[size].radius,
      size: size,
      scoreValue: sizes[size].score,
      rotation: Math.random() * Math.PI * 2, // Random initial rotation
      rotationSpeed: (Math.random() * 0.1 - 0.05) * speedFactor // Reduced rotation speed for small screens
    });
  }
  
  /**
   * Create a bullet from the ship
   */
  shoot() {
    // Only shoot if the game is running
    if (!this.gameLoop || this.isPaused || this.isGameOver || this.showStartScreen) {
      return;
    }
    
    this.bullets.push({
      x: this.ship.x,
      y: this.ship.y - this.ship.height/2,
      xVelocity: 0,
      yVelocity: -12, // Even faster bullet speed
      radius: this.isSmallScreen ? 4 : 6, // Adjusted bullet size for small screens
      lifespan: 60
    });
  }
  
  /**
   * Break asteroid into smaller pieces when hit
   * @param {number} index - Index of the asteroid to break
   */
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
  
  /**
   * Ship temporarily invulnerable
   */
  resetShip() {
    this.ship.invulnerable = true;
    
    // Reset invulnerability after 3 seconds
    setTimeout(() => {
      this.ship.invulnerable = false;
    }, 3000);
  }
  
  /**
   * Main game update loop
   */
  update() {
    if (this.isPaused || this.isGameOver) return;
    
    this.updateShip();
    this.updateBullets();
    this.updateAsteroids();
    this.checkCollisions();
    
    // Check if level is completed
    if (this.asteroids.length === 0) {
      this.level++;
      this.initializeAsteroids();
    }
    
    this.draw();
  }
  
  /**
   * Update ship position
   */
  updateShip() {
    // Only update horizontal position
    this.ship.x += this.ship.thrust?.x || 0;
    
    // Keep ship within bounds
    if (this.ship.x < this.ship.width/2) {
      this.ship.x = this.ship.width/2;
    }
    if (this.ship.x > this.width - this.ship.width/2) {
      this.ship.x = this.width - this.ship.width/2;
    }
  }
  
  /**
   * Update bullets position and lifespan
   */
  updateBullets() {
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      // Update bullet position
      this.bullets[i].x += this.bullets[i].xVelocity;
      this.bullets[i].y += this.bullets[i].yVelocity;
      
      // Reduce bullet lifespan
      this.bullets[i].lifespan--;
      
      // Remove bullets that have expired
      if (this.bullets[i].lifespan <= 0) {
        this.bullets.splice(i, 1);
      }
    }
  }
  
  /**
   * Update asteroids position
   */
  updateAsteroids() {
    for (let i = this.asteroids.length - 1; i >= 0; i--) {
      // Update asteroid position
      this.asteroids[i].x += this.asteroids[i].xVelocity;
      this.asteroids[i].y += this.asteroids[i].yVelocity;
      
      // Just remove asteroids that go off screen without penalty
      if (this.asteroids[i].y > this.height + this.asteroids[i].radius) {
        this.asteroids.splice(i, 1);
        
        // Only replace asteroid if not too many on screen
        if (this.asteroids.length < 12) {
          this.createAsteroid();
        }
      }
    }
  }
  
  /**
   * Check for collisions between game objects
   */
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
          if (this.onScoreUpdate) this.onScoreUpdate(this.score, this.scores.bestScore);
          
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
          this.heartBlinkTime = Date.now(); // Start heart blink animation
          
          if (this.onScoreUpdate) this.onScoreUpdate(this.score, this.scores.bestScore);
          
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
  
  /**
   * Main draw function
   */
  draw() {
    // Clear canvas with transparent background (since we have the GIF behind)
    this.ctx.clearRect(0, 0, this.width, this.height);
    
    // Draw game objects
    this.drawShip();
    this.drawBullets();
    this.drawAsteroids();
    this.drawHearts();
    
    // Draw overlays
    if (this.isPaused) {
      this.drawPauseOverlay();
    }
    
    if (this.showStartScreen) {
      this.drawStartScreenOverlay();
    }
  }
  
  /**
   * Draw the ship
   */
  drawShip() {
    if (this.ship.invulnerable && Math.floor(Date.now() / 100) % 2 === 0) {
      return; // Skip drawing to create blinking effect
    }
    
    this.ctx.save();
    this.ctx.translate(this.ship.x, this.ship.y);
    
    // Draw ship using the loaded image
    if (this.shipImageLoaded) {
      // Add glow effect when moving
      if (this.ship.thrust?.x !== 0) {
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
      this.ctx.moveTo(0, -this.ship.radius);
      this.ctx.lineTo(-this.ship.radius, this.ship.radius / 2);
      this.ctx.lineTo(this.ship.radius, this.ship.radius / 2);
      this.ctx.closePath();
      this.ctx.stroke();
    }
    
    this.ctx.restore();
  }
  
  /**
   * Draw bullets
   */
  drawBullets() {
    this.bullets.forEach(bullet => {
      if (this.bulletImageLoaded) {
        // Save context state
        this.ctx.save();
        
        // Set up shadow for glow effect
        this.ctx.shadowColor = '#ff0000';
        this.ctx.shadowBlur = 10;
        
        // Calculate bullet dimensions - adjusted for screen size
        const sizeMultiplier = this.isSmallScreen ? 6 : 8;
        const bulletWidth = bullet.radius * sizeMultiplier;   // Width perpendicular to motion
        const bulletHeight = bullet.radius * (sizeMultiplier * 2); // Height in direction of motion
        
        // Translate to bullet position
        this.ctx.translate(bullet.x, bullet.y);
        
        // Rotate 90 degrees counterclockwise to make it point upward
        this.ctx.rotate(-Math.PI / 2);
        
        // Draw bullet image - centered on bullet position
        this.ctx.drawImage(
          this.bulletImage,
          -bulletWidth / 2,
          -bulletHeight / 2,
          bulletWidth,
          bulletHeight
        );
        
        // Restore context
        this.ctx.restore();
      } else {
        // Fallback to drawing a circle if image is not loaded
        this.ctx.save();
        this.ctx.fillStyle = '#ff3333';
        this.ctx.shadowColor = '#ff0000';
        this.ctx.shadowBlur = 10;
        
        this.ctx.beginPath();
        this.ctx.arc(bullet.x, bullet.y, bullet.radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        this.ctx.restore();
      }
    });
  }
  
  /**
   * Draw asteroids
   */
  drawAsteroids() {
    this.asteroids.forEach(asteroid => {
      if (this.asteroidImageLoaded) {
        // Update asteroid rotation
        asteroid.rotation += asteroid.rotationSpeed;
        
        // Draw the asteroid image
        this.ctx.save();
        this.ctx.translate(asteroid.x, asteroid.y);
        
        // Use the asteroid's rotation property
        this.ctx.rotate(asteroid.rotation);
        
        // Draw the asteroid image centered on the asteroid's position
        this.ctx.drawImage(
          this.asteroidImage, 
          -asteroid.radius, 
          -asteroid.radius, 
          asteroid.radius * 2, 
          asteroid.radius * 2
        );
        
        this.ctx.restore();
      } else {
        // Fallback to drawing a circle if image is not loaded
        this.ctx.fillStyle = '#00f2ff';
        this.ctx.beginPath();
        this.ctx.arc(asteroid.x, asteroid.y, asteroid.radius, 0, Math.PI * 2);
        this.ctx.fill();
        
        // Add a glow effect
        this.ctx.shadowColor = '#00f2ff';
        this.ctx.shadowBlur = 10;
        this.ctx.shadowOffsetX = 0;
        this.ctx.shadowOffsetY = 0;
      }
    });
  }
  
  /**
   * Draw hearts (lives)
   */
  drawHearts() {
    // Heart display settings - adjust for small screens
    const heartSize = this.isSmallScreen ? 20 : 25; // Smaller hearts on small screens
    const spacing = this.isSmallScreen ? 5 : 8; // Less spacing between hearts on small screens
    const padding = this.isSmallScreen ? 5 : 10; // Less padding on small screens
    
    this.ctx.save();
    this.ctx.font = `${heartSize}px Arial`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    
    // Heart animation when hit
    const timeSinceHit = Date.now() - this.heartBlinkTime;
    const isAnimatingHit = timeSinceHit < 1000; // 1 second animation
    
    // Draw lives as hearts from right to left
    for (let i = 0; i < this.lives; i++) {
      // Position hearts from right to left
      const x = this.width - padding - (heartSize/2) - (i * (heartSize + spacing));
      const y = padding + heartSize/2;
      
      this.ctx.save();
      
      // Check if we're animating the last heart
      if (isAnimatingHit && i === this.lives - 1) {
        // Animate the last heart (pulsing effect)
        const pulseScale = 1 + Math.sin(timeSinceHit / 50) * 0.3;
        this.ctx.translate(x, y);
        this.ctx.scale(pulseScale, pulseScale);
        this.ctx.translate(-x, -y);
        
        // Change color based on animation phase
        this.ctx.fillStyle = '#ff3366';
        this.ctx.shadowColor = '#ff3366';
      } else {
        // Normal heart
        this.ctx.fillStyle = '#ff3366';
        this.ctx.shadowColor = '#ff3366';
      }
      
      // Add stronger glow effect
      this.ctx.shadowBlur = 15;
      this.ctx.shadowOffsetX = 0;
      this.ctx.shadowOffsetY = 0;
      
      // Draw heart emoji
      this.ctx.fillText('❤', x, y);
      
      this.ctx.restore();
    }
    
    this.ctx.restore();
  }
  
  /**
   * Draw pause overlay
   */
  drawPauseOverlay() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    this.ctx.fillStyle = '#00f2ff';
    this.ctx.font = `bold ${this.isSmallScreen ? '24px' : '30px'} Arial`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.shadowColor = '#00f2ff';
    this.ctx.shadowBlur = 10;
    this.ctx.fillText('PAUSED', this.width / 2, this.height / 2);
  }
  
  /**
   * Draw start screen overlay
   */
  drawStartScreenOverlay() {
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.5)';
    this.ctx.fillRect(0, 0, this.width, this.height);
    
    this.ctx.fillStyle = '#00f2ff';
    this.ctx.font = `bold ${this.isSmallScreen ? '24px' : '30px'} Arial`;
    this.ctx.textAlign = 'center';
    this.ctx.textBaseline = 'middle';
    this.ctx.shadowColor = '#00f2ff';
    this.ctx.shadowBlur = 10;
    this.ctx.fillText('PRESS START', this.width / 2, this.height / 2);
  }
  
  /**
   * Move ship left
   */
  moveLeft() {
    this.ship.thrust = { x: -this.ship.speed, y: 0 };
  }
  
  /**
   * Move ship right
   */
  moveRight() {
    this.ship.thrust = { x: this.ship.speed, y: 0 };
  }
  
  /**
   * Stop ship movement
   */
  stopMoving() {
    this.ship.thrust = { x: 0, y: 0 };
  }
  
  /**
   * Cleanup resources
   */
  destroy() {
    if (this.gameLoop) {
      clearInterval(this.gameLoop);
      this.gameLoop = null;
    }
  }
  
  /**
   * Handle window resize
   */
  handleResize() {
    const container = this.canvas.parentElement;
    this.canvas.width = container.clientWidth;
    this.canvas.height = container.clientHeight;
    this.width = this.canvas.width;
    this.height = this.canvas.height;
    
    // Update small screen flag
    this.isSmallScreen = window.innerWidth <= 350;
    
    // Update ship size based on screen size
    this.ship.radius = this.isSmallScreen ? 12 : 15;
    this.ship.width = this.isSmallScreen ? 30 : 40;
    this.ship.height = this.isSmallScreen ? 30 : 40;
    
    // Adjust margin for mobile screens
    if (window.innerWidth <= 768) {
      this.canvas.style.margin = '0';
    } else {
      this.canvas.style.margin = '0.4rem auto';
    }
    
    // Update ship position based on new dimensions
    this.ship.x = Math.min(this.ship.x, this.width - this.ship.width/2);
    this.ship.y = this.height - 60;
    
    this.draw(); // Redraw game
  }
} 