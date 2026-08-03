import { useEffect, useRef, useState } from 'react'
import { Pencil, Eraser, Undo2, Trash2 } from 'lucide-react'
import { useCanvasGestureGuard } from '../../components/ui/useCanvasGestureGuard'

interface WritingCanvasProps {
  strokeKey: string
  // Titre affiché dans l'en-tête — vide pour l'omettre (ex. Cahier, où le
  // titre de l'écran suffit déjà). Par défaut celui des cartes de séance.
  title?: string
  // Grille carrée en fond, façon papier quadrillé japonais — utilisée pour
  // le Cahier (feuille libre), pas dans les cartes de séance.
  grid?: boolean
  // Notifié après chaque mutation des traits (fin de trait, undo, effacer)
  // avec les traits "encre" uniquement (la gomme ne fait qu'effacer, ce
  // n'est pas une forme à comparer) — utilisé par la reconnaissance de
  // kanji manuscrit, qui a besoin des points bruts, pas juste du bitmap.
  onStrokesChange?: (strokes: Point[][]) => void
}

type Tool = 'pen' | 'eraser'
type Point = { x: number; y: number }
type Stroke = { tool: Tool; points: Point[] }

const PEN_WIDTH = 4
const ERASER_WIDTH = 42

/**
 * Zone d'entraînement à l'écriture — dessin libre au doigt/souris/Apple
 * Pencil via Pointer Events. Zone volontairement vierge (sauf grille
 * optionnelle), et sans jamais évaluer ce que l'utilisateur dessine (pas de
 * logique métier à ce stade).
 *
 * Trois outils : le stylo (dessine), la gomme (efface uniquement là où on
 * passe, via `globalCompositeOperation: 'destination-out'` — ça découpe le
 * tracé existant plutôt que de dessiner par-dessus) et l'annulation du
 * dernier trait. "Tout effacer" reste une action séparée, disponible quel
 * que soit l'outil actif.
 *
 * Chaque trait est gardé en mémoire (`strokesRef`, pas seulement peint sur
 * le bitmap) pour permettre d'annuler juste le dernier : un `undo` efface
 * tout le canevas puis rejoue tous les traits restants dans l'ordre — le
 * seul moyen fiable de "retirer" un trait déjà composité (la gomme d'un
 * trait suivant peut avoir mordu sur l'encre d'un trait précédent).
 */
export default function WritingCanvas({
  strokeKey,
  title = "Entraînement à l'écriture",
  grid = false,
  onStrokesChange,
}: WritingCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const isDrawing = useRef(false)
  const size = useRef({ w: 0, h: 0 })
  const strokesRef = useRef<Stroke[]>([])
  const [tool, setTool] = useState<Tool>('pen')
  const [strokeCount, setStrokeCount] = useState(0)

  useCanvasGestureGuard(wrapRef)

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return

    function resize() {
      const canvas = canvasRef.current
      const wrap = wrapRef.current
      if (!canvas || !wrap) return
      const rect = wrap.getBoundingClientRect()
      const dpr = window.devicePixelRatio || 1
      canvas.width = rect.width * dpr
      canvas.height = rect.height * dpr
      const ctx = canvas.getContext('2d')
      ctx?.scale(dpr, dpr)
      size.current = { w: rect.width, h: rect.height }
    }

    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(wrap)
    return () => observer.disconnect()
  }, [])

  function pointerPos(e: React.PointerEvent<HTMLCanvasElement>) {
    const rect = canvasRef.current!.getBoundingClientRect()
    return { x: e.clientX - rect.left, y: e.clientY - rect.top }
  }

  function strokeStyle(ctx: CanvasRenderingContext2D, strokeTool: Tool) {
    if (strokeTool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out'
      ctx.lineWidth = ERASER_WIDTH
    } else {
      const ink = getComputedStyle(document.documentElement).getPropertyValue('--color-text-primary').trim()
      ctx.globalCompositeOperation = 'source-over'
      ctx.strokeStyle = ink || '#1c1c1e'
      ctx.lineWidth = PEN_WIDTH
    }
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
  }

  function drawSegment(ctx: CanvasRenderingContext2D, strokeTool: Tool, from: Point, to: Point) {
    strokeStyle(ctx, strokeTool)
    ctx.beginPath()
    ctx.moveTo(from.x, from.y)
    ctx.lineTo(to.x, to.y)
    ctx.stroke()
  }

  function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    e.preventDefault()
    canvasRef.current?.setPointerCapture(e.pointerId)
    isDrawing.current = true
    strokesRef.current = [...strokesRef.current, { tool, points: [pointerPos(e)] }]
  }

  function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!isDrawing.current) return
    e.preventDefault()
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    const pos = pointerPos(e)
    const currentStroke = strokesRef.current[strokesRef.current.length - 1]
    const last = currentStroke.points[currentStroke.points.length - 1]
    currentStroke.points.push(pos)
    drawSegment(ctx, currentStroke.tool, last, pos)
  }

  function notifyStrokes() {
    onStrokesChange?.(strokesRef.current.filter((s) => s.tool === 'pen').map((s) => s.points))
  }

  function handlePointerUp() {
    if (!isDrawing.current) return
    isDrawing.current = false
    setStrokeCount(strokesRef.current.length)
    notifyStrokes()
  }

  function clear() {
    strokesRef.current = []
    setStrokeCount(0)
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, size.current.w, size.current.h)
    notifyStrokes()
  }

  // Retire juste le dernier trait tracé — rejoue tous les traits restants
  // depuis un canevas vide plutôt que de tenter un retrait ciblé, seul moyen
  // fiable une fois l'encre/la gomme compositées sur le bitmap.
  function undo() {
    if (strokesRef.current.length === 0) return
    strokesRef.current = strokesRef.current.slice(0, -1)
    setStrokeCount(strokesRef.current.length)
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, size.current.w, size.current.h)
    for (const stroke of strokesRef.current) {
      for (let i = 1; i < stroke.points.length; i++) {
        drawSegment(ctx, stroke.tool, stroke.points[i - 1], stroke.points[i])
      }
    }
    notifyStrokes()
  }

  // Efface le tracé et repasse au stylo quand on change de kanji.
  useEffect(() => {
    clear()
    setTool('pen')
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [strokeKey])

  return (
    <div className="writing-canvas">
      <div className={`writing-canvas__head${title ? '' : ' writing-canvas__head--tools-only'}`}>
        {title && <p className="writing-canvas__title">{title}</p>}
        <div className="writing-canvas__tools">
          <button
            type="button"
            className={`writing-canvas__tool${tool === 'pen' ? ' active' : ''}`}
            onClick={() => setTool('pen')}
            title="Stylo"
          >
            <Pencil size={19} strokeWidth={1.75} />
          </button>
          <button
            type="button"
            className={`writing-canvas__tool${tool === 'eraser' ? ' active' : ''}`}
            onClick={() => setTool('eraser')}
            title="Gomme — efface juste où tu passes"
          >
            <Eraser size={19} strokeWidth={1.75} />
          </button>
          <button
            type="button"
            className="writing-canvas__undo"
            onClick={undo}
            disabled={strokeCount === 0}
            title="Annuler le dernier trait"
          >
            <Undo2 size={19} strokeWidth={1.75} />
          </button>
          <button type="button" className="writing-canvas__clear" onClick={clear} title="Tout effacer">
            <Trash2 size={19} strokeWidth={1.75} />
          </button>
        </div>
      </div>
      <div className={`writing-canvas__surface${grid ? ' writing-canvas__surface--grid' : ''}`} ref={wrapRef}>
        <canvas
          ref={canvasRef}
          className={`writing-canvas__ink writing-canvas__ink--${tool}`}
          onPointerDown={handlePointerDown}
          onPointerMove={handlePointerMove}
          onPointerUp={handlePointerUp}
          onPointerLeave={handlePointerUp}
          onPointerCancel={handlePointerUp}
        />
      </div>
    </div>
  )
}
