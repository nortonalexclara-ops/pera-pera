import type { VercelRequest, VercelResponse } from '@vercel/node'
import { redis, redisConfigured } from './_redis.js'

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Méthode non autorisée.' })
    return
  }

  const { profileId } = req.body ?? {}
  if (typeof profileId !== 'string' || !profileId.trim()) {
    res.status(400).json({ error: 'Profil manquant.' })
    return
  }
  if (!redisConfigured) {
    // Le désabonnement local côté navigateur (voir pushNotifications.ts)
    // a déjà eu lieu à ce stade — un backend indisponible ne doit pas
    // faire échouer l'action pour l'utilisatrice.
    res.status(200).json({ ok: true })
    return
  }

  try {
    await redis.del(`push:${profileId}`)
    res.status(200).json({ ok: true })
  } catch (err) {
    console.error('push-unsubscribe: erreur Redis', err)
    res.status(200).json({ ok: true })
  }
}
