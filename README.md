# Games Hub

## Descripción

Games Hub es una plataforma web que ofrece una colección de juegos clásicos implementados con JavaScript puro. El proyecto está construido utilizando Vite como bundler para proporcionar una experiencia de desarrollo moderna y eficiente.

La plataforma incluye los siguientes juegos:
- **Tic Tac Toe**: El clásico juego de tres en raya
- **Memory Game**: Juego de memoria con tarjetas
- **Snake**: El famoso juego de la serpiente
- **Asteroids**: Versión moderna del clásico juego de arcade

## Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript (ES6+)
- Vite (como bundler y servidor de desarrollo)

## Estructura del proyecto

```
proyecto-02-games-hub/
│
├── public/                   # Archivos estáticos
├── src/                      # Código fuente
│   ├── games/                # Juegos individuales
│   │   ├── asteroids/        # Juego Asteroids
│   │   ├── memory/           # Juego Memory
│   │   ├── snake/            # Juego Snake
│   │   └── tictactoe/        # Juego Tic Tac Toe
│   ├── main.js               # JavaScript principal
│   └── style.css             # Estilos globales
│
├── index.html                # Página principal
├── package.json              # Dependencias y scripts
├── vite.config.js            # Configuración de Vite
└── README.md                 # Documentación
```

## Cómo iniciar el proyecto

### Requisitos previos

- Node.js (versión 14.0.0 o superior)
- npm (viene incluido con Node.js)

### Instalación

1. Clona o descarga este repositorio:
```bash
git clone [URL_DEL_REPOSITORIO]
```

2. Navega al directorio del proyecto:
```bash
cd proyecto-02-games-hub
```

3. Instala las dependencias:
```bash
npm install
```

### Ejecución

Para iniciar el servidor de desarrollo:
```bash
npm run dev
```

Esto iniciará el servidor de desarrollo de Vite y abrirá automáticamente el proyecto en tu navegador en `http://localhost:3000`.

### Compilación para producción

Para compilar el proyecto para producción:
```bash
npm run build
```

Los archivos compilados estarán disponibles en el directorio `dist/`.

Para previsualizar la build de producción:
```bash
npm run preview
```

## Descripción detallada de los componentes

### Estructura global

#### `index.html`
- Página principal de la aplicación
- Contiene la navegación principal
- Muestra la lista de juegos disponibles

#### `src/main.js`
- Script principal que controla la navegación
- Maneja la lógica compartida entre juegos
- Implementa funcionalidades comunes como:
  - Transiciones entre páginas
  - Sistema de temas (claro/oscuro)
  - Funciones de utilidad compartidas

#### `src/style.css`
- Estilos globales compartidos por toda la aplicación
- Variables CSS para temas
- Estilos responsive para diferentes dispositivos
- Animaciones y transiciones compartidas

### Juego: Tic Tac Toe

#### `src/games/tictactoe/tictactoe.html`
- Estructura HTML del juego
- Tablero de 3x3
- Marcadores y controles

#### `src/games/tictactoe/tictactoe.js`
- Lógica del juego
- Gestión de turnos
- Verificación de ganador
- Manejo de la IA (jugador automático)

#### `src/games/tictactoe/tictactoe.css`
- Estilos específicos del juego
- Animaciones para las fichas X y O
- Diseño responsive

### Juego: Memory Game

#### `src/games/memory/memory.html`
- Estructura HTML del juego
- Tarjetas para emparejar
- Marcadores y controles

#### `src/games/memory/memory.js`
- Lógica del juego
- Manejo de emparejamientos
- Temporizador y puntuación
- Lógica para barajar las tarjetas

#### `src/games/memory/memory.css`
- Estilos específicos del juego
- Animaciones para las tarjetas
- Diseño responsive

### Juego: Snake

#### `src/games/snake/snake.html`
- Estructura HTML del juego
- Área de juego
- Marcadores y controles

#### `src/games/snake/snake.js`
- Lógica del juego
- Control del movimiento de la serpiente
- Generación de comida
- Detección de colisiones
- Sistema de puntuación

#### `src/games/snake/snake.css`
- Estilos específicos del juego
- Diseño visual de la serpiente y la comida
- Diseño responsive y controles para móviles

### Juego: Asteroids

#### `src/games/asteroids/asteroids.html`
- Estructura HTML del juego
- Canvas para el área de juego
- Controles y marcadores

#### `src/games/asteroids/asteroids.js`
- Lógica completa del juego implementada en la clase `AsteroidsGame`
- Sistema de físicas para la nave y asteroides
- Detección de colisiones
- Sistema de niveles y dificultad
- Optimizaciones para dispositivos móviles:
  - Redimensionamiento automático de elementos
  - Controles adaptados a pantallas táctiles
  - Ajuste de velocidad para mejor jugabilidad

#### `src/games/asteroids/asteroids.css`
- Estilos específicos del juego
- Diseño de los controles en pantalla
- Efectos visuales y animaciones
- Optimización para diferentes tamaños de pantalla

## Características de accesibilidad y responsividad

- Diseño responsive que se adapta a diferentes tamaños de pantalla
- Controles táctiles para dispositivos móviles
- Esquema de colores consistente con buen contraste
- Soporte para tema claro y oscuro
- Optimización de rendimiento para dispositivos de gama baja

## Notas adicionales

- Los juegos almacenan las puntuaciones en el localStorage del navegador
- La configuración de Vite está optimizada para una carga rápida y eficiente
- El proyecto utiliza módulos ES6 para una mejor organización del código

## Posibles mejoras futuras

- Añadir más juegos a la colección
- Implementar un sistema de cuentas de usuario
- Añadir clasificaciones en línea
- Mejorar la accesibilidad con soporte para lectores de pantalla
- Implementar modo multijugador en tiempo real

---

Desarrollado como proyecto educativo © 2023 