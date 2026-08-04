import type { VercelRequest, VercelResponse } from '@vercel/node'
import { createHash } from 'crypto'
import { redis, redisConfigured } from './_redis'

// Fonction serverless Vercel (pas incluse dans le build Vite — voir
// PROJECT_STATE.md pour le contexte complet). Stocke la progression d'un
// profil dans Upstash Redis (via l'intégration Vercel Marketplace —
// "Vercel KV" en tant que produit séparé est déprécié, remplacé par
// cette intégration), gardée par un code à 4 chiffres — seule "auth"
// prévue vu le nombre d'utilisateurs (~10, usage familial/amis), pas un
// vrai système de comptes.
function hashPin(pin: string, normalizedName: string): string {
  return createHash('sha256').update(`${normalizedName}:${pin}`).digest('hex')
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Méthode non autorisée.' })
    return
  }

  const { profileName, pin, payload } = req.body ?? {}

  if (typeof profileName !== 'string' || !profileName.trim()) {
    res.status(400).json({ error: 'Nom de profil manquant.' })
    return
  }
  if (typeof pin !== 'string' || !/^\d{4}$/.test(pin)) {
    res.status(400).json({ error: 'Le code doit être à 4 chiffres.' })
    return
  }
  if (!payload || typeof payload !== 'object') {
    res.status(400).json({ error: 'Données manquantes.' })
    return
  }

  if (!redisConfigured) {
    res.status(503).json({ error: 'Sauvegarde indisponible : variables Redis manquantes côté serveur (Vercel).' })
    return
  }

  const normalizedName = profileName.trim().toLowerCase()
  const key = `profile:${normalizedName}`
  const pinHash = hashPin(pin, normalizedName)

  try {
    // Le premier backup sous un nom donné "réserve" ce nom avec ce code —
    // un backup suivant sous le même nom doit fournir le même code, sinon
    // n'importe qui pourrait écraser la progression de quelqu'un d'autre
    // rien qu'en devinant/réutilisant un prénom courant.
    const existing = await redis.get<{ pinHash: string }>(key)
    if (existing && existing.pinHash !== pinHash) {
      res.status(403).json({ error: 'Ce nom de profil est déjà utilisé avec un autre code.' })
      return
    }

    await redis.set(key, {
      pinHash,
      displayName: profileName.trim(),
      payload,
      savedAt: Date.now(),
    })

    res.status(200).json({ ok: true })
  } catch (err) {
    // Convertit un crash Redis (identifiants invalides, service
    // injoignable...) en réponse JSON exploitable plutôt que de laisser
    // la fonction planter sans message (voir le commentaire sur
    // `redisConfigured` dans _redis.ts).
    console.error('backup: erreur Redis', err)
    res.status(500).json({ error: 'Service de sauvegarde indisponible pour le moment.' })
  }
}
