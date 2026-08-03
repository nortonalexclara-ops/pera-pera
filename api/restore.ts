import type { VercelRequest, VercelResponse } from '@vercel/node'
import { Redis } from '@upstash/redis'
import { createHash } from 'crypto'

const redis = Redis.fromEnv()

function hashPin(pin: string, normalizedName: string): string {
  return createHash('sha256').update(`${normalizedName}:${pin}`).digest('hex')
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Méthode non autorisée.' })
    return
  }

  const { profileName, pin } = req.body ?? {}

  if (typeof profileName !== 'string' || !profileName.trim()) {
    res.status(400).json({ error: 'Nom de profil manquant.' })
    return
  }
  if (typeof pin !== 'string' || !/^\d{4}$/.test(pin)) {
    res.status(400).json({ error: 'Le code doit être à 4 chiffres.' })
    return
  }

  const normalizedName = profileName.trim().toLowerCase()
  const key = `profile:${normalizedName}`
  const pinHash = hashPin(pin, normalizedName)

  const stored = await redis.get<{ pinHash: string; displayName: string; payload: unknown; savedAt: number }>(key)
  if (!stored) {
    res.status(404).json({ error: 'Aucun profil trouvé avec ce nom.' })
    return
  }
  if (stored.pinHash !== pinHash) {
    res.status(403).json({ error: 'Code incorrect.' })
    return
  }

  res.status(200).json({ displayName: stored.displayName, payload: stored.payload, savedAt: stored.savedAt })
}
