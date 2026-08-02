import type { LucideIcon } from 'lucide-react'
import PageTransition from './PageTransition'

interface PlaceholderScreenProps {
  icon: LucideIcon
  title: string
  description: string
}

export default function PlaceholderScreen({ icon: Icon, title, description }: PlaceholderScreenProps) {
  return (
    <PageTransition>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          gap: 'var(--space-md)',
          minHeight: '60vh',
          padding: 'var(--space-xl)',
        }}
      >
        <div
          style={{
            width: 64,
            height: 64,
            borderRadius: 'var(--radius-lg)',
            background: 'var(--color-accent-soft)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Icon size={28} color="var(--color-accent)" strokeWidth={1.5} />
        </div>
        <h2 style={{ fontSize: 20, fontWeight: 500 }}>{title}</h2>
        <p style={{ color: 'var(--color-text-secondary)', maxWidth: 320, fontSize: 15, lineHeight: 1.6 }}>
          {description}
        </p>
        <p style={{ color: 'var(--color-text-muted)', fontSize: 13 }}>
          Cet écran sera développé à une prochaine étape.
        </p>
      </div>
    </PageTransition>
  )
}
