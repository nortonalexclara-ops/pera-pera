import { ArrowRight } from 'lucide-react'
import type { RecommendedSession } from './mockDashboard'

interface RecommendedSessionPanelProps {
  session: RecommendedSession
  onStart: () => void
}

export default function RecommendedSessionPanel({ session, onStart }: RecommendedSessionPanelProps) {
  const stats = [
    { label: 'nouveaux kanjis', value: session.kanjiCount },
    { label: 'mots de vocabulaire', value: session.vocabCount },
    { label: 'points de grammaire', value: session.grammarCount },
    { label: 'cartes à réviser', value: session.reviewCount },
  ]

  return (
    <div>
      <p className="hero-card__story">Aujourd'hui, on te propose :</p>

      <div className="stat-grid">
        {stats.map((stat) => (
          <div className="stat-grid__item" key={stat.label}>
            <span className="stat-grid__number">{stat.value}</span>
            <span className="stat-grid__label">{stat.label}</span>
          </div>
        ))}
      </div>

      <p className="hero-card__duration">≈ {session.durationMinutes} min · à ton rythme</p>

      <button className="btn-primary hero-card__cta" onClick={onStart}>
        Commencer la séance recommandée
        <ArrowRight size={17} strokeWidth={2} />
      </button>
    </div>
  )
}
