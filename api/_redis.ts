import { Redis } from '@upstash/redis'

// Préfixe `_` — convention Vercel pour un fichier partagé dans /api qui
// n'est PAS exposé comme route (contrairement à backup.ts/restore.ts).
//
// `Redis.fromEnv()` cherche `UPSTASH_REDIS_REST_URL`/`_TOKEN` par défaut,
// mais l'intégration Marketplace "Upstash for Redis" de Vercel a créé les
// variables sous des noms différents (constaté dans Settings → Environment
// Variables du projet, pas de choix possible côté code) :
// `UPSTASH_REDIS_REST_KV_REST_API_URL`/`_TOKEN`. On construit donc le
// client explicitement avec ces noms plutôt que `fromEnv()`.
//
// `redisConfigured` sert à échouer proprement (message clair, réponse
// JSON) plutôt que de laisser `new Redis({ url: undefined!, ... })`
// planter la fonction serverless entière au chargement du module — un
// crash à ce niveau ne renvoie AUCUN détail au client
// (FUNCTION_INVOCATION_FAILED, page générique Vercel), impossible à
// diagnostiquer depuis l'extérieur. Avec `?? ''` la construction ne
// plante jamais ; c'est `redisConfigured` qui permet à chaque handler de
// renvoyer un message exploitable si les variables manquent vraiment.
export const redisConfigured = Boolean(
  process.env.UPSTASH_REDIS_REST_KV_REST_API_URL && process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN,
)

export const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_KV_REST_API_URL ?? '',
  token: process.env.UPSTASH_REDIS_REST_KV_REST_API_TOKEN ?? '',
})
