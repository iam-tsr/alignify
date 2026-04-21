import { defineConfig } from 'vite'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// https://vitejs.dev/config/
export default defineConfig({
  root: 'src',
  base: '/alignify/',

  build: {
    outDir: resolve(__dirname, 'dist'),
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'src/index.html'),
        survey: resolve(__dirname, 'src/html/survey.html'),
        dashboard: resolve(__dirname, 'src/html/analytics/dashboard.html'),
        explore: resolve(__dirname, 'src/html/analytics/explore.html'),
        sidebar: resolve(__dirname, 'src/html/analytics/components/sidebar.html'),
      },
    },
  },
})