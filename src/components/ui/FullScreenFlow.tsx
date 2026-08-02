import { useNavigate } from 'react-router-dom'
import { ArrowLeft, type LucideIcon } from 'lucide-react'
import PageTransition from './PageTransition'

interface FullScreenFlowProps {
  icon: LucideIcon
  title: string
  description: string
}

/**
 * Coquille commune aux flux "focus" lancés depuis le dashboard (séance
 * guidée, entraînement libre) : pas de barre d'onglets, juste un retour
 * explicite — cohérent avec le schéma de navigation validé en V3.
 */
export default function FullScreenFlow({ icon: Icon, title, description }: FullScreenFlowProps) {
  const navigate = useNavigate()

  return (
    <PageTransition>
      <div style={{ minHeight: '100vh', background: 'var(--color-bg)', display: 'flex', flexDirection: 'column' }}>
        <header style={{ padding: 'var(--space-md) var(--space-lg)' }}>
          <button onClick={() => navigate('/dashboard')} className="btn-link">
            <ArrowLeft size={18} strokeWidth={1.75} />
            Retour au dashboard
          </button>
        </header>

        <div
          style={{
            flex: 1,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            textAlign: 'center',
            gap: 'var(--space-md)',
            padding: 'var(--space-xl)',
          }}
        >
          <div
            style={{
              width: 72,
              height: 72,
              borderRadius: 'var(--radius-lg)',
              background: 'var(--color-accent-soft)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Icon size={32} color="var(--color-accent)" strokeWidth={1.5} />
          </div>
          <h1 style={{ fontSize: 22, fontWeight: 500 }}>{title}</h1>
          <p style={{ color: 'var(--color-text-secondary)', maxWidth: 340, fontSize: 15, lineHeight: 1.6 }}>
            {description}
          </p>
          <p style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>
            Ce flux sera développé à une prochaine étape.
          </p>
        </div>
      </div>
    </PageTransition>
  )
}
