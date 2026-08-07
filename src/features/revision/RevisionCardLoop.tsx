import { useMemo } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import FuriganaText from '../../components/ui/FuriganaText'
import CardLoopShell from '../kanji/CardLoopShell'
import type { JlptLevel } from '../kanji/mockKanji'
import type { SeenItem } from '../test/buildTest'
import { TYPE_LABELS, VERB_CLASS_LABELS } from '../vocab/VocabCardLoop'
import { buildRevisionPool, type RevisionItem } from './buildRevisionPool'
import { useProfileStore } from '../profile/profileStore'
import { getAllMasteredIds, setMastered } from '../../db/mastery'
import type { ItemKind } from '../../db/db'

const EMPTY_MASTERED: Record<ItemKind, Set<string>> = {
  kanji: new Set(),
  vocab: new Set(),
  grammar: new Set(),
  hiragana: new Set(),
  katakana: new Set(),
}

interface RevisionCardLoopProps {
  level: JlptLevel | null
  limit?: number
  continueLabel: string
  onDone: () => void
  onItemSeen?: (item: SeenItem) => void
}

export default function RevisionCardLoop({ level, limit, continueLabel, onDone, onItemSeen }: RevisionCardLoopProps) {
  const profileId = useProfileStore((s) => s.activeProfileId)

  // La révision montre ce qui est déjà maîtrisé (pas de file FSRS à ce
  // stade — voir buildRevisionPool.ts) : il faut donc connaître les items
  // maîtrisés du profil actif avant de construire la liste.
  const masteredIds = useLiveQuery(
    () => (profileId ? getAllMasteredIds(profileId) : Promise.resolve(EMPTY_MASTERED)),
    [profileId],
    EMPTY_MASTERED,
  )

  // Mélangé une seule fois par visite du module — pas à chaque rendu
  // (sinon l'ordre changerait sous les pieds de l'utilisateur à chaque
  // flip/décision, qui redéclenchent un rendu de ce composant).
  const items = useMemo(() => buildRevisionPool(level, masteredIds, limit), [level, masteredIds, limit])
  // Contrairement aux autres boucles, tout le contenu de Révisions dépend
  // de masteredIds (pas seulement en mode 'new') — voir KanjiCardLoop pour
  // le même principe : attendre la vraie valeur avant de laisser
  // CardLoopShell figer sa file, sinon la séance peut se figer sur une
  // liste vide (valeur par défaut le temps du chargement).
  const itemsReady = masteredIds !== EMPTY_MASTERED

  return (
    <CardLoopShell
      items={items}
      itemsReady={itemsReady}
      getKey={(item) => item.id}
      continueLabel={continueLabel}
      onDone={onDone}
      profileId={profileId}
      onAdvance={(item, decision) => {
        onItemSeen?.(item)
        if (profileId) setMastered(profileId, item.kind, item.itemId, decision)
      }}
      emptyDescription={
        level
          ? `Rien à réviser pour le niveau ${level} pour l'instant — coche quelques kanjis, mots ou points de grammaire comme "Maîtrisé" pour les voir apparaître ici.`
          : 'Rien à réviser pour l\'instant — coche quelques kanjis, mots ou points de grammaire comme "Maîtrisé" pour les voir apparaître ici.'
      }
      doneTitle="Révisions terminées"
      doneDescription={`Tu as repassé ${items.length} éléments en revue.`}
      renderWritingExtra={(item: RevisionItem) =>
        item.kind === 'kanji' &&
        item.data.strokePaths.length > 0 && (
          <div className="stroke-order-panel">
            <p className="flip-card__label">Ordre des traits</p>
            <div className="stroke-order__steps">
              {item.data.strokePaths.map((_, i) => (
                <div key={i} className="stroke-order__step">
                  <svg viewBox="0 0 109 109">
                    {item.data.strokePaths.slice(0, i + 1).map((d, j) => (
                      <path key={j} d={d} />
                    ))}
                  </svg>
                  <span className="stroke-order__step-number">{i + 1}</span>
                </div>
              ))}
            </div>
          </div>
        )
      }
      renderFront={(item: RevisionItem) => {
        if (item.kind === 'kanji') return <span className="flip-card__char">{item.data.character}</span>
        if (item.kind === 'vocab') {
          return (
            <>
              <span className="word-type-badge">{TYPE_LABELS[item.data.type]}</span>
              <span className="flip-card__word">{item.data.word}</span>
            </>
          )
        }
        return (
          <>
            <span className="word-type-badge">Grammaire</span>
            <span className="flip-card__word">{item.data.pattern}</span>
          </>
        )
      }}
      renderBack={(item: RevisionItem, revealed, toggleReveal) => {
        if (item.kind === 'kanji') {
          const kanji = item.data
          return (
            <>
              <div className="flip-card__back-head">
                <span className="flip-card__mini-char">{kanji.character}</span>
                <div className="flip-card__meanings">
                  {kanji.meanings.map((m) => (
                    <span key={m} className="meaning-pill">
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              <div className="flip-card__readings">
                <div>
                  <p className="flip-card__label">On&apos;yomi</p>
                  <p className="flip-card__reading-value">{kanji.onyomi.join(' · ')}</p>
                </div>
                <div>
                  <p className="flip-card__label">Kun&apos;yomi</p>
                  <p className="flip-card__reading-value">{kanji.kunyomi.join(' · ')}</p>
                </div>
              </div>

              <div className="flip-card__examples-grid">
                <div className="examples-col">
                  <p className="flip-card__label">Mots</p>
                  <ul className="example-list">
                    {kanji.frequentWords.map((w, i) => (
                      <li key={i} className="example-item">
                        <p className="example__jp">
                          <FuriganaText segments={w.segments} />
                        </p>
                        <button
                          type="button"
                          className={`example__translation${revealed.has(i) ? ' is-revealed' : ''}`}
                          onClick={() => toggleReveal(i)}
                        >
                          {revealed.has(i) ? w.meaning : 'Toucher pour révéler'}
                        </button>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="examples-col">
                  <p className="flip-card__label">Phrases</p>
                  <ul className="example-list">
                    {kanji.examples.map((ex, i) => {
                      const revealIndex = kanji.frequentWords.length + i
                      return (
                        <li key={i} className="example-item">
                          <p className="example__jp example__jp--sentence">
                            <FuriganaText segments={ex.segments} />
                          </p>
                          <button
                            type="button"
                            className={`example__translation${revealed.has(revealIndex) ? ' is-revealed' : ''}`}
                            onClick={() => toggleReveal(revealIndex)}
                          >
                            {revealed.has(revealIndex) ? ex.translation : 'Toucher pour révéler'}
                          </button>
                        </li>
                      )
                    })}
                  </ul>
                </div>
              </div>
            </>
          )
        }

        if (item.kind === 'vocab') {
          const vocab = item.data
          return (
            <>
              <div className="flip-card__back-head">
                <span className="word-type-badge">
                  {TYPE_LABELS[vocab.type]}
                  {vocab.verbConjugation && ` · ${VERB_CLASS_LABELS[vocab.verbConjugation.verbClass]}`}
                </span>
                <p className="flip-card__mini-word">
                  <FuriganaText segments={vocab.wordSegments} />
                </p>
                <div className="flip-card__meanings">
                  {vocab.meanings.map((m) => (
                    <span key={m} className="meaning-pill">
                      {m}
                    </span>
                  ))}
                </div>
              </div>

              {vocab.verbConjugation && (
                <div className="conjugation-table">
                  <p className="flip-card__label">Conjugaison</p>
                  <table className="conjugation-grid">
                    <thead>
                      <tr>
                        <th></th>
                        <th>Positif</th>
                        <th>Négatif</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td>Neutre (présent)</td>
                        <td>{vocab.verbConjugation.dictionaryPresentPositive}</td>
                        <td>{vocab.verbConjugation.dictionaryPresentNegative}</td>
                      </tr>
                      <tr>
                        <td>Neutre (passé)</td>
                        <td>{vocab.verbConjugation.dictionaryPastPositive}</td>
                        <td>{vocab.verbConjugation.dictionaryPastNegative}</td>
                      </tr>
                      <tr className="conjugation-grid__group-start">
                        <td>Poli (présent)</td>
                        <td>{vocab.verbConjugation.politePresentPositive}</td>
                        <td>{vocab.verbConjugation.politePresentNegative}</td>
                      </tr>
                      <tr>
                        <td>Poli (passé)</td>
                        <td>{vocab.verbConjugation.politePastPositive}</td>
                        <td>{vocab.verbConjugation.politePastNegative}</td>
                      </tr>
                    </tbody>
                  </table>
                  <p className="conjugation-te">
                    て形 : <strong>{vocab.verbConjugation.teForm}</strong>
                  </p>
                </div>
              )}

              {vocab.conjugations && (
                <div className="conjugation-table">
                  <p className="flip-card__label">Conjugaison</p>
                  <table className="conjugation-grid conjugation-grid--simple">
                    <tbody>
                      {vocab.conjugations.map((c) => (
                        <tr key={c.form}>
                          <td>{c.form}</td>
                          <td>{c.value}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <p className="flip-card__label">Exemples</p>
              <ul className="example-list">
                {vocab.examples.map((ex, i) => (
                  <li key={i} className="example-item">
                    <p className="example__jp example__jp--sentence">
                      <FuriganaText segments={ex.segments} />
                    </p>
                    <button
                      type="button"
                      className={`example__translation${revealed.has(i) ? ' is-revealed' : ''}`}
                      onClick={() => toggleReveal(i)}
                    >
                      {revealed.has(i) ? ex.translation : 'Toucher pour révéler'}
                    </button>
                  </li>
                ))}
              </ul>
            </>
          )
        }

        const point = item.data
        return (
          <>
            <div className="flip-card__back-head">
              <span className="word-type-badge">Grammaire</span>
              <p className="flip-card__mini-word">{point.pattern}</p>
              <div className="flip-card__meanings">
                <span className="meaning-pill">{point.meaning}</span>
              </div>
            </div>

            <div className="grammar-rule">
              <div className="grammar-rule__block">
                <p className="flip-card__label">Règle</p>
                <p className="grammar-rule__text">{point.rule}</p>
              </div>
              <div className="grammar-rule__block">
                <p className="flip-card__label">Utilisation</p>
                <p className="grammar-rule__text">{point.usage}</p>
              </div>
            </div>

            <p className="flip-card__label">Exemples</p>
            <ul className="example-list">
              {point.examples.map((ex, i) => (
                <li key={i} className="example-item">
                  <p className="example__jp example__jp--sentence">
                    <FuriganaText segments={ex.segments} />
                  </p>
                  <button
                    type="button"
                    className={`example__translation${revealed.has(i) ? ' is-revealed' : ''}`}
                    onClick={() => toggleReveal(i)}
                  >
                    {revealed.has(i) ? ex.translation : 'Toucher pour révéler'}
                  </button>
                </li>
              ))}
            </ul>
          </>
        )
      }}
    />
  )
}
