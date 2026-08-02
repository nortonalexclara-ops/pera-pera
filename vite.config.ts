import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  // Écoute sur toutes les interfaces réseau (pas juste localhost) pour
  // pouvoir ouvrir l'app depuis l'iPad sur le même Wi-Fi que le PC.
  server: {
    host: true,
  },
})
