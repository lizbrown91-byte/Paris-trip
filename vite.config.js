import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  // Served from https://lizbrown91-byte.github.io/Paris-trip/, so assets need
  // the repo name as their base path.
  base: '/Paris-trip/',
  plugins: [react()],
})
