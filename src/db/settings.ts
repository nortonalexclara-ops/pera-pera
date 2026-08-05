import { db } from './db'

// Valeur affichée avant que le profil ait choisi un objectif personnalisé
// (voir Settings.tsx "Objectif") — remplace l'ancien objectif fixe codé
// en dur (mockGoal.target).
export const DEFAULT_KANJI_GOAL = 500

export async function getKanjiGoal(profileId: string): Promise<number> {
  if (!profileId) return DEFAULT_KANJI_GOAL
  const row = await db.profileSettings.get(profileId)
  return row?.kanjiGoal ?? DEFAULT_KANJI_GOAL
}

export async function setKanjiGoal(profileId: string, goal: number): Promise<void> {
  if (!profileId) return
  const existing = await db.profileSettings.get(profileId)
  await db.profileSettings.put({ profileId, kanjiGoal: goal, hasCloudBackup: existing?.hasCloudBackup ?? false })
}

export async function getHasCloudBackup(profileId: string): Promise<boolean> {
  if (!profileId) return false
  const row = await db.profileSettings.get(profileId)
  return row?.hasCloudBackup ?? false
}

export async function setHasCloudBackup(profileId: string, value: boolean): Promise<void> {
  if (!profileId) return
  const existing = await db.profileSettings.get(profileId)
  await db.profileSettings.put({ profileId, kanjiGoal: existing?.kanjiGoal ?? DEFAULT_KANJI_GOAL, hasCloudBackup: value })
}
