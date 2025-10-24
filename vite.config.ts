import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/ware-house-whisper/', // 👈 caminho igual ao nome do repositório!
})
