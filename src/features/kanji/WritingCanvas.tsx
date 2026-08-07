import { useEffect, useRef, useState, type ReactNode } from 'react'
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
  // Bouton(s) additionnel(s) affichés dans la même rangée que stylo/gomme/
  // annuler/tout effacer, à gauche du groupe d'outils (ex. "Reconnaître"
  // pour le Cahier de reconnaissance) — demande explicite de l'utilisatrice
  // de ne pas laisser ce bouton tout en bas de la page, hors champ sur
  // iPad/mobile sans défiler. Ignoré par les autres appelants.
  extraTools?: ReactNode
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
  extraTools,
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
      // Changer canvas.width/height vide TOUJOURS le bitmap, même si les
      // dimensions affichées ne bougent presque pas — un simple changement
      // de mise en page ailleurs sur la page (ex. la liste de résultats de
      // reconnaissance qui apparaît/disparaît juste en dessous, voir
      // Notebook.tsx) suffit à déclencher ce `ResizeObserver` et effaçait
      // silencieusement tout ce qui venait d'être dessiné — alors que
      // `strokesRef` (les données) restait intact, d'où la confusion :
      // le trait semblait avoir disparu, mais était toujours compté dans
      // la reconnaissance. Rejoue systématiquement les traits déjà
      // enregistrés après chaque redimensionnement, pas seulement au
      // premier montage.
      redrawFromStrokes()
    }

    resize()
    const observer = new ResizeObserver(resize)
    observer.observe(wrap)
    return () => observer.disconnect()
    // eslint-disable-next-line react-hooks/exhaustive-deps
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

  // La gomme n'efface que des pixels (`destination-out`, voir strokeStyle) —
  // elle ne touchait jusqu'ici jamais aux points bruts des traits stylo
  // gardés en mémoire. Un trait "effacé" à l'écran restait donc entier côté
  // données, et la reconnaissance de kanji (qui lit ces points, voir
  // Notebook.tsx) continuait à "voir" l'encre pourtant retirée visuellement
  // — bug signalé par l'utilisatrice (kanji reconnu plus complexe que ce
  // qui restait réellement dessiné). Corrigé en répercutant la gomme sur
  // les données : tout point stylo à moins de ERASER_WIDTH/2 d'un point de
  // la gomme est retiré, et un trait est scindé en plusieurs sous-traits
  // (plutôt que de laisser un simple trou) là où l'effacement l'a coupé en
  // plusieurs morceaux — sinon les points de part et d'autre du trou se
  // retrouveraient reliés à tort par une ligne droite fantôme.
  function eraseFromPenStrokes(eraserPoints: Point[]) {
    const radiusSq = (ERASER_WIDTH / 2) ** 2
    const next: Stroke[] = []
    for (const stroke of strokesRef.current) {
      if (stroke.tool !== 'pen') continue
      let current: Point[] = []
      for (const p of stroke.points) {
        const erased = eraserPoints.some((ep) => (p.x - ep.x) ** 2 + (p.y - ep.y) ** 2 <= radiusSq)
        if (erased) {
          if (current.length > 1) next.push({ tool: 'pen', points: current })
          current = []
        } else {
          current.push(p)
        }
      }
      if (current.length > 1) next.push({ tool: 'pen', points: current })
    }
    strokesRef.current = next
  }

  function handlePointerUp() {
    if (!isDrawing.current) return
    isDrawing.current = false
    const justFinished = strokesRef.current[strokesRef.current.length - 1]
    if (justFinished?.tool === 'eraser') {
      eraseFromPenStrokes(justFinished.points)
    }
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

  // Vide le bitmap puis rejoue tous les traits de `strokesRef` dans l'ordre
  // — seul moyen fiable de refléter l'état courant une fois l'encre/la
  // gomme compositées sur le canevas (pas de retrait/redessin ciblé
  // possible). Utilisé par `undo` (un trait en moins) et par le
  // redimensionnement du canevas (voir l'effet plus haut) — les deux
  // remettent le bitmap à zéro d'une façon ou d'une autre et doivent
  // repartir de la même source de vérité (`strokesRef`), jamais de ce qui
  // restait affiché juste avant.
  function redrawFromStrokes() {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, size.current.w, size.current.h)
    for (const stroke of strokesRef.current) {
      for (let i = 1; i < stroke.points.length; i++) {
        drawSegment(ctx, stroke.tool, stroke.points[i - 1], stroke.points[i])
      }
    }
  }

  // Retire juste le dernier trait tracé.
  function undo() {
    if (strokesRef.current.length === 0) return
    strokesRef.current = strokesRef.current.slice(0, -1)
    setStrokeCount(strokesRef.current.length)
    redrawFromStrokes()
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
      <div className={`writing-canvas__head${title || extraTools ? '' : ' writing-canvas__head--tools-only'}`}>
        {title && <p className="writing-canvas__title">{title}</p>}
        {!title && extraTools}
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
