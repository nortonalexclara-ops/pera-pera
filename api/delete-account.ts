import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createHash } from 'crypto'
import { redis, redisConfigured } from './_redis.js'

function hashPin(pin: string, normalizedName: string): string {
  return createHash('sha256').update(`${normalizedName}:${pin}`).digest('hex')
}

// Supprime la sauvegarde en ligne d'un profil (si elle existe) avant que
// l'app ne supprime les données locales — voir Settings.tsx "Supprimer ce
// profil". Si aucune sauvegarde n'existe pour ce nom, rien à protéger
// côté serveur : on répond succès pour que la suppression locale se fasse
// avec une simple confirmation. Si une sauvegarde existe, le code doit
// correspondre, sinon n'importe qui sur l'appareil partagé pourrait
// supprimer le profil de quelqu'un d'autre.
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

  if (!redisConfigured) {
    res.status(503).json({ error: 'Vérification indisponible : variables Redis manquantes côté serveur (Vercel).' })
    return
  }

  const normalizedName = profileName.trim().toLowerCase()
  const key = `profile:${normalizedName}`

  try {
    const stored = await redis.get<{ pinHash: string }>(key)
    if (!stored) {
      res.status(200).json({ hadBackup: false })
      return
    }

    const pinHash = hashPin(typeof pin === 'string' ? pin : '', normalizedName)
    if (stored.pinHash !== pinHash) {
      res.status(403).json({ error: 'Code incorrect.' })
      return
    }

    await redis.del(key)
    res.status(200).json({ hadBackup: true })
  } catch (err) {
    console.error('delete-account: erreur Redis', err)
    res.status(500).json({ error: 'Service indisponible pour le moment.' })
  }
}
