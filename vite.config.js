import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  base: '/',
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        tictactoe: resolve(__dirname, 'src/games/tictactoe/tictactoe.html'),
        memory: resolve(__dirname, 'src/games/memory/memory.html'),
        snake: resolve(__dirname, 'src/games/snake/snake.html')
      }
    }
  }
}) 