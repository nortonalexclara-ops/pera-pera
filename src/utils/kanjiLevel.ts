import { mockKanjiList, type JlptLevel } from '../features/kanji/mockKanji'

// N5 = le plus facile, N1 = le plus avancé — rang numérique pour pouvoir
// comparer "plus dur que" simplement.
const LEVEL_RANK: Record<JlptLevel, number> = { N5: 5, N4: 4, N3: 3, N2: 2, N1: 1 }

// Construit une seule fois au chargement du module (pas à chaque appel) :
// quel niveau enseigne chaque kanji, d'après le propre programme kanjis
// de l'appli.
const kanjiLevelByChar = new Map<string, JlptLevel>()
mockKanjiList.forEach((k) => kanjiLevelByChar.set(k.character, k.jlptLevel))

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
