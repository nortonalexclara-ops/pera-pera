/// <reference lib="webworker" />
import { precacheAndRoute, cleanupOutdatedCaches, createHandlerBoundToURL } from 'workbox-precaching'
import { registerRoute, NavigationRoute } from 'workbox-routing'

declare let self: ServiceWorkerGlobalScope

// Équivalent de ce que `generateSW` faisait automatiquement (voir
// vite.config.ts, `strategies: 'injectManifest'`) — repris à la main
// puisqu'on écrit maintenant notre propre fichier source, seule façon
// d'ajouter les écouteurs 'push'/'notificationclick' ci-dessous (pas
// d'accroche possible dans un service worker généré automatiquement).
precacheAndRoute(self.__WB_MANIFEST)
cleanupOutdatedCaches()
registerRoute(new NavigationRoute(createHandlerBoundToURL('index.html')))

self.skipWaiting()
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim())
})

// Rappel quotidien (demande explicite de l'utilisatrice : "envoyer des
// rappels notif sur le téléphone une fois par jour à tout le monde pour
// étudier") — la notification elle-même est déclenchée côté serveur (voir
// api/send-daily-reminder.ts, tâche planifiée Vercel Cron), ce gestionnaire
// se contente de l'afficher quand le système la livre à cet appareil.
self.addEventListener('push', (event) => {
  let payload: { title?: string; body?: string } = {}
  try {
    payload = event.data?.json() ?? {}
  } catch {
    // Filet de sécurité si jamais le contenu n'est pas du JSON valide —
    // une notification générique reste préférable à aucune notification.
  }
  const title = payload.title || 'Pera Pera'
  event.waitUntil(
    self.registration.showNotification(title, {
      body: payload.body || "C'est l'heure de réviser un peu de japonais !",
      icon: '/icons/icon-192.png',
      badge: '/icons/icon-192.png',
      tag: 'daily-reminder',
    }),
  )
})

// Au clic sur la notification : ramène au premier plan un onglet déjà
// ouvert sur l'appli plutôt que d'en ouvrir un nouveau à chaque fois.
self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  event.waitUntil(
    (async () => {
      const clientsList = await self.clients.matchAll({ type: 'window', includeUncontrolled: true })
      const existing = clientsList.find((c) => 'focus' in c)
      if (existing) {
        await (existing as WindowClient).focus()
      } else {
        await self.clients.openWindow('/')
      }
    })(),
  )
})
