import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
// 💡 Importe o módulo 'path' do Node.js
import path from 'path'; 

export default defineConfig({
  plugins: [react()],
  // Mantenha o base: './' para corrigir o 404 do GitHub Pages
  base: './', 

  // 💡 ADICIONE O BLOCO DE RESOLUÇÃO DE ALIAS
  resolve: {
    alias: {
      // Mapeia o alias '@/' para o diretório './src'
      "@": path.resolve(__dirname, "./src"),
    },
  },
});
