import type { VercelRequest, VercelResponse } from '@vercel/node'
import webpush from 'web-push'
import { redis, redisConfigured } from './_redis.js'

// Déclenché une fois par jour par Vercel Cron (voir vercel.json,
// "crons") — envoie le rappel à tous les profils abonnés (voir
// api/push-subscribe.ts, une clé `push:<profileId>` par profil). Pas de
// contenu personnalisé par profil pour l'instant (même message pour
// tout le monde, demande explicite de l'utilisatrice : "à tout le
// monde"), donc pas besoin de connaître autre chose que l'abonnement lui-
// même.
//
// Protégé par CRON_SECRET : Vercel Cron envoie automatiquement
// `Authorization: Bearer $CRON_SECRET` pour les routes listées dans
// "crons" — sans cette vérification, n'importe qui connaissant l'URL
// pourrait déclencher l'envoi à tout le monde à volonté.
export default async function handler(req: VercelRequest, res: VercelResponse) {
  const authHeader = req.headers.authorization
  if (process.env.CRON_SECRET && authHeader !== `Bearer ${process.env.CRON_SECRET}`) {
    res.status(401).json({ error: 'Non autorisé.' })
    return
  }

  if (!redisConfigured) {
    res.status(503).json({ error: 'Rappels indisponibles : variables Redis manquantes côté serveur (Vercel).' })
    return
  }
  const vapidPublicKey = process.env.VAPID_PUBLIC_KEY
  const vapidPrivateKey = process.env.VAPID_PRIVATE_KEY
  if (!vapidPublicKey || !vapidPrivateKey) {
    res.status(503).json({ error: 'Rappels indisponibles : clés VAPID manquantes côté serveur (Vercel).' })
    return
  }

  webpush.setVapidDetails('mailto:nortonalexclara@gmail.com', vapidPublicKey, vapidPrivateKey)

  const keys = await redis.keys('push:*')
  let sent = 0
  let removed = 0
  const errors: string[] = []

  await Promise.all(
    keys.map(async (key) => {
      const subscription = await redis.get<PushSubscriptionJSON>(key)
      if (!subscription) return
      try {
        await webpush.sendNotification(
          subscription as never,
          JSON.stringify({
            title: 'Pera Pera',
            body: "C'est l'heure de réviser un peu de japonais !",
          }),
        )
        sent++
      } catch (err) {
        // 404/410 : l'abonnement n'est plus valide côté navigateur
        // (désinstallation, notifications désactivées système...) — on le
        // retire plutôt que de continuer à échouer dessus chaque jour.
        const status = (err as { statusCode?: number })?.statusCode
        if (status === 404 || status === 410) {
          await redis.del(key)
          removed++
        } else {
          errors.push(`${key}: ${err instanceof Error ? err.message : String(err)}`)
        }
      }
    }),
  )

  res.status(200).json({ ok: true, sent, removed, total: keys.length, errors })
}
