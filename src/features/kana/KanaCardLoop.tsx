import { useMemo } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import SpeakButton from '../../components/ui/SpeakButton'
import CardLoopShell from '../kanji/CardLoopShell'
import { mockHiraganaList, mockKatakanaList, type Kana, type KanaScript } from './mockKana'
import { useProfileStore } from '../profile/profileStore'
import { getMasteredIds, setMastered, getReviewIds } from '../../db/mastery'
import { shuffleArray } from '../../utils/shuffle'

const EMPTY_SET: Set<string> = new Set()
const ALL_KANA: Kana[] = [...mockHiraganaList, ...mockKatakanaList]

interface KanaCardLoopProps {
  // Un ou deux scripts sélectionnés (voir KanaSetup) — filtre juste le
  // contenu, pas de notion de niveau JLPT ici (contrairement à Kanjis/
  // Vocabulaire/Grammaire) : hiragana/katakana n'ont pas de palier.
  scripts: KanaScript[]
  contentMode?: 'new' | 'mix' | 'review'
  continueLabel: string
  onDone: () => void
}

/**
 * Même mécanique que KanjiCardLoop (recto le caractère, verso la lecture +
 * entraînement à l'écriture, mastery/reviewMarks persistés) mais sans
 * niveau JLPT, sans clés/mots fréquents/exemples — hiragana/katakana sont
 * des syllabaires, pas des idéogrammes porteurs de sens à décomposer.
 * `kind` (voir setMastered/getMasteredIds) suit le script propre à chaque
 * caractère (kana.script), pas un kind fixe unique — un profil peut donc
 * suivre sa maîtrise hiragana et katakana séparément même en pratiquant
 * les deux ensemble dans une même séance ("Les deux" scripts à la fois).
 */
export default function KanaCardLoop({ scripts, contentMode = 'mix', continueLabel, onDone }: KanaCardLoopProps) {
  const profileId = useProfileStore((s) => s.activeProfileId)

  const masteredHira = useLiveQuery(
    () => (profileId ? getMasteredIds(profileId, 'hiragana') : Promise.resolve(EMPTY_SET)),
    [profileId],
    EMPTY_SET,
  )
  const masteredKata = useLiveQuery(
    () => (profileId ? getMasteredIds(profileId, 'katakana') : Promise.resolve(EMPTY_SET)),
    [profileId],
    EMPTY_SET,
  )
  const reviewHira = useLiveQuery(
    () => (profileId ? getReviewIds(profileId, 'hiragana') : Promise.resolve(EMPTY_SET)),
    [profileId],
    EMPTY_SET,
  )
  const reviewKata = useLiveQuery(
    () => (profileId ? getReviewIds(profileId, 'katakana') : Promise.resolve(EMPTY_SET)),
    [profileId],
    EMPTY_SET,
  )
  const masteredIds = useMemo(() => new Set([...masteredHira, ...masteredKata]), [masteredHira, masteredKata])
  const reviewIds = useMemo(() => new Set([...reviewHira, ...reviewKata]), [reviewHira, reviewKata])

  // Mémoïsé sur le contenu de `scripts` (pas la référence du tableau, qui
  // change à chaque rendu côté appelant) — évite de recalculer/re-créer
  // une nouvelle référence à chaque frappe/interaction sans rapport.
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const scriptFiltered = useMemo(() => ALL_KANA.filter((k) => scripts.includes(k.script)), [scripts.join(',')])
  const contentFiltered =
    contentMode === 'new'
      ? scriptFiltered.filter((k) => !masteredIds.has(k.id))
      : contentMode === 'review'
        ? scriptFiltered.filter((k) => reviewIds.has(k.id))
        : scriptFiltered

  // Voir KanjiCardLoop pour le détail du motif (mode "Mélange" mélangé
  // aléatoirement, mémoïsé pour ne pas se re-mélanger à chaque décision).
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const shuffledScripts = useMemo(() => shuffleArray(scriptFiltered), [scripts.join(',')])
  const kanaList = contentMode === 'mix' ? shuffledScripts : contentFiltered

  const allMastered = contentMode === 'new' && scriptFiltered.length > 0 && contentFiltered.length === 0
  const noneToReview = contentMode === 'review' && contentFiltered.length === 0
  const itemsReady =
    (contentMode !== 'new' || (masteredHira !== EMPTY_SET && masteredKata !== EMPTY_SET)) &&
    (contentMode !== 'review' || (reviewHira !== EMPTY_SET && reviewKata !== EMPTY_SET))

  return (
    <CardLoopShell
      items={kanaList}
      itemsReady={itemsReady}
      getKey={(kana) => kana.id}
      continueLabel={continueLabel}
      onDone={onDone}
      profileId={profileId}
      onAdvance={(kana, decision) => {
        if (profileId) setMastered(profileId, kana.script, kana.id, decision)
      }}
      emptyDescription={
        allMastered
          ? 'Tu as déjà maîtrisé tous les caractères disponibles pour l\'instant — bravo !'
          : noneToReview
            ? 'Aucun caractère marqué "À revoir" pour l\'instant.'
            : 'Aucun caractère disponible pour cette sélection.'
      }
      doneTitle="Caractères passés en revue"
      doneDescription={`Tu as revu les ${kanaList.length} caractères du jour.`}
      renderWritingExtra={(kana: Kana) =>
        kana.strokePaths.length > 0 && (
          <div className="stroke-order-panel">
            <p className="flip-card__label">Ordre des traits</p>
            <div className="stroke-order__steps">
              {kana.strokePaths.map((_, i) => (
                <div key={i} className="stroke-order__step">
                  {/* Espace de coordonnées 1024×1024 (source animCJK) —
                      différent des 109×109 des kanjis, voir mockKana.ts. */}
                  <svg viewBox="0 0 1024 1024">
                    {kana.strokePaths.slice(0, i + 1).map((d, j) => (
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
      renderFront={(kana: Kana) => <span className="flip-card__char">{kana.character}</span>}
      renderBack={(kana: Kana) => (
        <>
          <div className="flip-card__back-head">
            <span className="flip-card__mini-char">{kana.character}</span>
            <p className="flip-card__mini-word">
              {kana.romaji}
              <SpeakButton text={kana.character} />
            </p>
          </div>

          <p className="flip-card__label">Exemple</p>
          <div className="example-item">
            <p className="example__jp">
              {kana.example.word}
              <SpeakButton text={kana.example.word} />
            </p>
            {/* Toujours visible (pas de bascule "toucher pour révéler") —
                contrairement aux exemples de kanjis/vocabulaire, ce n'est
                pas une question à deviner, juste un ancrage utile pour la
                lecture. Réutilise le style "révélé" de `.example__translation`
                plutôt qu'une nouvelle classe. */}
            <p className="example__translation is-revealed">{kana.example.meaning}</p>
          </div>
        </>
      )}
    />
  )
}
