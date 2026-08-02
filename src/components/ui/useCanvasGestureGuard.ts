import { useEffect, type RefObject } from 'react'

/**
 * Empêche les gestes natifs du navigateur (sélection de texte, callout
 * "Copier/Rechercher", menu contextuel, glisser-déposer) de se déclencher
 * sur une zone de dessin tactile.
 *
 * Le CSS seul (touch-action/user-select/-webkit-touch-callout) ne suffit
 * pas de façon fiable sur iPadOS Safari avec l'Apple Pencil : un trait qui
 * marque un temps d'arrêt avant de bouger peut quand même déclencher la
 * reconnaissance de geste "sélection" du système, même avec
 * `e.preventDefault()` dans les handlers `onPointerDown`/`onPointerMove`
 * (signalé par l'utilisatrice — persistait malgré le CSS déjà en place sur
 * `.writing-canvas`/`.kanji-practice`). On intercepte donc aussi les
 * événements tactiles natifs en mode non-passif — impossible via les
 * handlers React `onTouchStart`/`onTouchMove`, passifs par défaut, d'où le
 * besoin d'un vrai `addEventListener` — pour couper le geste à la source,
 * en plus (pas à la place) du CSS.
 */
export function useCanvasGestureGuard(ref: RefObject<HTMLElement | null>) {
  useEffect(() => {
    const el = ref.current
    if (!el) return

    const preventDefault = (e: Event) => e.preventDefault()

    el.addEventListener('touchstart', preventDefault, { passive: false })
    el.addEventListener('touchmove', preventDefault, { passive: false })
    el.addEventListener('contextmenu', preventDefault)
    el.addEventListener('selectstart', preventDefault)
    el.addEventListener('dragstart', preventDefault)

    return () => {
      el.removeEventListener('touchstart', preventDefault)
      el.removeEventListener('touchmove', preventDefault)
      el.removeEventListener('contextmenu', preventDefault)
      el.removeEventListener('selectstart', preventDefault)
      el.removeEventListener('dragstart', preventDefault)
    }
  }, [ref])
}
