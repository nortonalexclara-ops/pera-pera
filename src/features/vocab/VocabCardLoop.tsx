import { useMemo } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import FuriganaText from '../../components/ui/FuriganaText'
import SpeakButton from '../../components/ui/SpeakButton'
import CardLoopShell from '../kanji/CardLoopShell'
import type { JlptLevel } from '../kanji/mockKanji'
import type { SeenItem } from '../test/buildTest'
import { mockVocabList, type VocabWord } from './mockVocab'
import { useProfileStore } from '../profile/profileStore'
import { getMasteredIds, setMastered, getReviewIds } from '../../db/mastery'
import { shuffleArray } from '../../utils/shuffle'
import { reconstructReading } from '../../utils/furigana'
import { wordExceedsOwnLevel, wordHasUnmasteredKanji, kanjisInWord } from '../../utils/kanjiLevel'

const EMPTY_SET: Set<string> = new Set()

interface VocabCardLoopProps {
  level: JlptLevel | null
  contentMode?: 'new' | 'mix' | 'review'
  // Types cochés dans la séance personnalisée (voir CustomSessionBuilder,
  // sessionOptions.ts VOCAB_TYPE_TO_KEY) — absent/vide = pas de filtre.
  types?: string[]
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
  types,
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
  const reviewIds = useLiveQuery(
    () => (profileId ? getReviewIds(profileId, 'vocab') : Promise.resolve(EMPTY_SET)),
    [profileId],
    EMPTY_SET,
  )
  // Kanjis déjà maîtrisés par ce profil — sert à afficher les hiragana au
  // recto d'un mot dont un kanji n'est pas encore maîtrisé PAR CE PROFIL
  // (voir plus bas), en plus du critère déjà en place sur le niveau
  // "officiel" du kanji dans le programme (voir wordExceedsOwnLevel).
  const masteredKanjiIds = useLiveQuery(
    () => (profileId ? getMasteredIds(profileId, 'kanji') : Promise.resolve(EMPTY_SET)),
    [profileId],
    EMPTY_SET,
  )
  const levelFiltered = level ? mockVocabList.filter((w) => w.jlptLevel === level) : mockVocabList
  // Bug signalé par l'utilisatrice : "uniquement Verbes" montrait quand
  // même tout le vocabulaire — les cases à cocher n'étaient jusqu'ici
  // jamais transmises jusqu'ici (voir CustomSessionBuilder.tsx).
  const typeFiltered = types && types.length > 0 ? levelFiltered.filter((w) => types.includes(w.type)) : levelFiltered
  const contentFiltered =
    contentMode === 'new'
      ? typeFiltered.filter((w) => !masteredIds.has(w.id) && !reviewIds.has(w.id))
      : contentMode === 'review'
        ? typeFiltered.filter((w) => reviewIds.has(w.id))
        : typeFiltered

  // Voir KanjiCardLoop pour le détail : mode "Mélange" mélangé aléatoirement
  // (demande utilisatrice), mémoïsé sur (level, types).
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const shuffledLevel = useMemo(() => shuffleArray(typeFiltered), [level, types?.join(',')])
  // "Nouveaux"/"À revoir" mélangés aussi, pas seulement "Mélange" — pour
  // les kanjis, l'ordre du dataset suit la progression JLPT (utile tel
  // quel), mais pour le vocabulaire ce n'est que l'ordre alphabétique du
  // dataset, qui se voyait trop (demande utilisatrice, séance
  // personnalisée). Pas mémoïsé : `contentFiltered` change déjà à chaque
  // fois que masteredIds/reviewIds se résolvent, et CardLoopShell fige de
  // toute façon la file une seule fois — reproduire ce mélange à chaque
  // rendu avant ce gel n'a aucun effet visible, juste un calcul de plus,
  // négligeable vu la taille des listes ici.
  const orderedContent = contentMode === 'mix' ? shuffledLevel : shuffleArray(contentFiltered)
  const vocabList = typeof limit === 'number' ? orderedContent.slice(0, limit) : orderedContent

  const allMastered = contentMode === 'new' && typeFiltered.length > 0 && contentFiltered.length === 0
  const noneToReview = contentMode === 'review' && contentFiltered.length === 0
  // Voir KanjiCardLoop : en 'new'/'review', attendre la vraie valeur de
  // masteredIds/reviewIds avant de laisser CardLoopShell figer sa file de
  // session.
  const itemsReady =
    (contentMode !== 'new' || masteredIds !== EMPTY_SET) && (contentMode !== 'review' || reviewIds !== EMPTY_SET)

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
          : noneToReview
            ? `Aucun mot de vocabulaire${level ? ` ${level}` : ''} marqué "À revoir" pour l'instant.`
            : `Aucun mot de vocabulaire ${level} dans le contenu disponible pour l'instant.`
      }
      doneTitle="Vocabulaire passé en revue"
      doneDescription={`Tu as revu les ${vocabList.length} mots du jour.`}
      renderWritingExtra={(vocab: VocabWord) => {
        const kanjis = kanjisInWord(vocab.word).filter((k) => k.strokePaths.length > 0)
        if (kanjis.length === 0) return null
        return (
          <>
            {kanjis.map((kanji) => (
              <div key={kanji.id} className="stroke-order-panel">
                <p className="flip-card__label">Ordre des traits — {kanji.character}</p>
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
            ))}
          </>
        )
      }}
      renderFront={(vocab: VocabWord) => (
        <>
          <span className="word-type-badge">{TYPE_LABELS[vocab.type]}</span>
          <span className="flip-card__word">
            {/* Hiragana au recto plutôt que de faire deviner un kanji pas
                encore enseigné à ce niveau (ex. 挨拶 en N4, voir
                wordExceedsOwnLevel) OU pas encore maîtrisé PAR CE PROFIL
                précisément (ex. 明るい en N5 si "明" n'a pas encore été
                coché "Maîtrisé" dans le module Kanjis — demande explicite
                de l'utilisatrice, voir wordHasUnmasteredKanji). */}
            {wordExceedsOwnLevel(vocab.word, vocab.jlptLevel) ||
            wordHasUnmasteredKanji(vocab.word, masteredKanjiIds) ? (
              <FuriganaText segments={vocab.wordSegments} />
            ) : (
              vocab.word
            )}
          </span>
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
              <SpeakButton text={reconstructReading(vocab.wordSegments)} className="flip-card__speak-btn" />
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
