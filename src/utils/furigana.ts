import type { FuriganaSegment } from '../components/ui/FuriganaText'

// Reconstruit la lecture complète (kana) d'un texte segmenté avec
// furigana — un segment sans `reading` (ex. terminaison verbale "べる"
// dans 食べる) est déjà en kana, donc gardé tel quel. Sert à la fois à la
// recherche Explorer (voir buildExplorerItems.ts) et à la prononciation
// audio (voir SpeakButton/speech.ts) : la vraie lecture d'un mot, pas
// juste sa forme écrite en kanji qu'un moteur de synthèse vocale pourrait
// mal désambiguïser.
export function reconstructReading(segments: FuriganaSegment[]): string {
  return segments.map((s) => s.reading ?? s.text).join('')
}

// Texte brut (kanji/kana, sans la lecture) d'un mot segmenté — sert à
// identifier un mot de façon stable (ex. sauvegarde d'un mot exemple en
// séance, voir KanjiCardLoop.tsx) et à rebondir vers sa propre fiche
// Explorer, pas à l'affichage (voir FuriganaText pour ça).
export function reconstructText(segments: FuriganaSegment[]): string {
  return segments.map((s) => s.text).join('')
}
