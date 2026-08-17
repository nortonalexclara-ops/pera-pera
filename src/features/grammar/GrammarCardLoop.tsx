import { useMemo } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import FuriganaText from '../../components/ui/FuriganaText'
import SpeakButton from '../../components/ui/SpeakButton'
import CardLoopShell from '../kanji/CardLoopShell'
import type { JlptLevel } from '../kanji/mockKanji'
import type { SeenItem } from '../test/buildTest'
import { mockGrammarList, type GrammarPoint } from './mockGrammar'
import { useProfileStore } from '../profile/profileStore'
import { getMasteredIds, setMastered, getReviewIds } from '../../db/mastery'
import { shuffleArray } from '../../utils/shuffle'
import { reconstructReading } from '../../utils/furigana'

// "〜" n'est qu'un espace réservé typographique ("insère le radical ici",
// ex. "〜てください") — jamais destiné à être prononcé, retiré avant de
// confier le motif à la synthèse vocale (voir SpeakButton).
function spokenPattern(pattern: string): string {
  return pattern.replace(/〜/g, '')
}

const EMPTY_SET: Set<string> = new Set()

interface GrammarCardLoopProps {
  level: JlptLevel | null
  contentMode?: 'new' | 'mix' | 'review'
  limit?: number
  continueLabel: string
  onDone: () => void
  onItemSeen?: (item: SeenItem) => void
}

export default function GrammarCardLoop({
  level,
  contentMode = 'mix',
  limit,
  continueLabel,
  onDone,
  onItemSeen,
}: GrammarCardLoopProps) {
  const profileId = useProfileStore((s) => s.activeProfileId)
  const masteredIds = useLiveQuery(
    () => (profileId ? getMasteredIds(profileId, 'grammar') : Promise.resolve(EMPTY_SET)),
    [profileId],
    EMPTY_SET,
  )
  const reviewIds = useLiveQuery(
    () => (profileId ? getReviewIds(profileId, 'grammar') : Promise.resolve(EMPTY_SET)),
    [profileId],
    EMPTY_SET,
  )

  const levelFiltered = level ? mockGrammarList.filter((g) => g.jlptLevel === level) : mockGrammarList
  const contentFiltered =
    contentMode === 'new'
      ? levelFiltered.filter((g) => !masteredIds.has(g.id) && !reviewIds.has(g.id))
      : contentMode === 'review'
        ? levelFiltered.filter((g) => reviewIds.has(g.id))
        : levelFiltered

  // Voir KanjiCardLoop pour le détail : mode "Mélange" mélangé aléatoirement
  // (demande utilisatrice), mémoïsé sur `level` seul.
  const shuffledLevel = useMemo(() => shuffleArray(levelFiltered), [level])
  const orderedContent = contentMode === 'mix' ? shuffledLevel : contentFiltered
  const grammarList = typeof limit === 'number' ? orderedContent.slice(0, limit) : orderedContent

  const allMastered = contentMode === 'new' && levelFiltered.length > 0 && contentFiltered.length === 0
  const noneToReview = contentMode === 'review' && contentFiltered.length === 0
  // Voir KanjiCardLoop : en 'new'/'review', attendre la vraie valeur de
  // masteredIds/reviewIds avant de laisser CardLoopShell figer sa file de
  // session.
  const itemsReady =
    (contentMode !== 'new' || masteredIds !== EMPTY_SET) && (contentMode !== 'review' || reviewIds !== EMPTY_SET)

  return (
    <CardLoopShell
      items={grammarList}
      itemsReady={itemsReady}
      getKey={(point) => point.id}
      continueLabel={continueLabel}
      onDone={onDone}
      profileId={profileId}
      onAdvance={(point, decision) => {
        onItemSeen?.({ kind: 'grammar', id: point.id, data: point })
        if (profileId) setMastered(profileId, 'grammar', point.id, decision)
      }}
      renderCounter={level ? (index, total) => `${index + 1} / ${total} points ${level}` : undefined}
      emptyDescription={
        allMastered
          ? `Tu as déjà maîtrisé tous les points de grammaire${level ? ` ${level}` : ''} disponibles pour l'instant — bravo !`
          : noneToReview
            ? `Aucun point de grammaire${level ? ` ${level}` : ''} marqué "À revoir" pour l'instant.`
            : `Aucun point de grammaire ${level} dans le contenu disponible pour l'instant.`
      }
      doneTitle="Grammaire passée en revue"
      doneDescription={(total) => `Tu as revu les ${total} points de grammaire du jour.`}
      renderFront={(point: GrammarPoint) => (
        <>
          <span className="word-type-badge">Grammaire</span>
          <span className="flip-card__word">{point.pattern}</span>
        </>
      )}
      renderBack={(point: GrammarPoint, revealed, toggleReveal) => (
        <>
          <div className="flip-card__back-head">
            <span className="word-type-badge">Grammaire</span>
            <p className="flip-card__mini-word">
              {point.pattern}
              <SpeakButton text={spokenPattern(point.pattern)} />
            </p>
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
                  <SpeakButton text={reconstructReading(ex.segments)} />
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
