import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    // For Vite, use this instead of historyApiFallback
    proxy: {},
  },
  preview: {
    // For production preview
    port: 4173,
  },
})