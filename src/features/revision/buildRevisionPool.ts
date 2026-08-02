import { mockKanjiList, type Kanji, type JlptLevel } from '../kanji/mockKanji'
import { mockVocabList, type VocabWord } from '../vocab/mockVocab'
import { mockGrammarList, type GrammarPoint } from '../grammar/mockGrammar'
import type { ItemKind } from '../../db/db'

// `id` reste préfixé (kanji-xxx / vocab-xxx / grammar-xxx) — c'est la clé
// React et l'identité de l'item côté test de connaissances. `itemId` est
// l'id brut du contenu (kanji.id / vocab.id / grammar.id), celui utilisé
// partout ailleurs (KanjiCardLoop, VocabCardLoop, GrammarCardLoop, table
// `mastery`) — nécessaire pour que "Maîtrisé" coché depuis Révisions se
// reflète correctement dans le même enregistrement que celui coché depuis
// le module d'origine, au lieu de créer un doublon sous un id différent.
export type RevisionItem =
  | { kind: 'kanji'; id: string; itemId: string; data: Kanji }
  | { kind: 'vocab'; id: string; itemId: string; data: VocabWord }
  | { kind: 'grammar'; id: string; itemId: string; data: GrammarPoint }

function shuffle<T>(arr: T[]): T[] {
  const copy = [...arr]
  for (let i = copy.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[copy[i], copy[j]] = [copy[j], copy[i]]
  }
  return copy
}

/**
 * Le module Révisions n'a pas de file de révision au sens FSRS (pas
 * d'intervalle, pas de date d'échéance — voir PROJECT_STATE.md). Il montre
 * simplement les items déjà cochés "Maîtrisé" par le profil actif, mélangés
 * tous types confondus plutôt que groupés, pour ressembler à une vraie file
 * de révision plutôt qu'à trois mini-sessions mises bout à bout. `limit`
 * (optionnel) plafonne la taille de la file, utilisé par la séance
 * recommandée pour proposer un lot raisonnable plutôt que tout d'un coup.
 */
export function buildRevisionPool(
  level: JlptLevel | null,
  masteredIds: Record<ItemKind, Set<string>>,
  limit?: number,
): RevisionItem[] {
  const kanjis = (level ? mockKanjiList.filter((k) => k.jlptLevel === level) : mockKanjiList).filter((k) =>
    masteredIds.kanji.has(k.id),
  )
  const words = (level ? mockVocabList.filter((w) => w.jlptLevel === level) : mockVocabList).filter((w) =>
    masteredIds.vocab.has(w.id),
  )
  const points = (level ? mockGrammarList.filter((g) => g.jlptLevel === level) : mockGrammarList).filter((g) =>
    masteredIds.grammar.has(g.id),
  )

  const items: RevisionItem[] = [
    ...kanjis.map((k): RevisionItem => ({ kind: 'kanji', id: `kanji-${k.id}`, itemId: k.id, data: k })),
    ...words.map((w): RevisionItem => ({ kind: 'vocab', id: `vocab-${w.id}`, itemId: w.id, data: w })),
    ...points.map((g): RevisionItem => ({ kind: 'grammar', id: `grammar-${g.id}`, itemId: g.id, data: g })),
  ]

  const shuffled = shuffle(items)
  return typeof limit === 'number' ? shuffled.slice(0, limit) : shuffled
}
