import { defineConfig } from 'vite'
import { resolve } from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  root: 'src',
  
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://0.0.0.0:10000',
        changeOrigin: true,
      }
    }
  },
  
  preview: {
    host: true,
    port: 4173,
    proxy: {
      '/api': {
        target: 'http://backend:10000',
        changeOrigin: true,
      }
    }
  },

  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        dashboard: resolve(__dirname, 'src/analytics/dashboard.html'),
      },
    },
  },
})
