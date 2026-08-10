import { motion } from 'framer-motion'

interface ProgressRingProps {
  percent: number
  size?: number
  strokeWidth?: number
  label?: string
  sublabel?: string
  // Par défaut ajustées pour l'anneau "objectif" du Dashboard (size=132)
  // — les compteurs de séance/test (plus petits, size=44-54) passent des
  // valeurs plus grandes explicitement plutôt que de dépendre d'un calcul
  // proportionnel, pour ne jamais changer l'anneau du Dashboard par effet
  // de bord (signalé trop petit spécifiquement en séance/test, pas là).
  labelSize?: number
  sublabelSize?: number
}

export default function ProgressRing({
  percent,
  size = 132,
  strokeWidth = 10,
  label,
  sublabel,
  labelSize = 20,
  sublabelSize = 12,
}: ProgressRingProps) {
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius
  const clamped = Math.min(100, Math.max(0, percent))
  const offset = circumference * (1 - clamped / 100)

  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-border)"
          strokeWidth={strokeWidth}
        />
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="var(--color-accent)"
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1], delay: 0.1 }}
        />
      </svg>
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {label && <span style={{ fontSize: labelSize, fontWeight: 600 }}>{label}</span>}
        {sublabel && (
          <span style={{ fontSize: sublabelSize, color: 'var(--color-text-secondary)' }}>{sublabel}</span>
        )}
      </div>
    </div>
  )
}
