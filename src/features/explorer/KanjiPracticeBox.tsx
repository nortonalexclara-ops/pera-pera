import { useEffect, useRef, useState } from 'react'
import { RotateCcw } from 'lucide-react'
import type { Kanji } from '../kanji/mockKanji'
import { matchKanjiStrokes, type Point, type StrokeMatchResult } from '../kanji/strokeMatch'
import { useCanvasGestureGuard } from '../../components/ui/useCanvasGestureGuard'
// Réutilise les classes de la section "Ordre des traits" déjà construite
// pour la carte kanji du module d'apprentissage (KanjiCardLoop) — même
// mini-SVG cumulatif, pour l'indice après deux essais ratés.
import '../kanji/SessionCard.css'

interface KanjiPracticeBoxProps {
  kanji: Kanji
}

const PEN_WIDTH = 4

/**
 * Petit encadré d'entraînement à l'écriture pour un kanji donné, ouvert
 * depuis une ligne de l'Explorer (bouton dédié, indépendant du dépliage de
 * la fiche complète). Contrairement à `WritingCanvas` (dessin libre, jamais
 * évalué), ici chaque trait est capturé comme une liste de points — pas
 * seulement peint sur le bitmap — pour pouvoir le comparer à la vraie forme
 * du kanji (`strokeMatch.ts`, données KanjiVG) et donner un vrai retour de
 * correction, pas un effet de façade.
 */
export default function KanjiPracticeBox({ kanji }: KanjiPracticeBoxProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const wrapRef = useRef<HTMLDivElement>(null)
  const isDrawing = useRef(false)
  const strokesRef = useRef<Point[][]>([])
  const size = useRef({ w: 0, h: 0 })
  const [strokeCount, setStrokeCount] = useState(0)
  const [result, setResult] = useState<StrokeMatchResult | null>(null)
  const [failCount, setFailCount] = useState(0)
  // Une fois débloqué (2 échecs), l'indice reste affiché pour le reste de
  // cette session d'entraînement — pas de raison de le recacher juste
  // parce qu'un essai suivant réussit ou que la zone est effacée.
  const [hintUnlocked, setHintUnlocked] = useState(false)

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
      const newWidth = rect.width * dpr
      const newHeight = rect.height * dpr
      // Le ResizeObserver peut se redéclencher sans changement réel de
      // taille (ex. reflow non lié ailleurs sur la page) ; changer
      // canvas.width/height réinitialise tout le bitmap, donc on ne le
      // fait que si la taille a vraiment changé — sinon un trait en cours
      // pouvait se retrouver effacé en plein geste.
      if (canvas.width === newWidth && canvas.height === newHeight) return
      canvas.width = newWidth
      canvas.height = newHeight
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

  function handlePointerDown(e: React.PointerEvent<HTMLCanvasElement>) {
    e.preventDefault()
    canvasRef.current?.setPointerCapture(e.pointerId)
    isDrawing.current = true
    // Un résultat déjà affiché veut dire que ce nouveau trait est un
    // nouvel essai, pas la suite du précédent — on repart de zéro plutôt
    // que d'ajouter aux traits déjà comptés (sinon "Vérifier" compare un
    // mélange des deux essais, forcément faux même si le nouvel essai est
    // correct).
    if (result) {
      strokesRef.current = []
      const ctx = canvasRef.current?.getContext('2d')
      ctx?.clearRect(0, 0, size.current.w, size.current.h)
    }
    setResult(null)
    strokesRef.current = [...strokesRef.current, [pointerPos(e)]]
  }

  function handlePointerMove(e: React.PointerEvent<HTMLCanvasElement>) {
    if (!isDrawing.current) return
    e.preventDefault()
    const ctx = canvasRef.current?.getContext('2d')
    if (!ctx) return
    const pos = pointerPos(e)
    const currentStroke = strokesRef.current[strokesRef.current.length - 1]
    const last = currentStroke[currentStroke.length - 1]
    currentStroke.push(pos)

    const ink = getComputedStyle(document.documentElement).getPropertyValue('--color-text-primary').trim()
    ctx.strokeStyle = ink || '#1c1c1e'
    ctx.lineWidth = PEN_WIDTH
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'
    ctx.beginPath()
    ctx.moveTo(last.x, last.y)
    ctx.lineTo(pos.x, pos.y)
    ctx.stroke()
  }

  function handlePointerUp() {
    if (!isDrawing.current) return
    isDrawing.current = false
    setStrokeCount(strokesRef.current.length)
  }

  function clear() {
    strokesRef.current = []
    setStrokeCount(0)
    setResult(null)
    const ctx = canvasRef.current?.getContext('2d')
    ctx?.clearRect(0, 0, size.current.w, size.current.h)
  }

  function check() {
    if (strokesRef.current.length === 0) return
    const res = matchKanjiStrokes(strokesRef.current, kanji.strokePaths)
    setResult(res)
    if (res.correct) {
      setFailCount(0)
    } else {
      const next = failCount + 1
      setFailCount(next)
      if (next >= 2) setHintUnlocked(true)
    }
  }

  return (
    <div className="kanji-practice">
      <div className="kanji-practice__head">
        <p className="kanji-practice__title">
          Essaie d&apos;écrire <strong>{kanji.character}</strong> ({kanji.strokePaths.length} traits)
        </p>
        <button type="button" className="kanji-practice__clear" onClick={clear} title="Effacer">
          <RotateCcw size={14} strokeWidth={1.75} />
        </button>
      </div>

      <div className="kanji-practice__body">
        {/* Pas de onPointerLeave ici (contrairement à WritingCanvas) : sur
            un encadré aussi petit, le curseur sort facilement de sa zone
            en plein trait alors que le bouton est toujours physiquement
            enfoncé — `setPointerCapture` continue de router pointermove/up
            vers le canvas, mais pointerleave se déclenche quand même dès
            que le curseur sort visuellement, et terminer le trait dessus
            coupait le dessin après le premier mouvement (bug signalé). */}
        <div className="kanji-practice__surface" ref={wrapRef}>
          <canvas
            ref={canvasRef}
            className="kanji-practice__ink"
            onPointerDown={handlePointerDown}
            onPointerMove={handlePointerMove}
            onPointerUp={handlePointerUp}
            onPointerCancel={handlePointerUp}
          />
        </div>

        {/* Débloqué après deux essais ratés — montre le vrai tracé de
            référence (même diagramme cumulatif que la carte d'apprentissage)
            à côté de la zone de dessin, pour apprendre plutôt que deviner. */}
        {hintUnlocked && (
          <div className="stroke-order kanji-practice__hint">
            <p className="flip-card__label">Ordre des traits</p>
            <div className="stroke-order__steps">
              {kanji.strokePaths.map((_, i) => (
                <div key={i} className="stroke-order__step">
                  <svg viewBox="0 0 109 109">
                    {kanji.strokePaths.slice(0, i + 1).map((d, j) => (
                      <path key={j} d={d} />
                    ))}
                  </svg>
                  <span className="stroke-order__step-number">{i + 1}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="kanji-practice__footer">
        <span className="kanji-practice__count">
          {strokeCount} trait{strokeCount !== 1 ? 's' : ''} tracé{strokeCount !== 1 ? 's' : ''}
        </span>
        <button type="button" className="btn-primary kanji-practice__check" onClick={check} disabled={strokeCount === 0}>
          Vérifier
        </button>
      </div>

      {result && (
        <p className={`kanji-practice__result ${result.correct ? 'correct' : 'incorrect'}`}>
          {result.correct
            ? 'Bien écrit !'
            : !result.strokeCountMatches
              ? `Pas tout à fait — ${result.drawnCount} trait${result.drawnCount !== 1 ? 's' : ''} tracé${result.drawnCount !== 1 ? 's' : ''}, il en faut ${result.expectedCount}.`
              : 'Pas tout à fait — la forme ne correspond pas encore, réessaie.'}
          {!result.correct && hintUnlocked && ' Voici le tracé de référence ci-contre.'}
        </p>
      )}
    </div>
  )
}
