import { useMemo } from 'react'
import { kanjisUsingComponent } from '../../utils/kanjiLevel'
import FicheOverlayShell from './FicheOverlayShell'

// Fiche d'une clé (composant d'un kanji) qui n'est PAS elle-même un kanji
// du programme — voir useFicheOverlay.tsx : quand la clé est aussi un
// kanji à part entière, c'est sa vraie fiche (KanjiFicheOverlay) qui
// s'ouvre à la place.
const MAX_LISTED = 40

export default function CleFicheOverlay({
  character,
  meaning,
  onClose,
}: {
  character: string
  meaning: string
  onClose: () => void
}) {
  const users = useMemo(() => kanjisUsingComponent(character), [character])

  return (
    <FicheOverlayShell ariaLabel={`Fiche de la clé ${character}`} onClose={onClose}>
      <div className="kanji-fiche__title">
        <span className="kanji-fiche__char">{character}</span>
        <span className="kanji-fiche__level">Clé</span>
      </div>
      <div className="kanji-fiche__meanings">
        <span className="meaning-pill">{meaning}</span>
      </div>

      <div className="explorer-detail__body">
        {users.length > 0 ? (
          <>
            <p className="flip-card__label">Kanjis qui contiennent cette clé</p>
            <ul className="explorer-detail__components">
              {users.slice(0, MAX_LISTED).map((k) => (
                <li key={k.id} className="component-chip">
                  <span className="component-chip__char">{k.character}</span>
                  <span className="component-chip__meaning">{k.meanings[0]}</span>
                </li>
              ))}
            </ul>
            {users.length > MAX_LISTED && (
              <p className="explorer-detail__example-meaning">… et {users.length - MAX_LISTED} autres.</p>
            )}
          </>
        ) : (
          <p className="explorer-detail__example-meaning">
            Cette clé n'apparaît dans aucun kanji du programme pour l'instant.
          </p>
        )}
      </div>
    </FicheOverlayShell>
  )
}
