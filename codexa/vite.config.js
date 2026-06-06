import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import lessonsPlugin from './vite-plugin-lessons.js'

export default defineConfig({
  plugins: [
    tailwindcss(),
    lessonsPlugin(),
    react(),
  ],
  server: {
    proxy: {
      '/api-openai': {
        target: 'https://api.openai.com/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-openai/, ''),
      },
      '/api-nvidia': {
        target: 'https://integrate.api.nvidia.com/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-nvidia/, ''),
      },
      '/api-groq': {
        target: 'https://api.groq.com/openai/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-groq/, ''),
      },
      '/api-claude': {
        target: 'https://api.anthropic.com/v1',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api-claude/, ''),
      },
    }
  }
})
// Trigger reload for lessons plugin update (force reload)
