import { useEffect, useRef, useState } from 'react'
import { Pencil, Eraser, Trash2 } from 'lucide-react'
import { useCanvasGestureGuard } from '../../components/ui/useCanvasGestureGuard'

interface NoteCanvasProps {
  // Image de départ (dataURL PNG, '' si la note n'a encore rien de
  // manuscrit) — chargée au montage. Pas de prop `strokeKey` comme
  // `WritingCanvas` : ici chaque note EST le canevas, le parent force un
  // remount via `key={note.id}` en changeant de note plutôt que de gérer
  // un reset interne.
  initialImage: string
  onChange: (dataUrl: string) => void
}

type Tool = 'pen' | 'eraser'

const PEN_WIDTH = 4
const ERASER_WIDTH = 42

/**
 * Variante de `WritingCanvas` avec persistance — celui-ci est
 * volontairement "jamais évalué, jamais sauvegardé" (voir son commentaire),
 * donc plutôt que de lui greffer une logique de sauvegarde hors de son
 * périmètre d'origine, ce composant reprend le même moteur de dessin par
 * Pointer Events avec en plus : chargement d'une image de départ (bitmap
 * PNG en base64) et notification du contenu courant après chaque trait, via
 * `onChange` — l'appelant (NoteEditor) décide quand/où persister.
 */
export default function NoteCanvas({ initialImage, onChange }: NoteCanvasProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const isDrawing = useRef(false)
  const last = useRef({ x: 0, y: 0 })
  const size = useRef({ w: 0, h: 0 })
  // Gardé à jour à chaque trait pour pouvoir redessiner après un
  // redimensionnement (changer canvas.width/height vide le bitmap — sans
  // ça, une rotation d'écran ou un simple resize de fenêtre effacerait
  // silencieusement la note).
  const imageRef = useRef(initialImage)
  const [tool, setTool] = useState<Tool>('pen')

  useCanvasGestureGuard(wrapRef)

  function redrawFromImage() {
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, size.current.w, size.current.h)
    if (!imageRef.current) return
    const img = new Image()
    img.onload = () => ctx.drawImage(img, 0, 0, size.current.w, size.current.h)
    img.src = imageRef.current
  }

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
      redrawFromImage()
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

  function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    e.preventDefault()
    canvasRef.current?.setPointerCapture(e.pointerId)
    isDrawing.current = true
    last.current = pointerPos(e)
  }

  function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!isDrawing.current) return
    e.preventDefault()
    const canvas = canvasRef.current
    const ctx = canvas?.getContext('2d')
    if (!ctx) return
    const pos = pointerPos(e)

    if (tool === 'eraser') {
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
    ctx.beginPath()
    ctx.moveTo(last.current.x, last.current.y)
    ctx.lineTo(pos.x, pos.y)
    ctx.stroke()
    last.current = pos
  }

  function saveSnapshot() {
    const canvas = canvasRef.current
    if (!canvas) return
    const dataUrl = canvas.toDataURL('image/png')
    imageRef.current = dataUrl
    onChange(dataUrl)
  }

  function handlePointerUp() {
    if (!isDrawing.current) return
    isDrawing.current = false
    saveSnapshot()
  }

  function clear() {
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    ctx.clearRect(0, 0, size.current.w, size.current.h)
    saveSnapshot()
  }

  return (
    <div className="writing-canvas note-canvas">
      <div className="writing-canvas__head writing-canvas__head--tools-only">
        <div className="writing-canvas__tools">
          <button
            type="button"
            className={`writing-canvas__tool${tool === 'pen' ? ' active' : ''}`}
            onClick={() => setTool('pen')}
            title="Stylo"
          >
            <Pencil size={15} strokeWidth={1.75} />
          </button>
          <button
            type="button"
            className={`writing-canvas__tool${tool === 'eraser' ? ' active' : ''}`}
            onClick={() => setTool('eraser')}
            title="Gomme — efface juste où tu passes"
          >
            <Eraser size={15} strokeWidth={1.75} />
          </button>
          <button type="button" className="writing-canvas__clear" onClick={clear} title="Tout effacer">
            <Trash2 size={15} strokeWidth={1.75} />
          </button>
        </div>
      </div>
      <div className="writing-canvas__surface writing-canvas__surface--grid" ref={wrapRef}>
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
