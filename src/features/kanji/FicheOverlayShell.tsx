import { useEffect, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'
import './KanjiFicheOverlay.css'

// Enveloppe commune des fiches ouvertes PAR-DESSUS la séance en cours
// (kanji, clé — demande utilisatrice : toucher un élément pour voir sa
// fiche, puis une flèche retour pour revenir à la séance). Un panneau
// local plutôt qu'une navigation vers Explorer : quitter /session
// démonterait SessionFlow et on reperdrait la carte, le module et la file
// en cours — ici rien n'est démonté, fermer le panneau retrouve la séance
// exactement où elle était.
export default function FicheOverlayShell({
  ariaLabel,
  onClose,
  children,
}: {
  ariaLabel: string
  onClose: () => void
  children: ReactNode
}) {
  useEffect(() => {
    function onKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onClose])

  return (
    <motion.div
      className="kanji-fiche"
      role="dialog"
      aria-label={ariaLabel}
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="kanji-fiche__inner">
        <header className="kanji-fiche__header">
          <button type="button" className="btn-link" onClick={onClose}>
            <ArrowLeft size={18} strokeWidth={1.75} />
            Retour à la séance
          </button>
        </header>
        {children}
      </div>
    </motion.div>
  )
}
