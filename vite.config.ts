import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    // Accès hors ligne (demande explicite de l'utilisatrice) : met en
    // cache le bundle JS/CSS et les fichiers statiques (dictionnaire,
    // icônes) au premier chargement, pour que l'appli s'ouvre et
    // fonctionne sans réseau ensuite — mastery/notes/etc. vivent déjà
    // dans IndexedDB, seul le chargement initial des fichiers manquait.
    // `manifest: false` : garde public/manifest.json (déjà en place et
    // lié dans index.html) plutôt que d'en générer un second.
    // `registerType: 'autoUpdate'` : le nouveau service worker prend le
    // relais tout seul dès qu'une mise à jour est détectée en ligne, pas
    // de bannière "recharger ?" à gérer côté UI.
    // `strategies: 'injectManifest'` + `srcDir/filename` : service worker
    // ÉCRIT À LA MAIN (voir src/sw.ts) plutôt que généré automatiquement —
    // nécessaire pour les rappels quotidiens (demande explicite de
    // l'utilisatrice) : afficher une notification reçue ('push') ou réagir
    // à son clic ('notificationclick') ne peut pas s'accrocher à un
    // service worker `generateSW` généré tout seul, seul le pré-cache
    // (`precacheAndRoute`) l'était jusqu'ici.
    VitePWA({
      registerType: 'autoUpdate',
      manifest: false,
      strategies: 'injectManifest',
      srcDir: 'src',
      filename: 'sw.ts',
      injectManifest: {
        // Le bundle JS principal (~8 Mo) et dictionary-fr.json (~2 Mo)
        // dépassent la limite par défaut de Workbox (2 Mo) — sans ça, ils
        // seraient silencieusement exclus de la mise en cache et l'appli
        // resterait inutilisable hors ligne malgré tout le reste.
        maximumFileSizeToCacheInBytes: 15 * 1024 * 1024,
        globPatterns: ['**/*.{js,css,html,ico,png,svg,json}'],
      },
    }),
  ],
  // Écoute sur toutes les interfaces réseau (pas juste localhost) pour
  // pouvoir ouvrir l'app depuis l'iPad sur le même Wi-Fi que le PC.
  server: {
    host: true,
  },
})
