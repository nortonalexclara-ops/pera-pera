import type { Kanji } from './mockKanji'
import KanjiDetail from '../explorer/KanjiDetail'
import FicheOverlayShell from './FicheOverlayShell'

export default function KanjiFicheOverlay({ kanji, onClose }: { kanji: Kanji; onClose: () => void }) {
  return (
    <FicheOverlayShell ariaLabel={`Fiche du kanji ${kanji.character}`} onClose={onClose}>
      <div className="kanji-fiche__title">
        <span className="kanji-fiche__char">{kanji.character}</span>
        <span className="kanji-fiche__level">{kanji.jlptLevel}</span>
      </div>
      <div className="kanji-fiche__meanings">
        {kanji.meanings.map((m) => (
          <span key={m} className="meaning-pill">
            {m}
          </span>
        ))}
      </div>

      <KanjiDetail kanji={kanji} />
    </FicheOverlayShell>
  )
}
