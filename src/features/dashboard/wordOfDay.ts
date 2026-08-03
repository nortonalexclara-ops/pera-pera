import { mockVocabList, type VocabWord } from '../vocab/mockVocab'

// Choix déterministe basé sur la date du jour (heure locale) — même mot
// pour tout le monde pendant toute la journée, change le lendemain, sans
// avoir besoin de tirer un nombre aléatoire à stocker quelque part.
// Remplace `mockWordOfDay`, jusque-là un seul mot fixe en dur.
export function getWordOfDay(): VocabWord {
  const now = new Date()
  const dayKey = now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate()
  const index = dayKey % mockVocabList.length
  return mockVocabList[index]
}
