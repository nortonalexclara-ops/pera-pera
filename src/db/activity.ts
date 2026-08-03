import { db } from './db'

// Format local 'YYYY-MM-DD' (pas UTC — un utilisateur qui pratique après
// minuit locale mais avant minuit UTC ne doit pas voir sa série cassée à
// tort).
function toLocalDateStr(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

// Appelé à chaque carte passée en séance (voir CardLoopShell.advance) —
// une seule ligne par jour et par profil, pas une par carte.
export async function recordActivityToday(profileId: string): Promise<void> {
  if (!profileId) return
  const today = toLocalDateStr(new Date())
  const existing = await db.activity.where({ profileId, date: today }).first()
  if (existing) return
  await db.activity.add({ profileId, date: today })
}

// "N jours de suite" : remonte depuis aujourd'hui tant que chaque jour a
// une ligne d'activité. Si aujourd'hui n'a encore rien (l'utilisateur n'a
// pas encore pratiqué aujourd'hui), on part d'hier plutôt qu'annoncer 0
// dans la journée — la série ne casse qu'après un jour entier sans
// pratique, pas dès le réveil.
export async function getStreak(profileId: string): Promise<number> {
  if (!profileId) return 0
  const rows = await db.activity.where({ profileId }).toArray()
  const dates = new Set(rows.map((r) => r.date))
  if (dates.size === 0) return 0

  const cursor = new Date()
  if (!dates.has(toLocalDateStr(cursor))) {
    cursor.setDate(cursor.getDate() - 1)
  }
  let streak = 0
  while (dates.has(toLocalDateStr(cursor))) {
    streak++
    cursor.setDate(cursor.getDate() - 1)
  }
  return streak
}

export async function resetActivity(profileId: string): Promise<void> {
  if (!profileId) return
  await db.activity.where({ profileId }).delete()
}
