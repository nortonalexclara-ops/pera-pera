import { mockKanjiList, type Kanji, type JlptLevel } from '../kanji/mockKanji'
import { mockVocabList, type VocabWord } from '../vocab/mockVocab'
import { mockGrammarList, type GrammarPoint } from '../grammar/mockGrammar'

export type ExplorerKind = 'kanji' | 'vocab' | 'grammar'

export interface ExplorerItem {
  id: string
  kind: ExplorerKind
  jlptLevel: JlptLevel
  headline: string
  subLabel: string
  meanings: string[]
  searchText: string
  // Normalisé une seule fois à la construction plutôt qu'à chaque
  // filtrage — avec ~10 000 items, refaire `normalizeSearch` (NFD +
  // regex) sur chacun à CHAQUE frappe dans la recherche introduisait un
  // ralentissement perceptible (voir Explorer.tsx).
  normalizedSearchText: string
  // Champs lexicaux — uniquement les kanjis pour l'instant, tableau vide
  // sinon (pas de filtre "par thème" pour vocab/grammaire à ce stade).
  themes: string[]
  data: Kanji | VocabWord | GrammarPoint
}

function reconstructReading(segments: { text: string; reading?: string }[]): string {
  return segments.map((s) => s.reading ?? s.text).join('')
}

function kanjiReadings(k: Kanji): string {
  return [...k.onyomi, ...k.kunyomi].join(' ').replace(/[（(][^）)]*[）)]/g, '')
}

export function buildExplorerItems(): ExplorerItem[] {
  const kanjiItems: ExplorerItem[] = mockKanjiList.map((k) => {
    const searchText = [k.character, kanjiReadings(k), ...k.meanings, ...k.themes].join(' ')
    return {
      id: `kanji-${k.id}`,
      kind: 'kanji',
      jlptLevel: k.jlptLevel,
      headline: k.character,
      subLabel: kanjiReadings(k),
      meanings: k.meanings,
      searchText,
      normalizedSearchText: normalizeSearch(searchText),
      themes: k.themes,
      data: k,
    }
  })

  const vocabItems: ExplorerItem[] = mockVocabList.map((w) => {
    const searchText = [w.word, reconstructReading(w.wordSegments), ...w.meanings].join(' ')
    return {
      id: `vocab-${w.id}`,
      kind: 'vocab',
      jlptLevel: w.jlptLevel,
      headline: w.word,
      subLabel: reconstructReading(w.wordSegments),
      meanings: w.meanings,
      searchText,
      normalizedSearchText: normalizeSearch(searchText),
      themes: [],
      data: w,
    }
  })

  const grammarItems: ExplorerItem[] = mockGrammarList.map((g) => {
    const searchText = [g.pattern, g.meaning, g.rule].join(' ')
    return {
      id: `grammar-${g.id}`,
      kind: 'grammar',
      jlptLevel: g.jlptLevel,
      headline: g.pattern,
      // Pas de lecture séparée pour un point de grammaire — sub-label vide
      // plutôt que de répéter le sens, déjà affiché dans la colonne meaning.
      subLabel: '',
      meanings: [g.meaning],
      searchText,
      normalizedSearchText: normalizeSearch(searchText),
      themes: [],
      data: g,
    }
  })

  return [...kanjiItems, ...vocabItems, ...grammarItems]
}

export function normalizeSearch(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
}
