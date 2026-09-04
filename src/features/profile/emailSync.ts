import { supabase } from '../../lib/supabaseClient'
import { getCurrentSession } from './emailAuth'
import type { ProfileBackupPayload } from '../../db/profileSync'

// Transport pour la synchro par compte email (Supabase Auth + Postgres,
// isolation par utilisateur via Row Level Security côté serveur — voir le
// script SQL fourni à l'utilisatrice pour la table `profile_backups`) —
// pendant de cloudSync.ts (nom+code / Redis). La fusion elle-même
// (cloudSyncMerge.ts) est partagée, seule la façon d'aller chercher/poser
// le payload distant change.
export async function backupProfileEmail(payload: ProfileBackupPayload, displayName: string): Promise<void> {
  if (!supabase) throw new Error('Connexion par email indisponible.')
  const session = await getCurrentSession()
  if (!session) throw new Error('Non connecté.')
  const { error } = await supabase.from('profile_backups').upsert({
    user_id: session.user.id,
    display_name: displayName,
    payload,
    updated_at: new Date().toISOString(),
  })
  if (error) throw new Error(error.message)
}

export async function restoreProfileEmail(): Promise<ProfileBackupPayload | null> {
  if (!supabase) throw new Error('Connexion par email indisponible.')
  const session = await getCurrentSession()
  if (!session) throw new Error('Non connecté.')
  const { data, error } = await supabase
    .from('profile_backups')
    .select('payload')
    .eq('user_id', session.user.id)
    .maybeSingle()
  if (error) throw new Error(error.message)
  return (data?.payload as ProfileBackupPayload | undefined) ?? null
}
