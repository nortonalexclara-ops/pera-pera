import { useMemo } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import FuriganaText from '../../components/ui/FuriganaText'
import SpeakButton from '../../components/ui/SpeakButton'
import CardLoopShell from './CardLoopShell'
import type { SeenItem } from '../test/buildTest'
import { mockKanjiList, type JlptLevel, type Kanji } from './mockKanji'
import { useProfileStore } from '../profile/profileStore'
import { getMasteredIds, setMastered } from '../../db/mastery'
import { shuffleArray } from '../../utils/shuffle'
import { toSpokenKanjiReading } from '../../utils/speech'

const EMPTY_SET: Set<string> = new Set()

interface KanjiCardLoopProps {
  level: JlptLevel | null
  // 'new' : n'affiche que les kanjis pas encore cochés "Maîtrisé" par le
  // profil actif. 'mix' (défaut) : tout le contenu du niveau, comme avant
  // — c'est le comportement historique des séances personnalisées.
  contentMode?: 'new' | 'mix'
  // Plafonne la taille de la liste après filtrage — utilisé par la séance
  // recommandée pour proposer un lot raisonnable plutôt que tout le niveau.
  limit?: number
  continueLabel: string
  onDone: () => void
  onItemSeen?: (item: SeenItem) => void
}

export default function KanjiCardLoop({
  level,
  contentMode = 'mix',
  limit,
  continueLabel,
  onDone,
  onItemSeen,
}: KanjiCardLoopProps) {
  const profileId = useProfileStore((s) => s.activeProfileId)
  const masteredIds = useLiveQuery(
    () => (profileId ? getMasteredIds(profileId, 'kanji') : Promise.resolve(EMPTY_SET)),
    [profileId],
    EMPTY_SET,
  )

  const levelFiltered = level ? mockKanjiList.filter((k) => k.jlptLevel === level) : mockKanjiList
  const contentFiltered = contentMode === 'new' ? levelFiltered.filter((k) => !masteredIds.has(k.id)) : levelFiltered

  // Mode "Mélange" : ordre aléatoire plutôt que l'ordre du dataset (~ordre
  // d'apprentissage/JLPT) — demande explicite de l'utilisatrice. Mémoïsé
  // sur (level) seul, pas sur `levelFiltered` (nouvelle référence de
  // tableau à CHAQUE rendu, qui re-mélangerait sans arrêt et ferait
  // "sauter" les cartes déjà vues pendant la séance) — `levelFiltered` ne
  // dépend que de `level` (+ le dataset constant), donc c'est un
  // raccourci sûr. Le mode 'new' n'y touche jamais : il reste calculé
  // directement à partir de `contentFiltered`, toujours à jour vis-à-vis
  // de `masteredIds`.
  const shuffledLevel = useMemo(() => shuffleArray(levelFiltered), [level])
  const orderedContent = contentMode === 'mix' ? shuffledLevel : contentFiltered
  const kanjiList = typeof limit === 'number' ? orderedContent.slice(0, limit) : orderedContent

  const allMastered = contentMode === 'new' && levelFiltered.length > 0 && contentFiltered.length === 0
  // En 'mix', kanjiList ne dépend pas de masteredIds donc c'est déjà bon
  // dès le premier rendu. En 'new', il faut attendre que useLiveQuery ait
  // résolu sa vraie valeur (pas EMPTY_SET, sa valeur par défaut le temps du
  // chargement) — sinon CardLoopShell figerait la file sur "tout le
  // niveau" au lieu de "seulement ce qui n'est pas encore maîtrisé".
  const itemsReady = contentMode !== 'new' || masteredIds !== EMPTY_SET

  return (
    <CardLoopShell
      items={kanjiList}
      itemsReady={itemsReady}
      getKey={(kanji) => kanji.id}
      continueLabel={continueLabel}
      onDone={onDone}
      profileId={profileId}
      onAdvance={(kanji, decision) => {
        onItemSeen?.({ kind: 'kanji', id: kanji.id, data: kanji })
        if (profileId) setMastered(profileId, 'kanji', kanji.id, decision)
      }}
      renderCounter={level ? (index, total) => `${index + 1} / ${total} kanjis ${level}` : undefined}
      emptyDescription={
        allMastered
          ? `Tu as déjà maîtrisé tous les kanjis${level ? ` ${level}` : ''} disponibles pour l'instant — bravo !`
          : `Aucun kanji ${level} dans le contenu disponible pour l'instant.`
      }
      doneTitle="Kanjis passés en revue"
      doneDescription={`Tu as revu les ${kanjiList.length} kanjis du jour.`}
      renderWritingExtra={(kanji: Kanji) =>
        kanji.strokePaths.length > 0 && (
          <div className="stroke-order-panel">
            <p className="flip-card__label">Ordre des traits</p>
            <div className="stroke-order__steps">
              {kanji.strokePaths.map((_, i) => (
                <div key={i} className="stroke-order__step">
                  <svg viewBox="0 0 109 109">
                    {kanji.strokePaths.slice(0, i + 1).map((d, j) => (
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
      renderFront={(kanji: Kanji) => <span className="flip-card__char">{kanji.character}</span>}
      renderBack={(kanji: Kanji, revealed, toggleReveal) => (
        <>
          {/* Groupés dans un wrapper commun pour pouvoir les mettre côte à
              côte (kanji+définition à gauche, prononciations à droite) sur
              mobile sans toucher `.flip-card__face--back`, partagé avec les
              cartes vocabulaire/grammaire — voir la règle mobile dans
              SessionCard.css. */}
          <div className="flip-card__back-summary">
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
                <p className="flip-card__reading-value">
                  {kanji.onyomi.join(' · ')}
                  <SpeakButton text={kanji.onyomi.map(toSpokenKanjiReading)} />
                </p>
              </div>
              <div>
                <p className="flip-card__label">Kun&apos;yomi</p>
                <p className="flip-card__reading-value">
                  {kanji.kunyomi.join(' · ')}
                  <SpeakButton text={kanji.kunyomi.map(toSpokenKanjiReading)} />
                </p>
              </div>
            </div>
          </div>

          {/* Absent pour les kanjis atomiques (ex. 人, 大) — rien à
              décomposer, pas de section vide. */}
          {kanji.components.length > 0 && (
            <>
              <p className="flip-card__label">Clés</p>
              <ul className="flip-card__components">
                {kanji.components.map((c) => (
                  <li key={c.character} className="component-chip">
                    <span className="component-chip__char">{c.character}</span>
                    <span className="component-chip__meaning">{c.meaning}</span>
                  </li>
                ))}
              </ul>
            </>
          )}

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
      )}
    />
  )
}
