// Rappel quotidien par notification (demande explicite de l'utilisatrice)
// — Web Push : fonctionne sur Android/desktop dans un onglet normal, mais
// sur iPhone/iPad UNIQUEMENT si l'appli a été ajoutée à l'écran d'accueil
// (mode autonome, voir isStandalonePwa) ET sur iOS 16.4 ou plus récent —
// restriction du système, rien à contourner côté code. `isPushSupported`
// sert à masquer proprement le réglage plutôt que de proposer un bouton
// qui échouerait silencieusement sur un appareil/navigateur trop ancien.
import { isStandalonePwa } from '../../utils/pwa'

export function isPushSupported(): boolean {
  if (typeof window === 'undefined') return false
  if (!('serviceWorker' in navigator) || !('PushManager' in window)) return false
  // iOS n'expose l'API Push qu'en mode autonome — inutile de le proposer
  // dans un simple onglet Safari, le `subscribe()` échouerait de toute
  // façon (voir commentaire ci-dessus).
  const isIOS = /iphone|ipad|ipod/i.test(navigator.userAgent)
  if (isIOS && !isStandalonePwa()) return false
  return true
}

export function getNotificationPermission(): NotificationPermission | 'unsupported' {
  if (typeof Notification === 'undefined') return 'unsupported'
  return Notification.permission
}

function urlBase64ToUint8Array(base64: string): Uint8Array {
  const padding = '='.repeat((4 - (base64.length % 4)) % 4)
  const base64Safe = (base64 + padding).replace(/-/g, '+').replace(/_/g, '/')
  const rawData = window.atob(base64Safe)
  return Uint8Array.from(rawData, (c) => c.charCodeAt(0))
}

// Active les rappels pour ce profil sur cet appareil : demande la
// permission système (geste utilisateur requis, ne peut pas se faire
// silencieusement), puis crée l'abonnement Push et le transmet au serveur
// (voir api/push-subscribe.ts) pour qu'il sache où envoyer la
// notification quotidienne (voir api/send-daily-reminder.ts).
export async function subscribeToPush(profileId: string): Promise<void> {
  const vapidPublicKey = import.meta.env.VITE_VAPID_PUBLIC_KEY as string | undefined
  if (!vapidPublicKey) throw new Error('Rappels indisponibles (configuration manquante).')

  const permission = await Notification.requestPermission()
  if (permission !== 'granted') {
    throw new Error(
      permission === 'denied'
        ? "Notifications refusées — vérifie les réglages de notifications de ton téléphone pour cette appli."
        : 'Permission non accordée.',
    )
  }

  const registration = await navigator.serviceWorker.ready
  let subscription = await registration.pushManager.getSubscription()
  if (!subscription) {
    subscription = await registration.pushManager.subscribe({
      userVisibleOnly: true,
      // `as BufferSource` : décalage de typage TS DOM lib entre
      // `Uint8Array<ArrayBufferLike>` (ce que renvoie `Uint8Array.from`) et
      // `ArrayBufferView<ArrayBuffer>` attendu ici — la valeur elle-même
      // est correcte à l'exécution, seul le typage statique est trop
      // strict pour ce cas précis.
      applicationServerKey: urlBase64ToUint8Array(vapidPublicKey) as BufferSource,
    })
  }

  const res = await fetch('/api/push-subscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profileId, subscription: subscription.toJSON() }),
  })
  if (!res.ok) throw new Error("Échec de l'activation des rappels.")
}

export async function unsubscribeFromPush(profileId: string): Promise<void> {
  const registration = await navigator.serviceWorker.ready
  const subscription = await registration.pushManager.getSubscription()
  if (subscription) await subscription.unsubscribe()
  await fetch('/api/push-unsubscribe', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profileId }),
  }).catch(() => {
    // Le désabonnement local (ci-dessus) est ce qui compte le plus — un
    // souci réseau pour prévenir le serveur ne doit pas faire échouer
    // toute l'action ni laisser le bouton "coincé" en état "activé".
  })
}
