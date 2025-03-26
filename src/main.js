import './style.css'

// Array de GIFs
const gifs = [
  'https://i.gifer.com/origin/18/18d067cc85160293c8058a21aa2aec28_w200.webp',
  'https://i.gifer.com/origin/76/76dfca2a58c4dff5c9827b527132bda8_w200.webp',
  'https://i.gifer.com/origin/d4/d40d41bb85b3875eb84c202c5196403c_w200.webp',
  'https://i.gifer.com/5Mys.gif',
  'https://i.gifer.com/origin/a8/a87541948ce7297723eb5568b7ac83e5_w200.webp',
  'https://i.gifer.com/origin/6d/6d90f150f0972a5edd2155aac4ad885b_w200.webp'
];

// Tamaño actual de los GIFs
const GIF_WIDTH = 120;
const GIF_HEIGHT = 120;
const SAFETY_MARGIN = 50; // Margen adicional para evitar colisiones

// Array para almacenar las posiciones ocupadas
let occupiedPositions = [];

// Función para verificar si una posición se superpone con las existentes
function isOverlapping(position) {
  for (const occupied of occupiedPositions) {
    // Verificar si hay superposición
    if (
      position.x < occupied.x + GIF_WIDTH + SAFETY_MARGIN &&
      position.x + GIF_WIDTH + SAFETY_MARGIN > occupied.x &&
      position.y < occupied.y + GIF_HEIGHT + SAFETY_MARGIN &&
      position.y + GIF_HEIGHT + SAFETY_MARGIN > occupied.y
    ) {
      return true; // Hay superposición
    }
  }
  return false; // No hay superposición
}

// Función para verificar si una posición colisiona con el header o el contenido
function collidesWithElements(position) {
  // Obtener dimensiones de los elementos importantes
  const header = document.querySelector('.fixed-header');
  const contentContainer = document.querySelector('.content-container');
  
  // Check for game-specific elements
  const gameBoard = document.querySelector('.game-board');
  const cardsGrid = document.querySelector('.cards-grid');
  const gameControls = document.querySelector('.controls');
  const mobileControls = document.querySelector('.mobile-controls');
  
  if (!header || !contentContainer) return false;
  
  const headerRect = header.getBoundingClientRect();
  const contentRect = contentContainer.getBoundingClientRect();
  
  // Get game element rectangles
  const gameBoardRect = gameBoard ? gameBoard.getBoundingClientRect() : null;
  const cardsGridRect = cardsGrid ? cardsGrid.getBoundingClientRect() : null;
  const gameControlsRect = gameControls ? gameControls.getBoundingClientRect() : null;
  const mobileControlsRect = mobileControls ? mobileControls.getBoundingClientRect() : null;
  
  // Área segura alrededor del header (añadir margen para mayor separación)
  const headerSafeArea = {
    left: headerRect.left - SAFETY_MARGIN,
    right: headerRect.right + SAFETY_MARGIN,
    top: headerRect.top - SAFETY_MARGIN,
    bottom: headerRect.bottom + SAFETY_MARGIN
  };
  
  // Área segura alrededor del contenido
  const contentSafeArea = {
    left: contentRect.left - SAFETY_MARGIN,
    right: contentRect.right + SAFETY_MARGIN,
    top: contentRect.top - SAFETY_MARGIN,
    bottom: contentRect.bottom + SAFETY_MARGIN
  };
  
  // Comprobar si el GIF colisiona con el header
  const collidesWithHeader = !(
    position.x + GIF_WIDTH < headerSafeArea.left ||
    position.x > headerSafeArea.right ||
    position.y + GIF_HEIGHT < headerSafeArea.top ||
    position.y > headerSafeArea.bottom
  );
  
  // Comprobar si el GIF colisiona con el contenido
  const collidesWithContent = !(
    position.x + GIF_WIDTH < contentSafeArea.left ||
    position.x > contentSafeArea.right ||
    position.y + GIF_HEIGHT < contentSafeArea.top ||
    position.y > contentSafeArea.bottom
  );
  
  // Check if the GIF collides with the game board
  let collidesWithGameBoard = false;
  if (gameBoardRect) {
    const gameBoardSafeArea = {
      left: gameBoardRect.left - SAFETY_MARGIN,
      right: gameBoardRect.right + SAFETY_MARGIN,
      top: gameBoardRect.top - SAFETY_MARGIN,
      bottom: gameBoardRect.bottom + SAFETY_MARGIN
    };
    
    collidesWithGameBoard = !(
      position.x + GIF_WIDTH < gameBoardSafeArea.left ||
      position.x > gameBoardSafeArea.right ||
      position.y + GIF_HEIGHT < gameBoardSafeArea.top ||
      position.y > gameBoardSafeArea.bottom
    );
  }
  
  // Check if the GIF collides with the cards grid
  let collidesWithCardsGrid = false;
  if (cardsGridRect) {
    const cardsGridSafeArea = {
      left: cardsGridRect.left - SAFETY_MARGIN,
      right: cardsGridRect.right + SAFETY_MARGIN,
      top: cardsGridRect.top - SAFETY_MARGIN,
      bottom: cardsGridRect.bottom + SAFETY_MARGIN
    };
    
    collidesWithCardsGrid = !(
      position.x + GIF_WIDTH < cardsGridSafeArea.left ||
      position.x > cardsGridSafeArea.right ||
      position.y + GIF_HEIGHT < cardsGridSafeArea.top ||
      position.y > cardsGridSafeArea.bottom
    );
  }
  
  // Check if the GIF collides with game controls
  let collidesWithGameControls = false;
  if (gameControlsRect) {
    const gameControlsSafeArea = {
      left: gameControlsRect.left - SAFETY_MARGIN,
      right: gameControlsRect.right + SAFETY_MARGIN,
      top: gameControlsRect.top - SAFETY_MARGIN,
      bottom: gameControlsRect.bottom + SAFETY_MARGIN
    };
    
    collidesWithGameControls = !(
      position.x + GIF_WIDTH < gameControlsSafeArea.left ||
      position.x > gameControlsSafeArea.right ||
      position.y + GIF_HEIGHT < gameControlsSafeArea.top ||
      position.y > gameControlsSafeArea.bottom
    );
  }
  
  // Check if the GIF collides with mobile controls
  let collidesWithMobileControls = false;
  if (mobileControlsRect) {
    const mobileControlsSafeArea = {
      left: mobileControlsRect.left - SAFETY_MARGIN,
      right: mobileControlsRect.right + SAFETY_MARGIN,
      top: mobileControlsRect.top - SAFETY_MARGIN,
      bottom: mobileControlsRect.bottom + SAFETY_MARGIN
    };
    
    collidesWithMobileControls = !(
      position.x + GIF_WIDTH < mobileControlsSafeArea.left ||
      position.x > mobileControlsSafeArea.right ||
      position.y + GIF_HEIGHT < mobileControlsSafeArea.top ||
      position.y > mobileControlsSafeArea.bottom
    );
  }
  
  return collidesWithHeader || collidesWithContent || collidesWithGameBoard || 
         collidesWithCardsGrid || collidesWithGameControls || collidesWithMobileControls;
}

// Función para generar una posición aleatoria que esté fuera de los contenedores y que no se superponga
function getValidPosition() {
  const maxAttempts = 50; // Limitar intentos para evitar bucles infinitos
  let attempts = 0;
  
  while (attempts < maxAttempts) {
    attempts++;
    
    // Generar posiciones aleatorias en toda la ventana
    const maxX = window.innerWidth - GIF_WIDTH;
    const maxY = window.innerHeight - GIF_HEIGHT;
    const position = {
      x: Math.random() * maxX,
      y: Math.random() * maxY
    };
    
    // Si no colisiona con elementos importantes y no se superpone con otros GIFs
    if (!collidesWithElements(position) && !isOverlapping(position)) {
      return position;
    }
  }
  
  // Si no se encuentra una posición válida después de varios intentos,
  // intentar colocar en las esquinas de la ventana
  const corners = [
    { x: 0, y: 0 }, // Esquina superior izquierda
    { x: window.innerWidth - GIF_WIDTH, y: 0 }, // Esquina superior derecha
    { x: 0, y: window.innerHeight - GIF_HEIGHT }, // Esquina inferior izquierda
    { x: window.innerWidth - GIF_WIDTH, y: window.innerHeight - GIF_HEIGHT } // Esquina inferior derecha
  ];
  
  // Filtrar esquinas que colisionan con elementos o con otros GIFs
  const availableCorners = corners.filter(
    corner => !collidesWithElements(corner) && !isOverlapping(corner)
  );
  
  // Si hay esquinas disponibles, usar una de ellas
  if (availableCorners.length > 0) {
    return availableCorners[Math.floor(Math.random() * availableCorners.length)];
  }
  
  // Si no hay opciones disponibles, devolver una posición en un extremo de la ventana
  return {
    x: Math.floor(Math.random() * (maxX / 4)),
    y: Math.floor(Math.random() * (window.innerHeight - GIF_HEIGHT))
  };
}

// Función para crear y posicionar los GIFs
function createDecorativeGifs() {
  // Primero eliminamos cualquier GIF existente para evitar duplicados
  document.querySelectorAll('.decorative-gif').forEach(gif => gif.remove());
  
  // Reiniciar array de posiciones ocupadas
  occupiedPositions = [];
  
  // Determinamos cuántos GIFs usar según el tamaño de la pantalla
  const screenWidth = window.innerWidth;
  let gifsToUse = gifs;
  
  // Reducir el número de GIFs en pantallas pequeñas
  if (screenWidth < 768) {
    gifsToUse = gifs.slice(0, 3); // Usar solo 3 GIFs en móviles
  } else if (screenWidth < 992) {
    gifsToUse = gifs.slice(0, 4); // Usar 4 GIFs en tablets
  }
  
  // Agregamos los GIFs directamente al body
  gifsToUse.forEach((gifUrl, index) => {
    const gif = document.createElement('img');
    gif.src = gifUrl;
    gif.className = 'decorative-gif';
    gif.alt = `Decorative GIF ${index + 1}`;
    
    const position = getValidPosition();
    gif.style.left = `${position.x}px`;
    gif.style.top = `${position.y}px`;
    
    // Agregamos la posición al array de posiciones ocupadas
    occupiedPositions.push(position);
    
    // Agregamos al body
    document.body.appendChild(gif);
  });
}

// Crear los GIFs decorativos después de que el DOM esté completamente cargado
document.addEventListener('DOMContentLoaded', function() {
  createDecorativeGifs();
});

// Recrear los GIFs cuando se redimensiona la ventana
window.addEventListener('resize', function() {
  // Usar debounce para evitar llamadas excesivas durante el redimensionamiento
  clearTimeout(window.resizeTimer);
  window.resizeTimer = setTimeout(function() {
    createDecorativeGifs();
  }, 250);
});

// Handle navigation and recreate GIFs on page change
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

// Ensure GIFs don't interfere with game elements by repositioning them on game pages
function checkAndRepositionGifs() {
  // Check if we're on a game page
  const isGamePage = document.body.classList.contains('game-page');
  
  if (isGamePage) {
    // After a short delay to ensure all game elements are rendered
    setTimeout(() => {
      createDecorativeGifs(); // Recreate GIFs with safe positions
    }, 300);
  }
}

// Execute repositioning when page is loaded
document.addEventListener('DOMContentLoaded', checkAndRepositionGifs);

// For single-page app behavior, check if we need to reposition when navigating
window.addEventListener('popstate', checkAndRepositionGifs);
