export interface FuriganaSegment {
  text: string
  reading?: string
  highlight?: boolean
}

/**
 * Rendu d'une phrase/mot segmenté(e) : la lecture (furigana) n'apparaît
 * que sous les runs de kanji qui en ont besoin (`ruby`/`rt`, ruby-position:
 * under) — jamais une ligne de lecture séparée pour toute la phrase, pour
 * que l'œil essaie de lire le kanji plutôt que de sauter directement au
 * hiragana.
 */
export default function FuriganaText({ segments }: { segments: FuriganaSegment[] }) {
  return (
    <>
      {segments.map((seg, i) => {
        const content = seg.reading ? (
          <ruby>
            {seg.text}
            <rt>{seg.reading}</rt>
          </ruby>
        ) : (
          seg.text
        )
        return seg.highlight ? (
          <span key={i} className="furigana-highlight">
            {content}
          </span>
        ) : (
          <span key={i}>{content}</span>
        )
      })}
    </>
  )
}
