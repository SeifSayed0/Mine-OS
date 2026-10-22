import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  base: '/Mine-OS/',
  plugins: [react()],
  server: { port: 3000, host: '0.0.0.0' },
  preview: { port: 3000, host: '0.0.0.0' },
})