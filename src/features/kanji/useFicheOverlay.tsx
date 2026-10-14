import { useCallback, useState, type ReactNode } from 'react'
import type { Kanji } from './mockKanji'
import KanjiFicheOverlay from './KanjiFicheOverlay'
import CleFicheOverlay from './CleFicheOverlay'
import { findKanjiByCharacter } from '../../utils/kanjiLevel'

type Fiche = { type: 'kanji'; kanji: Kanji } | { type: 'cle'; character: string; meaning: string }

// État + panneau des fiches ouvertes par-dessus une séance (kanji ou clé
// touchés dans une carte) — partagé entre les séances Vocabulaire et
// Kanjis pour ne pas dupliquer cette logique. `overlay` est à rendre tel
// quel à côté de <CardLoopShell>.
export function useFicheOverlay(): {
  overlay: ReactNode
  openKanji: (kanji: Kanji) => void
  openCle: (cle: { character: string; meaning: string }) => void
} {
  const [fiche, setFiche] = useState<Fiche | null>(null)
  const close = useCallback(() => setFiche(null), [])
  const openKanji = useCallback((kanji: Kanji) => setFiche({ type: 'kanji', kanji }), [])
  // Une clé qui est aussi un kanji du programme (ex. 口 "bouche") ouvre
  // sa vraie fiche ; sinon (ex. 艹 "herbe"), une fiche de clé simplifiée.
  const openCle = useCallback((cle: { character: string; meaning: string }) => {
    const kanji = findKanjiByCharacter(cle.character)
    setFiche(kanji ? { type: 'kanji', kanji } : { type: 'cle', ...cle })
  }, [])

  const overlay = !fiche ? null : fiche.type === 'kanji' ? (
    <KanjiFicheOverlay kanji={fiche.kanji} onClose={close} />
  ) : (
    <CleFicheOverlay character={fiche.character} meaning={fiche.meaning} onClose={close} />
  )

  return { overlay, openKanji, openCle }
}
