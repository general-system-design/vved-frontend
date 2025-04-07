import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  preview: {
    port: process.env.PORT ? parseInt(process.env.PORT) : 4173,
    host: '0.0.0.0',
    allowedHosts: [
      'vved-frontend.onrender.com',
      'localhost'
    ]
  },
  server: {
    host: '0.0.0.0',
    port: process.env.PORT ? parseInt(process.env.PORT) : 3000
  }
})