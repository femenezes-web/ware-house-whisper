import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/ware-house-whisper/', // deve ser igual ao nome do repositório
})
