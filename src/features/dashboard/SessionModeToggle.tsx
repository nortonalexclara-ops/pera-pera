import { motion } from 'framer-motion'

export type SessionMode = 'recommended' | 'custom'

interface SessionModeToggleProps {
  mode: SessionMode
  onChange: (mode: SessionMode) => void
}

export default function SessionModeToggle({ mode, onChange }: SessionModeToggleProps) {
  return (
    <div className="session-toggle" role="tablist">
      <button
        className={`session-toggle__option${mode === 'recommended' ? ' active' : ''}`}
        onClick={() => onChange('recommended')}
        role="tab"
        aria-selected={mode === 'recommended'}
      >
        {mode === 'recommended' && (
          <motion.span
            className="session-toggle__indicator"
            layoutId="session-toggle-indicator"
            transition={{ type: 'spring', stiffness: 400, damping: 32 }}
          />
        )}
        <span className="session-toggle__label">Séance recommandée</span>
      </button>
      <button
        className={`session-toggle__option${mode === 'custom' ? ' active' : ''}`}
        onClick={() => onChange('custom')}
        role="tab"
        aria-selected={mode === 'custom'}
      >
        {mode === 'custom' && (
          <motion.span
            className="session-toggle__indicator"
            layoutId="session-toggle-indicator"
            transition={{ type: 'spring', stiffness: 400, damping: 32 }}
          />
        )}
        <span className="session-toggle__label">Séance personnalisée</span>
      </button>
    </div>
  )
}
