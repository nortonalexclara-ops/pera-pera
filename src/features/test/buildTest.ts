import { mockKanjiList, type JlptLevel, type Kanji } from '../kanji/mockKanji'
import { mockVocabList, type VocabWord } from '../vocab/mockVocab'
import { mockGrammarList, type GrammarPoint } from '../grammar/mockGrammar'
import type { ItemKind } from '../../db/db'
import type { FuriganaSegment } from '../../components/ui/FuriganaText'
import { wordExceedsOwnLevel, wordHasUnmasteredKanji } from '../../utils/kanjiLevel'

// Un item vu pendant la séance (kanji/vocab/grammaire dont l'utilisateur a
// pris une décision Maîtrisé/À revoir) — c'est cette liste, pas le contenu
// entier du niveau, qui alimente "Tester mes connaissances".
export type SeenItem =
  | { kind: 'kanji'; id: string; data: Kanji }
  | { kind: 'vocab'; id: string; data: VocabWord }
  | { kind: 'grammar'; id: string; data: GrammarPoint }

export interface TestItem {
  id: string
  kind: 'kanji' | 'vocab' | 'grammar'
  prompt: string
  // Toutes les lectures acceptées (un kanji a souvent plusieurs on'yomi/
  // kun'yomi valides, avec ou sans okurigana — on accepte n'importe
  // laquelle plutôt que d'exiger une lecture précise hors contexte).
  readings: string[]
  meanings: string[]
  // Présents uniquement pour le vocabulaire (voir vocabToTestItem) — sert
  // à décider, au moment du rendu, s'il faut afficher `prompt` avec
  // furigana plutôt qu'en clair (voir needsFurigana plus bas) : même
  // règle que le recto de VocabCardLoop, un mot dont un kanji n'est pas
  // encore enseigné/maîtrisé par CE profil ne doit jamais être montré nu.
  promptSegments?: FuriganaSegment[]
  jlptLevel?: JlptLevel
}

export type Direction = 'jp-to-fr' | 'fr-to-jp'
export type Mode = 'write' | 'qcm'

// Une option de QCM porte son propre `kind`/`jlptLevel`/`promptSegments`
// (pas seulement `display`) car chaque option vient d'un item DIFFÉRENT
// du pool (les leurres) — la décision furigana doit se faire par option,
// pas seulement pour l'item de la question.
export interface TestOption {
  display: string
  kind: TestItem['kind']
  promptSegments?: FuriganaSegment[]
  jlptLevel?: JlptLevel
}

export interface TestQuestion {
  item: TestItem
  direction: Direction
  mode: Mode
  // Réponse "canonique" affichée à la correction (les autres réponses
  // acceptées restent valides même si on n'en montre qu'une combinaison).
  correctAnswer: string
  options?: TestOption[]
}

// Même règle que le recto de VocabCardLoop / GrammarCardLoop (voir
// wordExceedsOwnLevel/wordHasUnmasteredKanji, utils/kanjiLevel.ts) : un
// mot ou motif japonais affiché dans le test (prompt OU option de QCM)
// montre ses furigana si un de ses kanjis dépasse le niveau de l'item
// dans le programme, ou n'est pas encore maîtrisé par ce profil
// précisément — sinon le test forcerait à déchiffrer un kanji jamais
// enseigné. Vocabulaire et grammaire uniquement (voir vocabToTestItem/
// grammarToTestItem) — un kanji EST la question posée (kind: 'kanji'),
// pas la peine de lui-même donner sa lecture en indice. Sans effet non
// plus sur les options en sens jp-to-fr (des sens en français, jamais de
// furigana à y montrer).
export function needsFurigana(
  kind: TestItem['kind'],
  word: string,
  jlptLevel: JlptLevel | undefined,
  masteredKanjiIds: Set<string>,
): boolean {
  if ((kind !== 'vocab' && kind !== 'grammar') || !jlptLevel) return false
  return wordExceedsOwnLevel(word, jlptLevel) || wordHasUnmasteredKanji(word, masteredKanjiIds)
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

// "あ(う) (au)" → ["あ", "あう"] (lecture nue ET lecture + okurigana) ;
// "ジン (jin)" → ["ジン"] (pas d'okurigana à extraire).
function parseReadingEntry(raw: string): string[] {
  const withoutRomaji = raw.replace(/\s*\([^)]*\)\s*$/, '').trim()
  const okuriganaMatch = withoutRomaji.match(/^(.+?)\(([^)]+)\)$/)
  if (okuriganaMatch) {
    const [, base, okurigana] = okuriganaMatch
    return [base, base + okurigana]
  }
  return [withoutRomaji]
}

function extractReadings(rawReadings: string[]): string[] {
  return rawReadings.flatMap(parseReadingEntry).filter(Boolean)
}

function reconstructReading(segments: { text: string; reading?: string }[]): string {
  return segments.map((s) => s.reading ?? s.text).join('')
}

// Katakana → hiragana (les deux syllabaires sont sur des plages Unicode
// décalées d'un offset fixe) — un kanji est conventionnellement lu en
// katakana pour l'on'yomi, mais on ne va pas exiger de l'utilisateur qu'il
// devine quel syllabaire utiliser : les deux sont acceptés indifféremment.
function toHiragana(s: string): string {
  return s.replace(/[ァ-ヶ]/g, (ch) => String.fromCharCode(ch.charCodeAt(0) - 0x60))
}

function normalize(s: string): string {
  return toHiragana(
    s
      .trim()
      .toLowerCase()
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, ''),
  )
}

/**
 * Compare une réponse libre à une liste de candidats acceptés, en restant
 * volontairement généreux : une correspondance exacte suffit bien sûr, mais
 * on accepte aussi qu'un candidat soit contenu dans la réponse ou l'inverse
 * (ex. écrire "会う", le vrai mot avec okurigana, doit valider le kanji 会 ;
 * répondre "terminer" doit valider un sens composite "terminer, régler (une
 * affaire)"). Les candidats à sens multiples ("terminer, régler...") sont
 * aussi éclatés en fragments comparés individuellement.
 */
export function isAnswerAccepted(input: string, candidates: string[]): boolean {
  const norm = normalize(input)
  if (!norm) return false
  return candidates.some((c) => {
    const fragments = c
      .split(/[,、・]/)
      .map((f) => normalize(f.replace(/\([^)]*\)/g, '')))
      .filter(Boolean)
    return fragments.some((f) => norm === f || norm.includes(f) || f.includes(norm))
  })
}

function kanjiToTestItem(k: Kanji): TestItem {
  return {
    id: `kanji-${k.id}`,
    kind: 'kanji',
    prompt: k.character,
    readings: extractReadings([...k.onyomi, ...k.kunyomi]),
    meanings: k.meanings,
  }
}

function vocabToTestItem(w: VocabWord): TestItem {
  return {
    id: `vocab-${w.id}`,
    kind: 'vocab',
    prompt: w.word,
    readings: [reconstructReading(w.wordSegments)],
    meanings: w.meanings,
    promptSegments: w.wordSegments,
    jlptLevel: w.jlptLevel,
  }
}

function grammarToTestItem(g: GrammarPoint): TestItem {
  return {
    id: `grammar-${g.id}`,
    kind: 'grammar',
    prompt: g.pattern,
    readings: [],
    meanings: [g.meaning],
    promptSegments: g.patternSegments,
    jlptLevel: g.jlptLevel,
  }
}

/**
 * Rassemble tout le contenu d'un niveau (kanjis + vocabulaire + grammaire
 * des modules choisis) en une liste testable. Pour la grammaire, le binôme
 * prompt/traduction devient motif ↔ sens (ex. "〜てください" ↔ "Demander
 * poliment de faire quelque chose") — même structure que kanji/vocab, donc
 * réutilise tel quel le moteur de question (write/QCM, jp-to-fr/fr-to-jp)
 * sans branche spéciale.
 *
 * **Repli seulement** : le chemin normal (séance → test) utilise
 * `buildTestPoolFromSeen`, limité à ce qui a été vu pendant la séance.
 * Celle-ci reste utile si `/session/test` est atteint sans passer par une
 * séance (navigation directe, `seenItems` absent de l'état de la route).
 */
export function buildTestPool(modules: string[], level: JlptLevel | null): TestItem[] {
  const items: TestItem[] = []

  if (modules.includes('Kanjis')) {
    const kanjis = level ? mockKanjiList.filter((k) => k.jlptLevel === level) : mockKanjiList
    items.push(...kanjis.map(kanjiToTestItem))
  }

  if (modules.includes('Vocabulaire')) {
    const words = level ? mockVocabList.filter((w) => w.jlptLevel === level) : mockVocabList
    items.push(...words.map(vocabToTestItem))
  }

  if (modules.includes('Grammaire')) {
    const points = level ? mockGrammarList.filter((g) => g.jlptLevel === level) : mockGrammarList
    items.push(...points.map(grammarToTestItem))
  }

  return items
}

/**
 * Construit le pool testable directement à partir de ce que l'utilisateur
 * vient de voir pendant la séance (chaque item pour lequel une décision
 * Maîtrisé/À revoir a été prise), plutôt que de refiltrer tout le contenu
 * du niveau — sur un niveau qui a maintenant des dizaines/centaines
 * d'items, tester sur "tout le niveau" n'aurait plus de rapport avec ce qui
 * vient d'être étudié. Dédoublonné par id au cas où (pas de doublon en
 * usage normal, mais coûte rien à vérifier).
 */
export function buildTestPoolFromSeen(seenItems: SeenItem[]): TestItem[] {
  const seenIds = new Set<string>()
  const items: TestItem[] = []
  for (const si of seenItems) {
    const testItem =
      si.kind === 'kanji' ? kanjiToTestItem(si.data) : si.kind === 'vocab' ? vocabToTestItem(si.data) : grammarToTestItem(si.data)
    if (seenIds.has(testItem.id)) continue
    seenIds.add(testItem.id)
    items.push(testItem)
  }
  return items
}

// Construit une question pour un item donné, avec un sens (JP→FR / FR→JP)
// tiré au sort. Toujours en QCM (demande explicite de l'utilisatrice :
// écrire la réponse est trop pénible) — seul repli sur "write" quand le pool
// n'a qu'un seul item, où un QCM n'a pas de sens (impossible de construire
// ne serait-ce qu'un leurre). Séparée de `buildQuestions`/`buildOneQuestion`
// pour être réutilisable telle quelle par les deux (lot fixe vs tirage à la
// demande, voir MasteryTest.tsx).
function buildQuestionForItem(item: TestItem, pool: TestItem[]): TestQuestion {
  const direction: Direction = Math.random() < 0.5 ? 'jp-to-fr' : 'fr-to-jp'
  const mode: Mode = pool.length >= 2 ? 'qcm' : 'write'

  const correctAnswer =
    direction === 'jp-to-fr'
      ? item.meanings.join(' / ')
      : `${item.prompt}${item.readings.length ? ` (${item.readings.join(' / ')})` : ''}`

  let options: TestOption[] | undefined
  if (mode === 'qcm') {
    // En sens fr-to-jp, chaque option porte le `promptSegments`/`jlptLevel`
    // de SON PROPRE item (pas celui de la question) — les leurres viennent
    // d'items différents, la décision furigana (voir needsFurigana) doit
    // se faire par option.
    const toOption = (d: TestItem, value: string): TestOption =>
      direction === 'jp-to-fr'
        ? { display: value, kind: d.kind }
        : { display: value, kind: d.kind, promptSegments: d.promptSegments, jlptLevel: d.jlptLevel }

    const correctValue = direction === 'jp-to-fr' ? item.meanings[0] : item.prompt
    const correctOption = toOption(item, correctValue)
    // Deux items différents peuvent partager le même sens affiché (ex. le
    // kanji 大 et le mot 大きい ont tous les deux "grand" comme
    // traduction) — dédoublonner par valeur affichée, pas seulement par
    // id, sinon deux options identiques et indiscernables apparaissent.
    const seenValues = new Set([correctValue])
    const distractors: TestOption[] = []
    // Les leurres du même type (kanji/vocab/grammaire) d'abord — plus
    // pertinent pédagogiquement qu'un mélange (comparer un motif de
    // grammaire à un sens de kanji au hasard) — puis on complète avec le
    // reste du pool si le module n'a pas assez d'items pour 3 leurres.
    const rest = shuffle(pool.filter((p) => p.id !== item.id))
    const sameKindFirst = [...rest.filter((p) => p.kind === item.kind), ...rest.filter((p) => p.kind !== item.kind)]
    for (const d of sameKindFirst) {
      const value = direction === 'jp-to-fr' ? d.meanings[0] : d.prompt
      if (seenValues.has(value)) continue
      seenValues.add(value)
      distractors.push(toOption(d, value))
      if (distractors.length >= 3) break
    }
    options = shuffle([correctOption, ...distractors])
  }

  return { item, direction, mode, correctAnswer, options }
}

// Une question par item du pool, mélangée — lot fixe utilisé par le test de
// fin de séance (TestKnowledge.tsx).
export function buildQuestions(pool: TestItem[]): TestQuestion[] {
  return shuffle(pool).map((item) => buildQuestionForItem(item, pool))
}

// Une seule question, item tiré au sort dans le pool — utilisé par le test
// illimité (MasteryTest.tsx) pour générer les questions une par une plutôt
// qu'en lot fixe, tant que l'utilisatrice ne clique pas sur "Terminer".
export function buildOneQuestion(pool: TestItem[]): TestQuestion {
  const item = pool[Math.floor(Math.random() * pool.length)]
  return buildQuestionForItem(item, pool)
}

/**
 * Pool testable limité à ce que le profil a marqué "Maîtrisé", pour le
 * niveau et les modules choisis — utilisé par le test illimité
 * (MasteryTest.tsx), qui interroge sur les connaissances déjà acquises
 * plutôt que sur tout le contenu d'un niveau (contrairement à
 * `buildTestPool`).
 */
export function buildMasteredTestPool(
  modules: string[],
  level: JlptLevel,
  masteredIds: Record<ItemKind, Set<string>>,
): TestItem[] {
  const items: TestItem[] = []

  if (modules.includes('Kanjis')) {
    const kanjis = mockKanjiList.filter((k) => k.jlptLevel === level && masteredIds.kanji.has(k.id))
    items.push(...kanjis.map(kanjiToTestItem))
  }

  if (modules.includes('Vocabulaire')) {
    const words = mockVocabList.filter((w) => w.jlptLevel === level && masteredIds.vocab.has(w.id))
    items.push(...words.map(vocabToTestItem))
  }

  if (modules.includes('Grammaire')) {
    const points = mockGrammarList.filter((g) => g.jlptLevel === level && masteredIds.grammar.has(g.id))
    items.push(...points.map(grammarToTestItem))
  }

  return items
}
