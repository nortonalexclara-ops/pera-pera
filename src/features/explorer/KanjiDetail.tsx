import FuriganaText from '../../components/ui/FuriganaText'
import SpeakButton from '../../components/ui/SpeakButton'
import type { Kanji } from '../kanji/mockKanji'
import { reconstructReading, reconstructText } from '../../utils/furigana'
import '../kanji/SessionCard.css'
import './Explorer.css'

// Fiche complète d'un kanji (lectures, radical, traits, clés, mots
// fréquents, exemples) — partagée entre Explorer (ligne dépliable) et la
// séance de vocabulaire (panneau ouvert en touchant un kanji d'un mot, voir
// KanjiFicheOverlay.tsx). `onExampleClick` est optionnel : dans Explorer il
// relance la recherche sur le mot touché, depuis la séance il n'y a pas de
// recherche vers laquelle rebondir — le mot reste alors un simple texte.
export default function KanjiDetail({
  kanji,
  onExampleClick,
}: {
  kanji: Kanji
  onExampleClick?: (text: string) => void
}) {
  return (
    <div className="explorer-detail__body">
      <div className="explorer-detail__readings">
        <div>
          <p className="flip-card__label">On&apos;yomi</p>
          <p className="flip-card__reading-value">{kanji.onyomi.join(', ') || '—'}</p>
        </div>
        <div>
          <p className="flip-card__label">Kun&apos;yomi</p>
          <p className="flip-card__reading-value">{kanji.kunyomi.join(', ') || '—'}</p>
        </div>
        <div>
          <p className="flip-card__label">Radical</p>
          <p className="flip-card__reading-value">
            {kanji.radical.character} ({kanji.radical.meaning})
          </p>
        </div>
        <div>
          <p className="flip-card__label">Traits</p>
          <p className="flip-card__reading-value">{kanji.strokeCount}</p>
        </div>
      </div>

      {/* Absent pour les kanjis atomiques (ex. 人, 大) — le radical
          ci-dessus suffit déjà à les décrire. */}
      {kanji.components.length > 0 && (
        <>
          <p className="flip-card__label">Clés</p>
          <ul className="explorer-detail__components">
            {kanji.components.map((c) => (
              <li key={c.character} className="component-chip">
                <span className="component-chip__char">{c.character}</span>
                <span className="component-chip__meaning">{c.meaning}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      <p className="flip-card__label">Mots fréquents</p>
      <ul className="explorer-detail__examples">
        {kanji.frequentWords.map((w, i) => (
          <li key={i}>
            {onExampleClick ? (
              <button
                type="button"
                className="explorer-detail__example-link"
                onClick={() => onExampleClick(reconstructText(w.segments))}
                title="Ouvrir ce mot dans Explorer"
              >
                <span className="example__jp">
                  <FuriganaText segments={w.segments} />
                  <SpeakButton text={reconstructReading(w.segments)} />
                </span>
              </button>
            ) : (
              <span className="example__jp">
                <FuriganaText segments={w.segments} />
                <SpeakButton text={reconstructReading(w.segments)} />
              </span>
            )}
            <span className="explorer-detail__example-meaning">{w.meaning}</span>
          </li>
        ))}
      </ul>

      <p className="flip-card__label">Exemples</p>
      <ul className="explorer-detail__examples">
        {kanji.examples.map((ex, i) => (
          <li key={i}>
            <span className="example__jp example__jp--sentence">
              <FuriganaText segments={ex.segments} />
              <SpeakButton text={reconstructReading(ex.segments)} />
            </span>
            <span className="explorer-detail__example-meaning">{ex.translation}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
