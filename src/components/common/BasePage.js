// Base page component that all specific pages will extend
import { Header } from './Header.js';

export class BasePage {
  constructor(title) {
    this.title = title;
    this.header = new Header(title);
    this.content = null;
  }
  
  createContentContainer() {
    const container = document.createElement('div');
    container.className = 'content-container';
    return container;
  }
  
  render() {
    const appWrapper = document.createElement('div');
    appWrapper.className = 'app-wrapper';
    
    // Add header
    appWrapper.appendChild(this.header.render());
    
    // Create content container
    const contentContainer = this.createContentContainer();
    
    // Create and add main content
    this.content = this.renderContent();
    if (this.content) {
      contentContainer.appendChild(this.content);
    }
    
    appWrapper.appendChild(contentContainer);
    
    return appWrapper;
  }
  
  // To be overridden by child classes
  renderContent() {
    // Default implementation returns an empty div
    const main = document.createElement('main');
    main.textContent = 'Content not implemented';
    return main;
  }
  
  // Lifecycle method for cleanup
  destroy() {
    // Override in child classes if needed
  }
  
  // Lifecycle method for post-render operations
  afterRender() {
    // Override in child classes if needed
    document.title = `${this.title} - Games Hub`;
    document.body.className = this.title === 'Games Hub' ? '' : 'game-page';
  }
} 