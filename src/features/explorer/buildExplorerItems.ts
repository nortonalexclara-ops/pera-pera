import { mockKanjiList, type Kanji, type JlptLevel } from '../kanji/mockKanji'
import { mockVocabList, type VocabWord } from '../vocab/mockVocab'
import { mockGrammarList, type GrammarPoint } from '../grammar/mockGrammar'
import { reconstructReading } from '../../utils/furigana'
import { shuffleArray } from '../../utils/shuffle'

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

// Virgule entre lectures d'un même type (intra on'yomi / intra
// kun'yomi), slash entre les deux types — demande explicite de
// l'utilisatrice, remplace le simple espace qui ne distinguait pas les
// deux groupes (ex. "ジン ニン ひと" devient "ジン, ニン / ひと").
function kanjiReadings(k: Kanji): string {
  const strip = (s: string) => s.replace(/[（(][^）)]*[）)]/g, '').trim()
  const onyomi = k.onyomi.map(strip).join(', ')
  const kunyomi = k.kunyomi.map(strip).join(', ')
  if (onyomi && kunyomi) return `${onyomi} / ${kunyomi}`
  return onyomi || kunyomi
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

  // Vocabulaire mélangé (demande utilisatrice) — l'ordre du dataset
  // suivait l'ordre alphabétique (par lecture), pas très utile pour
  // parcourir librement. Mélangé une seule fois ici (Explorer.tsx
  // mémoïse `buildExplorerItems()` sur tout le montage), pas à chaque
  // rendu. Kanjis/grammaire gardent leur ordre (progression JLPT), pas
  // concernés par la demande.
  return [...kanjiItems, ...shuffleArray(vocabItems), ...grammarItems]
}

export function normalizeSearch(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
}
