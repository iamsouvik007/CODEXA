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
})
