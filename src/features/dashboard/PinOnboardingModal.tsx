import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import { CloudUpload, X } from 'lucide-react'

interface PinOnboardingModalProps {
  onDismiss: () => void
}

/**
 * Fenêtre affichée UNE SEULE fois, juste après la création d'un tout
 * nouveau profil (voir pinOnboarding.ts) — plus visible que le bandeau
 * discret déjà présent dans le Dashboard (facile à ignorer/refermer sans
 * y prêter attention) pour un choix qui a de vraies conséquences si
 * oublié : sans code enregistré, la progression de ce profil ne peut être
 * retrouvée nulle part ailleurs si l'appareil est perdu, changé, ou
 * réinitialisé. Pas d'animation de sortie (voir PROJECT_STATE.md —
 * cohérent avec le reste de l'app) : la fermeture est instantanée, seule
 * l'apparition est animée.
 */
export default function PinOnboardingModal({ onDismiss }: PinOnboardingModalProps) {
  const navigate = useNavigate()

  return (
    <div className="pin-onboarding__backdrop" onClick={onDismiss}>
      <motion.div
        className="pin-onboarding__card card"
        initial={{ opacity: 0, y: 12, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
        onClick={(e) => e.stopPropagation()}
      >
        <button type="button" className="pin-onboarding__close" onClick={onDismiss} title="Plus tard">
          <X size={16} strokeWidth={1.75} />
        </button>

        <span className="pin-onboarding__icon">
          <CloudUpload size={26} strokeWidth={1.75} />
        </span>

        <h2 className="pin-onboarding__title">Protège ta progression</h2>
        <p className="pin-onboarding__text">
          Pour l'instant, tout ce que tu apprends ne vit que sur cet appareil. Choisis un code à 4 chiffres pour
          pouvoir la retrouver sur un autre appareil — ou si tu dois un jour réinstaller l'app.
        </p>

        <div className="pin-onboarding__actions">
          <button type="button" className="btn-link" onClick={onDismiss}>
            Plus tard
          </button>
          <button
            type="button"
            className="btn-primary"
            onClick={() => {
              onDismiss()
              navigate('/settings')
            }}
          >
            Configurer maintenant
          </button>
        </div>
      </motion.div>
    </div>
  )
}
