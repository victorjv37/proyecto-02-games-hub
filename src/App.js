// Main application file
import { Router } from './router/index.js';
import { HomePage } from './pages/Home.js';
import { TicTacToePage } from './pages/TicTacToe.js';
import { MemoryPage } from './pages/Memory.js';
import { SnakePage } from './pages/Snake.js';
import { AsteroidsPage } from './pages/Asteroids.js';

export class App {
  constructor() {
    // Define the routes
    this.routes = {
      '/': () => new HomePage(),
      '/index.html': () => new HomePage(),
      '/tictactoe': () => new TicTacToePage(),
      '/memory': () => new MemoryPage(),
      '/snake': () => new SnakePage(),
      '/asteroids': () => new AsteroidsPage()
    };
    
    // Create content container to replace when we navigate
    this.contentRoot = document.getElementById('app');
    if (!this.contentRoot) {
      this.contentRoot = document.createElement('div');
      this.contentRoot.id = 'app';
      document.body.appendChild(this.contentRoot);
    }
    
    // Initialize the router
    this.router = new Router(this.routes, this.contentRoot);
    
    // Listen for custom navigation events
    window.addEventListener('navigate', (e) => {
      if (e.detail && e.detail.path) {
        this.router.navigate(e.detail.path);
      }
    });
  }
  
  // Initialize the application
  init() {
    // Navigate to the initial route
    this.router.navigate(window.location.pathname);
    
    // Create GIFs after a short delay to ensure the DOM is ready
    setTimeout(() => {
      if (window.createDecorativeGifs) {
        window.createDecorativeGifs();
      }
    }, 300);
  }
} 