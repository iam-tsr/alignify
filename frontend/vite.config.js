import { defineConfig } from 'vite'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

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
        target: 'http://0.0.0.0:10000',
        changeOrigin: true,
      }
    }
  },

  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        dashboard: resolve(__dirname, 'src/analytics/dashboard.html'),
        explore: resolve(__dirname, 'src/analytics/explore.html'),
        sidebar: resolve(__dirname, 'src/analytics/components/sidebar.html'),
      },
    },
  },
})