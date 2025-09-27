import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: true,
  },
  css: {
    preprocessorOptions: {
      css: {
        charset: false
      }
    }
  },
  build: {
    rollupOptions: {
      external: (id) => {
        // Don't externalize CSS files
        if (id.endsWith('.css')) return false;
        return false;
      }
    }
  }
})
