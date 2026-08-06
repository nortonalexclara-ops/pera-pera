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
