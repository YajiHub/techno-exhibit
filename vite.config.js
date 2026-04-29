import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import basicSsl from '@vitejs/plugin-basic-ssl'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    basicSsl() 
  ],
  server: {
    // This proxy bypasses the strict Cloud CORS security block
    proxy: {
      '/capcom-cloud': {
        target: 'https://api.sms-gate.app',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/capcom-cloud/, '')
      }
    }
  }
})