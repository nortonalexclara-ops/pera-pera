import type { ProfileBackupPayload } from '../../db/profileSync'

async function parseErrorMessage(res: Response, fallback: string): Promise<string> {
  try {
    const data = await res.json()
    return typeof data?.error === 'string' ? data.error : fallback
  } catch {
    return fallback
  }
}

// Porte le code HTTP sur l'erreur — sert au moteur de synchro
// automatique (cloudSyncEngine.ts) à distinguer "pas encore de
// sauvegarde distante pour ce nom+code" (404, premier sync : rien à
// fusionner) d'un vrai échec (réseau, serveur en panne) qu'il ne faut
// surtout pas traiter comme "distant vide" sous peine d'écraser des
// données qu'on n'a simplement pas réussi à lire.
export class HttpError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

export async function backupProfile(profileName: string, pin: string, payload: ProfileBackupPayload): Promise<void> {
  const res = await fetch('/api/backup', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ profileName, pin, payload }),
  })
  if (!res.ok) throw new HttpError(await parseErrorMessage(res, 'Échec de la sauvegarde.'), res.status)
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
  if (!res.ok) throw new HttpError(await parseErrorMessage(res, 'Échec de la récupération.'), res.status)
  return res.json()
}

export interface DeleteAccountResult {
  ok: boolean
  // true seulement si le serveur a explicitement refusé (mauvais code) —
  // le seul cas où la suppression locale doit être bloquée. Un souci
  // d'infra (Redis indisponible, réseau coupé...) ne doit PAS empêcher de
  // supprimer un profil localement : la protection par code n'est de
  // toute façon pas une vraie sécurité (voir hashPin dans api/*.ts),
  // juste un frein sur un appareil partagé — un backend en panne ne doit
  // pas bloquer la gestion basique des profils.
  blockedByWrongPin: boolean
  error?: string
}

// Vérifie/supprime la sauvegarde en ligne avant suppression locale du
// profil. `pin` peut être vide — si le profil n'a jamais été sauvegardé,
// le serveur répond succès quand même (rien à protéger), sinon le code
// doit correspondre exactement (voir api/delete-account.ts).
export async function deleteAccountBackup(profileName: string, pin: string): Promise<DeleteAccountResult> {
  try {
    const res = await fetch('/api/delete-account', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ profileName, pin }),
    })
    if (res.ok) return { ok: true, blockedByWrongPin: false }
    if (res.status === 401 || res.status === 403) {
      return { ok: false, blockedByWrongPin: true, error: await parseErrorMessage(res, 'Code incorrect.') }
    }
    return { ok: false, blockedByWrongPin: false, error: await parseErrorMessage(res, 'Échec de la suppression.') }
  } catch (err) {
    return { ok: false, blockedByWrongPin: false, error: err instanceof Error ? err.message : 'Échec de la suppression.' }
  }
}
