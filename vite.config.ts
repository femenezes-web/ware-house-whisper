import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Mude de '/ware-house-whisper/' para './'
  base: './', 
})
