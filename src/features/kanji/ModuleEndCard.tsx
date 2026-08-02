import { motion } from 'framer-motion'
import { ArrowRight, type LucideIcon } from 'lucide-react'

interface ModuleEndCardProps {
  icon: LucideIcon
  title: string
  description: string
  buttonLabel: string
  onContinue: () => void
}

/**
 * Carte plein-largeur réutilisée à deux endroits : une fois qu'un module a
 * été entièrement parcouru (ex. les 5 kanjis du jour), et pour les modules
 * pas encore construits (Vocabulaire, Grammaire, Révisions) — dans les deux
 * cas, l'utilisateur n'a qu'un seul geste possible : continuer.
 */
export default function ModuleEndCard({ icon: Icon, title, description, buttonLabel, onContinue }: ModuleEndCardProps) {
  return (
    <motion.div
      className="module-end card"
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
    >
      <div className="module-end__icon">
        <Icon size={28} color="var(--color-accent)" strokeWidth={1.5} />
      </div>
      <h2 className="module-end__title">{title}</h2>
      <p className="module-end__description">{description}</p>
      <button className="btn-primary module-end__button" onClick={onContinue}>
        {buttonLabel}
        <ArrowRight size={17} strokeWidth={2} />
      </button>
    </motion.div>
  )
}
