import type { VercelRequest, VercelResponse } from '@vercel/node'
import { redis, redisConfigured } from './_redis.js'

// Enregistre l'abonnement Push d'un profil (voir pushNotifications.ts) —
// une clé par profil local, écrasée à chaque nouvel appel : un profil ne
// reçoit ses rappels que sur le DERNIER appareil où il les a activés
// (cohérent avec le reste de l'appli, où chaque profil local est propre à
// un appareil).
export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Méthode non autorisée.' })
    return
  }

  const { profileId, subscription } = req.body ?? {}

  if (typeof profileId !== 'string' || !profileId.trim()) {
    res.status(400).json({ error: 'Profil manquant.' })
    return
  }
  if (!subscription || typeof subscription !== 'object' || typeof subscription.endpoint !== 'string') {
    res.status(400).json({ error: 'Abonnement invalide.' })
    return
  }
  if (!redisConfigured) {
    res.status(503).json({ error: 'Rappels indisponibles : variables Redis manquantes côté serveur (Vercel).' })
    return
  }

  try {
    await redis.set(`push:${profileId}`, subscription)
    res.status(200).json({ ok: true })
  } catch (err) {
    console.error('push-subscribe: erreur Redis', err)
    res.status(500).json({ error: 'Service indisponible pour le moment.' })
  }
}
