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

// Supprime la sauvegarde Supabase du compte connecté (voir Settings.tsx
// "Supprimer ce profil") — protégé par les policies RLS posées sur
// `profile_backups` (auth.uid() = user_id), seule la personne connectée
// avec CE compte peut supprimer SA ligne : pas besoin de redemander un
// code ici, la connexion elle-même (email + mot de passe) est déjà la
// protection.
export async function deleteEmailBackup(): Promise<void> {
  if (!supabase) return
  const session = await getCurrentSession()
  if (!session) return
  const { error } = await supabase.from('profile_backups').delete().eq('user_id', session.user.id)
  if (error) throw new Error(error.message)
}

// Comme restoreProfileEmail, mais renvoie aussi le nom affiché sauvegardé
// avec ce compte — sert à nommer CORRECTEMENT le nouveau profil local créé
// lors d'une connexion sur un nouvel appareil (voir completeEmailAuth.ts),
// plutôt que de redemander un prénom qu'on connaît déjà.
export async function fetchRemoteProfileMeta(): Promise<{ displayName: string; payload: ProfileBackupPayload } | null> {
  if (!supabase) throw new Error('Connexion par email indisponible.')
  const session = await getCurrentSession()
  if (!session) throw new Error('Non connecté.')
  const { data, error } = await supabase
    .from('profile_backups')
    .select('display_name, payload')
    .eq('user_id', session.user.id)
    .maybeSingle()
  if (error) throw new Error(error.message)
  if (!data) return null
  return { displayName: data.display_name as string, payload: data.payload as ProfileBackupPayload }
}
