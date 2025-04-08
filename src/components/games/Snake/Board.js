// Snake game board component
export class SnakeBoard {
  constructor(canvasId, gridSize) {
    this.canvas = document.createElement('canvas');
    this.canvas.id = canvasId;
    this.canvas.className = 'game-board';
    this.canvas.width = 350;
    this.canvas.height = 350;
    
    this.ctx = this.canvas.getContext('2d');
    this.gridSize = gridSize;
    this.tileSize = this.canvas.width / this.gridSize;
    
    // Initialize touch controls
    this.setupTouchControls();
  }
  
  render() {
    // Set up canvas to prevent default touch behavior
    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault();
    }, { passive: false });
    
    return this.canvas;
  }
  
  setupTouchControls() {
    let touchStartX = 0;
    let touchStartY = 0;
    let touchEndX = 0;
    let touchEndY = 0;
    let minSwipeDistance = 20;
    
    this.onSwipe = null; // Will be set by parent component
    
    this.canvas.addEventListener('touchstart', (e) => {
      touchStartX = e.changedTouches[0].screenX;
      touchStartY = e.changedTouches[0].screenY;
    }, false);
    
    this.canvas.addEventListener('touchmove', (e) => {
      e.preventDefault(); // Prevent scrolling
    }, { passive: false });
    
    this.canvas.addEventListener('touchend', (e) => {
      touchEndX = e.changedTouches[0].screenX;
      touchEndY = e.changedTouches[0].screenY;
      this.handleSwipe(touchStartX, touchStartY, touchEndX, touchEndY, minSwipeDistance);
    }, false);
  }
  
  handleSwipe(startX, startY, endX, endY, minDistance) {
    if (!this.onSwipe) return;
    
    const deltaX = endX - startX;
    const deltaY = endY - startY;
    
    // Determine if the swipe was horizontal or vertical
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (Math.abs(deltaX) > minDistance) {
        if (deltaX > 0) {
          this.onSwipe('right');
        } else {
          this.onSwipe('left');
        }
      }
    } else {
      // Vertical swipe
      if (Math.abs(deltaY) > minDistance) {
        if (deltaY > 0) {
          this.onSwipe('down');
        } else {
          this.onSwipe('up');
        }
      }
    }
  }
  
  draw(snake, food) {
    // Clear canvas
    this.ctx.fillStyle = '#1a1a1a';
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    
    // Draw snake
    this.ctx.fillStyle = '#646cff';
    snake.forEach((segment) => {
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
      food.x * this.tileSize,
      food.y * this.tileSize,
      this.tileSize - 1,
      this.tileSize - 1
    );
  }
} 