interface AmbientGlowProps {
  top?: number | string
  left?: number | string
  size?: number
  color?: string
}

/**
 * Remplace l'ancien filigrane "grand kanji" : une tache de couleur douce et
 * floue, neutre vis-à-vis du contenu. Sert de respiration visuelle derrière
 * un en-tête sans rattacher l'identité de l'app à un unique caractère.
 */
export default function AmbientGlow({
  top = -60,
  left = -60,
  size = 280,
  color = 'var(--color-accent-glow)',
}: AmbientGlowProps) {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'absolute',
        top,
        left,
        width: size,
        height: size,
        borderRadius: '50%',
        background: `radial-gradient(circle, ${color} 0%, transparent 70%)`,
        filter: 'blur(6px)',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}
