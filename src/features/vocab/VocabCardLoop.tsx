import { useMemo } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import FuriganaText from '../../components/ui/FuriganaText'
import CardLoopShell from '../kanji/CardLoopShell'
import type { JlptLevel } from '../kanji/mockKanji'
import type { SeenItem } from '../test/buildTest'
import { mockVocabList, type VocabWord } from './mockVocab'
import { useProfileStore } from '../profile/profileStore'
import { getMasteredIds, setMastered } from '../../db/mastery'
import { shuffleArray } from '../../utils/shuffle'

const EMPTY_SET: Set<string> = new Set()

interface VocabCardLoopProps {
  level: JlptLevel | null
  contentMode?: 'new' | 'mix'
  limit?: number
  continueLabel: string
  onDone: () => void
  onItemSeen?: (item: SeenItem) => void
}

export const TYPE_LABELS: Record<string, string> = {
  nom: 'Nom',
  verbe: 'Verbe',
  adjectif: 'Adjectif',
  expression: 'Expression',
}

export const VERB_CLASS_LABELS: Record<string, string> = {
  ichidan: 'Ichidan',
  godan: 'Godan',
  irregular: 'Irrégulier',
}

export default function VocabCardLoop({
  level,
  contentMode = 'mix',
  limit,
  continueLabel,
  onDone,
  onItemSeen,
}: VocabCardLoopProps) {
  const profileId = useProfileStore((s) => s.activeProfileId)
  const masteredIds = useLiveQuery(
    () => (profileId ? getMasteredIds(profileId, 'vocab') : Promise.resolve(EMPTY_SET)),
    [profileId],
    EMPTY_SET,
  )

  const levelFiltered = level ? mockVocabList.filter((w) => w.jlptLevel === level) : mockVocabList
  const contentFiltered = contentMode === 'new' ? levelFiltered.filter((w) => !masteredIds.has(w.id)) : levelFiltered

  // Voir KanjiCardLoop pour le détail : mode "Mélange" mélangé aléatoirement
  // (demande utilisatrice), mémoïsé sur `level` seul.
  const shuffledLevel = useMemo(() => shuffleArray(levelFiltered), [level])
  const orderedContent = contentMode === 'mix' ? shuffledLevel : contentFiltered
  const vocabList = typeof limit === 'number' ? orderedContent.slice(0, limit) : orderedContent

  const allMastered = contentMode === 'new' && levelFiltered.length > 0 && contentFiltered.length === 0
  // Voir KanjiCardLoop : en 'new', attendre la vraie valeur de masteredIds
  // avant de laisser CardLoopShell figer sa file de session.
  const itemsReady = contentMode !== 'new' || masteredIds !== EMPTY_SET

  return (
    <CardLoopShell
      items={vocabList}
      itemsReady={itemsReady}
      getKey={(vocab) => vocab.id}
      continueLabel={continueLabel}
      onDone={onDone}
      profileId={profileId}
      onAdvance={(vocab, decision) => {
        onItemSeen?.({ kind: 'vocab', id: vocab.id, data: vocab })
        if (profileId) setMastered(profileId, 'vocab', vocab.id, decision)
      }}
      renderCounter={level ? (index, total) => `${index + 1} / ${total} mots ${level}` : undefined}
      emptyDescription={
        allMastered
          ? `Tu as déjà maîtrisé tous les mots de vocabulaire${level ? ` ${level}` : ''} disponibles pour l'instant — bravo !`
          : `Aucun mot de vocabulaire ${level} dans le contenu disponible pour l'instant.`
      }
      doneTitle="Vocabulaire passé en revue"
      doneDescription={`Tu as revu les ${vocabList.length} mots du jour.`}
      renderFront={(vocab: VocabWord) => (
        <>
          <span className="word-type-badge">{TYPE_LABELS[vocab.type]}</span>
          <span className="flip-card__word">{vocab.word}</span>
        </>
      )}
      renderBack={(vocab: VocabWord, revealed, toggleReveal) => (
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
      )}
    />
  )
}
