import { motion } from 'framer-motion'

export type SessionMode = 'custom' | 'test'

interface SessionModeToggleProps {
  mode: SessionMode
  onChange: (mode: SessionMode) => void
}

export default function SessionModeToggle({ mode, onChange }: SessionModeToggleProps) {
  return (
    <div className="session-toggle" role="tablist">
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
        <span className="session-toggle__label">Apprentissage</span>
      </button>
      <button
        className={`session-toggle__option${mode === 'test' ? ' active' : ''}`}
        onClick={() => onChange('test')}
        role="tab"
        aria-selected={mode === 'test'}
      >
        {mode === 'test' && (
          <motion.span
            className="session-toggle__indicator"
            layoutId="session-toggle-indicator"
            transition={{ type: 'spring', stiffness: 400, damping: 32 }}
          />
        )}
        <span className="session-toggle__label">Test</span>
      </button>
    </div>
  )
}
