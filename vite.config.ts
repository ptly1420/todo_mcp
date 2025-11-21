import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    // 确保 process.env 在浏览器中可用，主要用于 API_KEY
    'process.env': process.env
  }
})