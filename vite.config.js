import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  // Use base de GitHub Pages apenas no modo dedicado de deploy web.
  // Para Android/Capacitor, o base relativo evita tela branca por caminho absoluto.
  base: mode === 'ghpages' ? '/tabacocontrole/' : './',
  plugins: [react()],
}))
