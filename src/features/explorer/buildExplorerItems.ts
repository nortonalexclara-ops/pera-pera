import { mockKanjiList, type Kanji, type JlptLevel } from '../kanji/mockKanji'
import { mockVocabList, type VocabWord } from '../vocab/mockVocab'
import { mockGrammarList, type GrammarPoint } from '../grammar/mockGrammar'
import { reconstructReading } from '../../utils/furigana'
import { shuffleArray } from '../../utils/shuffle'
import type { DictionaryEntry } from '../dictionary/loadDictionary'

// 'dictionary' : entrées de référence brutes (voir loadDictionary.ts),
// pas du contenu appris — distinct des trois kinds curés, traité à part
// dans Explorer.tsx (pas de niveau, pas de maîtrise/favori, n'apparaît
// que sur une recherche active).
export type ExplorerKind = 'kanji' | 'vocab' | 'grammar' | 'dictionary'

export interface ExplorerItem {
  id: string
  kind: ExplorerKind
  // `null` pour les entrées du dictionnaire — pas de notion de niveau
  // JLPT sur du contenu de référence brut, contrairement au programme
  // curé. Le filtre par niveau (Explorer.tsx) les exclut alors
  // naturellement dès qu'un niveau précis est choisi (comportement déjà
  // existant, pas de code spécial à écrire pour ça).
  jlptLevel: JlptLevel | null
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
  data: Kanji | VocabWord | GrammarPoint | DictionaryEntry
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

// Séparée de `buildExplorerItems()` : le dictionnaire est chargé de
// façon asynchrone (voir loadDictionary.ts, fetchDictionary), pas
// disponible au chargement du module comme les trois datasets curés
// (bundlés dans le JS). Appelée depuis Explorer.tsx une fois le
// dictionnaire arrivé.
export function buildDictionaryExplorerItems(entries: DictionaryEntry[]): ExplorerItem[] {
  return entries.map((e) => {
    const headline = e.kanji[0] ?? e.kana[0]
    // Lecture affichée seulement si distincte du titre (un mot sans
    // kanji, ex. がっかり, a déjà sa lecture comme titre — pas la peine de
    // la répéter juste en dessous).
    const subLabel = e.kanji.length > 0 ? e.kana[0] ?? '' : ''
    const meanings = [...new Set(e.senses.flatMap((s) => s.gloss))]
    const searchText = [...e.kanji, ...e.kana, ...meanings].join(' ')
    return {
      id: `dict-${e.id}`,
      kind: 'dictionary',
      jlptLevel: null,
      headline,
      subLabel,
      meanings,
      searchText,
      normalizedSearchText: normalizeSearch(searchText),
      themes: [],
      data: e,
    }
  })
}

export function normalizeSearch(s: string): string {
  return s
    .trim()
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
}
