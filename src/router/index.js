// Simple router for the SPA
export class Router {
  constructor(routes, container) {
    this.routes = routes;
    this.container = container;
    this.currentPage = null;
    
    // Handle initial page load
    window.addEventListener('DOMContentLoaded', () => this.navigate(window.location.pathname));
    
    // Handle browser back/forward navigation
    window.addEventListener('popstate', () => this.navigate(window.location.pathname));
    
    // Handle link clicks
    document.addEventListener('click', e => {
      if (e.target.matches('a') && e.target.href.includes(window.location.origin)) {
        e.preventDefault();
        const path = e.target.pathname;
        history.pushState({}, '', path);
        this.navigate(path);
      }
    });
    
    // Handle custom navigation events
    window.addEventListener('navigate', e => {
      if (e.detail && e.detail.path) {
        const path = e.detail.path;
        history.pushState({}, '', path);
        this.navigate(path);
      }
    });
  }
  
  navigate(path) {
    // Default to home if path not found
    const routeHandler = this.routes[path] || this.routes['/'];
    
    // Clean up current page if exists
    if (this.currentPage && typeof this.currentPage.destroy === 'function') {
      this.currentPage.destroy();
    }
    
    // Setup active nav link
    document.querySelectorAll('nav a').forEach(a => a.classList.remove('active'));
    const navLink = document.querySelector(`nav a[href="${path}"]`);
    if (navLink) navLink.classList.add('active');
    
    // Create and render new page
    this.currentPage = routeHandler();
    this.container.innerHTML = ''; // Clear container
    this.container.appendChild(this.currentPage.render());
    
    // Execute any post-render logic
    if (typeof this.currentPage.afterRender === 'function') {
      this.currentPage.afterRender();
    }
    
    // Ensure GIFs are repositioned after navigation
    if (window.checkAndRepositionGifs) {
      setTimeout(() => window.checkAndRepositionGifs(), 300);
    }
  }
} 