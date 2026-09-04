import { createClient } from '@supabase/supabase-js'

// `null` si les variables d'env ne sont pas configurées (dev local sans
// .env.local, ou déploiement avant leur ajout sur Vercel) — tout le code
// qui utilise ce client vérifie explicitement ce cas plutôt que de planter,
// pour que le reste de l'appli (profils locaux, sauvegarde nom+code déjà
// existante) continue de fonctionner sans connexion par email configurée.
const url = import.meta.env.VITE_SUPABASE_URL as string | undefined
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string | undefined

export const supabase = url && anonKey ? createClient(url, anonKey) : null
