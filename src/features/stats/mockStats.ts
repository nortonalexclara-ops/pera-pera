// Depuis l'ajout de la persistance (profils réels + mémoire de "Maîtrisé",
// voir src/db/), la progression par niveau JLPT et la répartition par
// module sont calculées en direct depuis la vraie base (voir
// `StatsScreen.tsx` — `mockKanjiList`/`mockVocabList`/`mockGrammarList`
// pour les totaux, `getMasteredIds` pour les comptes maîtrisés). Il ne
// reste ici que ce qui n'a pas encore de tracking réel équivalent :
// difficulté par item et temps passé à écrire (pas demandé pour l'instant,
// voir PROJECT_STATE.md).

export type HardestItemKind = 'kanji' | 'vocab' | 'grammar'

export interface HardestItemEntry {
  kind: HardestItemKind
  // Référence vers mockKanjiList / mockVocabList / mockGrammarList selon
  // kind — pas de duplication de caractère/mot/sens ici.
  itemId: string
  // Simule un taux d'erreur en révision (0-100).
  missRate: number
}

// Mélange volontaire des 3 types de contenu (2 de chaque) — un classement
// uniquement composé de kanjis donnait la même impression déséquilibrée
// que le reste de la page à corriger.
export const mockHardestItems: HardestItemEntry[] = [
  { kind: 'kanji', itemId: 'urei', missRate: 78 },
  { kind: 'grammar', itemId: 'nakerebanarimasen', missRate: 69 },
  { kind: 'vocab', itemId: 'muzukashii1', missRate: 64 },
  { kind: 'kanji', itemId: 'takuwaeru', missRate: 58 },
  { kind: 'grammar', itemId: 'te-moraimasu', missRate: 51 },
  { kind: 'vocab', itemId: 'kuru3', missRate: 46 },
]

export interface WritingDayEntry {
  day: string
  minutes: number
}

// Semaine glissante, du plus ancien au plus récent.
export const mockWritingTime: WritingDayEntry[] = [
  { day: 'Lun', minutes: 12 },
  { day: 'Mar', minutes: 8 },
  { day: 'Mer', minutes: 19 },
  { day: 'Jeu', minutes: 5 },
  { day: 'Ven', minutes: 15 },
  { day: 'Sam', minutes: 24 },
  { day: 'Dim', minutes: 11 },
]
