import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// 💡 Importe o módulo 'path' do Node.js
import path from 'path'; 

export default defineConfig({
  plugins: [react()],
  server: {
    port: 8080
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
