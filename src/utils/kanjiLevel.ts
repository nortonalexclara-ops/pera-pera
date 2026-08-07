import { mockKanjiList, type JlptLevel, type Kanji } from '../features/kanji/mockKanji'

// N5 = le plus facile, N1 = le plus avancé — rang numérique pour pouvoir
// comparer "plus dur que" simplement.
const LEVEL_RANK: Record<JlptLevel, number> = { N5: 5, N4: 4, N3: 3, N2: 2, N1: 1 }

// Construit une seule fois au chargement du module (pas à chaque appel) :
// quel niveau enseigne chaque kanji, d'après le propre programme kanjis
// de l'appli.
const kanjiLevelByChar = new Map<string, JlptLevel>()
mockKanjiList.forEach((k) => kanjiLevelByChar.set(k.character, k.jlptLevel))

// Caractère -> id (voir wordHasUnmasteredKanji) : `mastery`/`getMasteredIds`
// indexent par id de kanji, pas par caractère — il faut ce pont pour
// pouvoir tester "ce caractère du mot est-il dans l'ensemble des kanjis
// maîtrisés par CE profil".
const kanjiIdByChar = new Map<string, string>()
mockKanjiList.forEach((k) => kanjiIdByChar.set(k.character, k.id))

// Caractère -> kanji complet (voir kanjisInWord) : pour retrouver le
// tracé (`strokePaths`) de chaque kanji composant un mot de vocabulaire.
const kanjiByChar = new Map<string, Kanji>()
mockKanjiList.forEach((k) => kanjiByChar.set(k.character, k))

// Plage Unicode des idéogrammes CJK (kanji) — sert à ignorer les
// caractères kana/ponctuation d'un mot, seuls les kanji nous intéressent
// ici.
const KANJI_RANGE = /[一-龯㐀-䶿]/

// Un mot de vocabulaire "dépasse" son propre niveau JLPT si un des
// kanjis qui le composent est enseigné à un niveau plus avancé dans le
// programme kanjis de l'appli (ex. un mot N4 contenant un kanji classé
// N2 ici), OU si ce kanji n'est enseigné à AUCUN niveau (ex. 挨拶 — mot
// de vocabulaire N4, mais 挨 et 拶 n'apparaissent nulle part dans le
// programme kanjis de l'appli, cas réel signalé par l'utilisatrice).
// Sert à décider si le recto d'une carte de vocabulaire doit montrer les
// hiragana avant de deviner plutôt que de faire deviner un kanji jamais
// enseigné à ce stade.
export function wordExceedsOwnLevel(word: string, wordLevel: JlptLevel): boolean {
  const wordRank = LEVEL_RANK[wordLevel]
  for (const char of word) {
    if (!KANJI_RANGE.test(char)) continue
    const kanjiLevel = kanjiLevelByChar.get(char)
    if (!kanjiLevel || LEVEL_RANK[kanjiLevel] < wordRank) return true
  }
  return false
}

// Version personnalisée par profil : vrai si un des kanjis du mot n'est
// PAS encore coché "Maîtrisé" par CE profil précisément (peu importe le
// niveau JLPT officiel du kanji) — un kanji peut être "N5" sur le papier
// mais ne pas encore avoir été étudié par cette personne si son parcours
// dans le module Kanjis n'y est pas encore arrivé. Demande explicite de
// l'utilisatrice ("je dois connaître les mots mais pas les kanjis ?" à
// propos de 明るい/赤い/青い en N5 — leurs kanjis sont bien classés N5,
// donc `wordExceedsOwnLevel` seul ne les repère pas si elle ne les a
// simplement pas encore appris). Un kanji absent du programme (voir
// `wordExceedsOwnLevel`) compte aussi comme "pas maîtrisé".
export function wordHasUnmasteredKanji(word: string, masteredKanjiIds: Set<string>): boolean {
  for (const char of word) {
    if (!KANJI_RANGE.test(char)) continue
    const kanjiId = kanjiIdByChar.get(char)
    if (!kanjiId || !masteredKanjiIds.has(kanjiId)) return true
  }
  return false
}

// Les kanjis (dans l'ordre, sans doublon) qui composent un mot de
// vocabulaire, avec leur fiche complète — sert à afficher le tracé de
// chacun (voir VocabCardLoop, demande explicite de l'utilisatrice
// "possible de mettre aussi le tracé des kanjis" dans le module
// Vocabulaire). Ignore les caractères kana et les kanjis absents du
// programme (voir wordExceedsOwnLevel) plutôt que de planter dessus.
export function kanjisInWord(word: string): Kanji[] {
  const seen = new Set<string>()
  const result: Kanji[] = []
  for (const char of word) {
    if (!KANJI_RANGE.test(char) || seen.has(char)) continue
    seen.add(char)
    const kanji = kanjiByChar.get(char)
    if (kanji) result.push(kanji)
  }
  return result
}
