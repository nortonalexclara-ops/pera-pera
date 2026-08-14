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

export interface TestRecord {
  bestScore: number
  bestTimeSeconds: number
}

export async function getTestRecord(profileId: string): Promise<TestRecord> {
  if (!profileId) return { bestScore: 0, bestTimeSeconds: 0 }
  const row = await db.profileSettings.get(profileId)
  return { bestScore: row?.bestTestScore ?? 0, bestTimeSeconds: row?.bestTestTimeSeconds ?? 0 }
}

// Score et temps comparés indépendamment à leur propre record précédent
// (voir ProfileSettingsRecord) — un essai peut battre l'un sans battre
// l'autre (ex. plus de bonnes réponses mais en moins de temps que le
// record de temps tenu). Retourne lesquels viennent d'être battus, pour
// afficher "Nouveau record !" sur le récap du test (MasteryTest.tsx).
export async function recordTestResult(
  profileId: string,
  score: number,
  timeSeconds: number,
): Promise<{ newScoreRecord: boolean; newTimeRecord: boolean }> {
  if (!profileId) return { newScoreRecord: false, newTimeRecord: false }
  const existing = await db.profileSettings.get(profileId)
  const prevScore = existing?.bestTestScore ?? 0
  const prevTime = existing?.bestTestTimeSeconds ?? 0
  const newScoreRecord = score > prevScore
  const newTimeRecord = timeSeconds > prevTime
  if (newScoreRecord || newTimeRecord) {
    await db.profileSettings.put({
      profileId,
      kanjiGoal: existing?.kanjiGoal ?? DEFAULT_KANJI_GOAL,
      hasCloudBackup: existing?.hasCloudBackup ?? false,
      bestTestScore: Math.max(prevScore, score),
      bestTestTimeSeconds: Math.max(prevTime, timeSeconds),
    })
  }
  return { newScoreRecord, newTimeRecord }
}
