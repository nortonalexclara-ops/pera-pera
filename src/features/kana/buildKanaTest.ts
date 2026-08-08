import { mockHiraganaList, mockKatakanaList, type Kana, type KanaScript } from './mockKana'

export type KanaDirection = 'char-to-romaji' | 'romaji-to-char'

export interface KanaQuestion {
  kana: Kana
  direction: KanaDirection
  correctAnswer: string
  options: string[]
}

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

export function buildKanaPool(scripts: KanaScript[]): Kana[] {
  const all = [...mockHiraganaList, ...mockKatakanaList]
  return all.filter((k) => scripts.includes(k.script))
}

/**
 * Une question par caractère du pool, mélangée, toujours en QCM (demande
 * explicite de l'utilisatrice — même esprit que le test Kanjis/
 * Vocabulaire/Grammaire) avec un sens tiré au sort : caractère → romaji ou
 * romaji → caractère. Pas de mode "écrire" ici, contrairement au test
 * principal : pas de repli nécessaire, un caractère seul (ex. "a") suffit
 * toujours à construire au moins un leurre dès que le script choisi a plus
 * d'un caractère (toujours le cas, hiragana/katakana en ont 71 chacun).
 */
export function buildKanaQuestions(pool: Kana[]): KanaQuestion[] {
  const shuffledPool = shuffle(pool)

  return shuffledPool.map((kana) => {
    const direction: KanaDirection = Math.random() < 0.5 ? 'char-to-romaji' : 'romaji-to-char'
    const correctAnswer = direction === 'char-to-romaji' ? kana.romaji : kana.character

    const seenValues = new Set([correctAnswer])
    const distractors: string[] = []
    // Leurres du même syllabaire d'abord (comparer un hiragana à un
    // hiragana plutôt qu'à un katakana au hasard) — puis on complète avec
    // l'autre script si besoin.
    const rest = shuffle(pool.filter((k) => k.id !== kana.id))
    const sameScriptFirst = [...rest.filter((k) => k.script === kana.script), ...rest.filter((k) => k.script !== kana.script)]
    for (const d of sameScriptFirst) {
      const value = direction === 'char-to-romaji' ? d.romaji : d.character
      if (seenValues.has(value)) continue
      seenValues.add(value)
      distractors.push(value)
      if (distractors.length >= 3) break
    }

    return { kana, direction, correctAnswer, options: shuffle([correctAnswer, ...distractors]) }
  })
}
