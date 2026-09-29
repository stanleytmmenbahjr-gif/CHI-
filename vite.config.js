import vue from '@vitejs/plugin-vue'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue()],
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_CONTACT_API_PROXY || 'http://127.0.0.1:3001',
        changeOrigin: true,
      },
    },
  },
})
