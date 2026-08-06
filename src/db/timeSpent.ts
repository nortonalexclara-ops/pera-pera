import { db } from './db'
import { toLocalDateStr } from './activity'

// Appelé régulièrement pendant une séance (voir CardLoopShell) avec le
// nombre de secondes écoulées depuis le dernier appel — cumulé sur la
// ligne du jour plutôt qu'une ligne par appel, pour ne pas exploser la
// table avec des micro-écritures.
export async function addTimeSpent(profileId: string, seconds: number): Promise<void> {
  if (!profileId || seconds <= 0) return
  const date = toLocalDateStr(new Date())
  const existing = await db.timeSpent.where({ profileId, date }).first()
  if (existing) {
    await db.timeSpent.update(existing.id!, { seconds: existing.seconds + seconds })
  } else {
    await db.timeSpent.add({ profileId, date, seconds })
  }
}

// Les `days` derniers jours (aujourd'hui inclus), les jours sans séance à
// 0 — pour un histogramme toujours de la même largeur, même en tout début
// de série ou après un jour sans pratique.
export async function getTimeSpentByDay(
  profileId: string,
  days = 7,
): Promise<{ date: string; seconds: number }[]> {
  if (!profileId) return []
  const rows = await db.timeSpent.where({ profileId }).toArray()
  const byDate = new Map(rows.map((r) => [r.date, r.seconds]))
  const today = new Date()
  const result: { date: string; seconds: number }[] = []
  for (let i = days - 1; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const date = toLocalDateStr(d)
    result.push({ date, seconds: byDate.get(date) ?? 0 })
  }
  return result
}

export async function resetTimeSpent(profileId: string): Promise<void> {
  if (!profileId) return
  await db.timeSpent.where({ profileId }).delete()
}
