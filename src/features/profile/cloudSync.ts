import type { ProfileBackupPayload } from '../../db/profileSync'

async function parseErrorMessage(res: Response, fallback: string): Promise<string> {
  try {
    const data = await res.json()
    return typeof data?.error === 'string' ? data.error : fallback
  } catch {
    return fallback
  }
}

export async function backupProfile(profileName: string, pin: string, payload: ProfileBackupPayload): Promise<void> {
  const res = await fetch('/api/backup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profileName, pin, payload }),
  })
  if (!res.ok) throw new Error(await parseErrorMessage(res, 'Échec de la sauvegarde.'))
}

export interface RestoreResult {
  displayName: string
  payload: ProfileBackupPayload
  savedAt: number
}

export async function restoreProfile(profileName: string, pin: string): Promise<RestoreResult> {
  const res = await fetch('/api/restore', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profileName, pin }),
  })
  if (!res.ok) throw new Error(await parseErrorMessage(res, 'Échec de la récupération.'))
  return res.json()
}

// Vérifie/supprime la sauvegarde en ligne avant suppression locale du
// profil. `pin` peut être vide — si le profil n'a jamais été sauvegardé,
// le serveur répond succès quand même (rien à protéger), sinon le code
// doit correspondre exactement (voir api/delete-account.ts).
export async function deleteAccountBackup(profileName: string, pin: string): Promise<void> {
  const res = await fetch('/api/delete-account', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profileName, pin }),
  })
  if (!res.ok) throw new Error(await parseErrorMessage(res, 'Échec de la suppression.'))
}
