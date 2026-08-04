import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Check, RotateCcw, GraduationCap, Info, ChevronLeft } from 'lucide-react'
import WritingCanvas from './WritingCanvas'
import ModuleEndCard from './ModuleEndCard'
import { recordActivityToday } from '../../db/activity'

interface CardLoopShellProps<T> {
  items: T[]
  // Indique si `items` reflète déjà l'état réel (pas la valeur par défaut
  // synchrone d'un useLiveQuery encore en cours de résolution côté
  // appelant). Par défaut à `true` (le cas courant : contenu statique, pas
  // de dépendance à une requête async) — les appelants dont `items` dépend
  // de mastery via useLiveQuery doivent le calculer explicitement (voir
  // KanjiCardLoop/VocabCardLoop/GrammarCardLoop/RevisionCardLoop), sinon
  // la file peut se figer sur la valeur par défaut avant que la vraie
  // liste filtrée arrive (ex. "nouveaux kanjis" affiche tout le niveau au
  // lieu de seulement ce qui n'est pas encore maîtrisé, le temps que
  // masteredIds se résolve).
  itemsReady?: boolean
  getKey: (item: T) => string
  renderFront: (item: T) => ReactNode
  renderBack: (item: T, revealed: Set<number>, toggleReveal: (i: number) => void) => ReactNode
  emptyDescription: string
  doneTitle: string
  doneDescription: string
  continueLabel: string
  onDone: () => void
  // Position dans le programme complet du niveau (pas la session en cours)
  // — ex. "12 / 101" pour se situer dans tous les kanjis N5 à connaître.
  // Rendu au-dessus de la carte, seulement fourni par les appelants qui
  // ont ce repère (le module Kanjis pour l'instant).
  renderCounter?: (index: number, total: number) => ReactNode
  // Appelé avec l'item qu'on vient de quitter ET la décision prise dessus
  // ("mastered" / "review") — l'appelant s'en sert pour suivre ce qui a
  // été vu pendant la séance (limite "Tester mes connaissances" à ça) ET
  // pour persister la maîtrise en base (voir `src/db/mastery.ts`).
  onAdvance?: (item: T, decision: 'mastered' | 'review') => void
  // Contenu additionnel affiché au-dessus du panneau d'écriture (colonne
  // de droite), à côté de la zone où on s'entraîne à tracer — utilisé par
  // le module Kanjis pour l'ordre des traits (repère utile juste à côté
  // d'où on écrit, plutôt qu'enterré dans la carte à gauche).
  renderWritingExtra?: (item: T) => ReactNode
  // Profil actif — sert uniquement à enregistrer une ligne d'activité du
  // jour (streak, voir `src/db/activity.ts`) à chaque carte passée.
  // Centralisé ici plutôt que dupliqué dans les 4 appelants (Kanjis/
  // Vocabulaire/Grammaire/Révisions), qui font déjà tous un `advance()`.
  profileId?: string | null
}

/**
 * Squelette partagé par les boucles de cartes (Kanjis/Vocabulaire/
 * Grammaire/Révisions) — gère l'état (index, face, réponses révélées, fin
 * de module), le flip, les boutons de décision et le panneau d'écriture ;
 * seul le contenu des deux faces change d'un module à l'autre, fourni via
 * renderFront/renderBack. Extrait après coup (les quatre boucles étaient
 * quasi identiques à l'exception du contenu des cartes) plutôt que dupliqué
 * une quatrième fois pour Révisions.
 */
export default function CardLoopShell<T>({
  items,
  itemsReady = true,
  getKey,
  renderFront,
  renderBack,
  emptyDescription,
  doneTitle,
  doneDescription,
  continueLabel,
  onDone,
  renderCounter,
  onAdvance,
  renderWritingExtra,
  profileId,
}: CardLoopShellProps<T>) {
  // Figée une seule fois, dès que `itemsReady` passe à true, puis plus
  // jamais resynchronisée ensuite : les listes fournies par les appelants
  // filtrent souvent en direct sur masteredIds (via useLiveQuery), donc
  // marquer une carte "Maîtrisé"/"À revoir" peut la faire disparaître de
  // `items` au rendu suivant et décaler tous les index qui suivent. Sans
  // figer la file, la flèche "précédente" se retrouve alors à pointer sur
  // une toute autre carte que celle qu'on vient de quitter. On ne fige pas
  // au tout premier rendu si `itemsReady` est encore false : tant que
  // useLiveQuery n'a pas résolu sa vraie valeur, `items` peut être vide
  // (Révisions, dont le contenu dépend entièrement de masteredIds) OU au
  // contraire non filtrée (contentMode "new" avec des items déjà
  // maîtrisés : `items` contient tout le niveau avant résolution, pas
  // seulement les nouveaux) — figer sur cette valeur transitoire dans les
  // deux cas donnerait une file fausse pour toute la séance. `hasFrozen`
  // (ref, pas state) verrouille définitivement une fois `itemsReady` vu à
  // true, pour ne jamais re-synchroniser après (ce qui annulerait l'effet
  // recherché : rester stable une fois que "Maîtrisé" a été coché).
  // Capture synchrone à l'initialisation pour le cas courant (itemsReady
  // déjà vrai au montage — pas de dépendance à une requête async, ou
  // requête déjà résolue) : pas de flash, la file est bonne dès le premier
  // rendu. `useEffect` sert de filet pour le cas async (itemsReady passe
  // de false à true après coup) : un simple "ajustement pendant le rendu"
  // ne suffit pas ici, ce chemin s'est révélé instable sous
  // StrictMode (double rendu de développement) — l'effet, lui, ne
  // s'exécute qu'une fois le rendu réellement validé, donc de façon fiable
  // même avec le double montage volontaire de StrictMode en dev.
  const hasFrozen = useRef(itemsReady)
  const [queue, setQueue] = useState<T[]>(itemsReady ? items : [])
  useEffect(() => {
    if (!hasFrozen.current && itemsReady) {
      hasFrozen.current = true
      setQueue(items)
    }
    // items volontairement absent des deps : on ne veut réagir qu'aux
    // transitions de itemsReady, jamais resynchroniser sur un changement
    // de items une fois figé (ce qui annulerait l'effet recherché).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [itemsReady])
  const [index, setIndex] = useState(0)
  const [phase, setPhase] = useState<'front' | 'back'>('front')
  const [revealed, setRevealed] = useState<Set<number>>(new Set())
  const [moduleDone, setModuleDone] = useState(false)
  const backFaceRef = useRef<HTMLDivElement>(null)

  // Bug signalé : après "Maîtrisé"/"À revoir", la carte suivante
  // s'ouvrait parfois déjà scrollée tout en bas (traduction/exemples
  // hors champ) au lieu de démarrer en haut. `.flip-card__face--back`
  // est le même élément DOM réutilisé d'une carte à l'autre (seul son
  // contenu change) — son scroll ne se réinitialise pas tout seul juste
  // parce que `item` a changé. Remis à zéro à chaque fois qu'on regarde
  // le dos d'une carte (nouvelle carte OU re-retournement de la même).
  useEffect(() => {
    if (phase === 'back' && backFaceRef.current) {
      backFaceRef.current.scrollTop = 0
    }
  }, [phase, index])

  const total = queue.length
  const item = queue[index]
  const isLast = index === total - 1

  // Tant que la file n'est pas encore figée (itemsReady toujours false),
  // ne rien afficher plutôt que de montrer "Rien à réviser" en un flash —
  // ce message ne doit apparaître que si le niveau est vraiment vide une
  // fois les vraies données chargées, pas pendant le court instant où
  // useLiveQuery résout encore sa valeur.
  if (!hasFrozen.current) {
    return null
  }

  if (total === 0) {
    return (
      <ModuleEndCard
        icon={Info}
        title="Rien à réviser à ce niveau"
        description={emptyDescription}
        buttonLabel={continueLabel}
        onContinue={onDone}
      />
    )
  }

  function toggleReveal(i: number) {
    setRevealed((prev) => {
      const next = new Set(prev)
      if (next.has(i)) next.delete(i)
      else next.add(i)
      return next
    })
  }

  function advance(decision: 'mastered' | 'review') {
    onAdvance?.(item, decision)
    if (profileId) recordActivityToday(profileId)
    if (isLast) {
      setModuleDone(true)
    } else {
      setIndex((i) => i + 1)
      setPhase('front')
      setRevealed(new Set())
    }
  }

  function goBack() {
    if (index === 0) return
    setIndex((i) => i - 1)
    setPhase('front')
    setRevealed(new Set())
  }

  if (moduleDone) {
    return (
      <ModuleEndCard
        icon={GraduationCap}
        title={doneTitle}
        description={doneDescription}
        buttonLabel={continueLabel}
        onContinue={onDone}
      />
    )
  }

  return (
    <>
      <div className="session__card-col">
        {(renderCounter || total > 1) && (
          <div className="session__top-row">
            <button
              type="button"
              className="session__back-btn"
              onClick={goBack}
              disabled={index === 0}
              title="Élément précédent"
            >
              <ChevronLeft size={16} strokeWidth={2} />
            </button>
            {renderCounter && <div className="session__level-counter">{renderCounter(index, total)}</div>}
          </div>
        )}
        <div className={`flip-card${phase === 'back' ? ' is-flipped' : ''}`}>
          <div className="flip-card__inner">
            <button type="button" className="flip-card__face flip-card__face--front" onClick={() => setPhase('back')}>
              {renderFront(item)}
              <p className="flip-card__flip-hint">Touche la carte pour révéler</p>
            </button>

            <div className="flip-card__face flip-card__face--back" ref={backFaceRef}>
              {renderBack(item, revealed, toggleReveal)}
            </div>
          </div>
        </div>

        {phase === 'back' && (
          <motion.div
            className="session__decision"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.25 }}
          >
            <button className="decision-btn decision-btn--review" onClick={() => advance('review')}>
              <RotateCcw size={16} strokeWidth={2} />
              À revoir
            </button>
            <button className="decision-btn decision-btn--mastered" onClick={() => advance('mastered')}>
              <Check size={16} strokeWidth={2} />
              Maîtrisé
            </button>
          </motion.div>
        )}
      </div>

      <div className="session__writing-col">
        {renderWritingExtra?.(item)}
        <WritingCanvas strokeKey={getKey(item)} />
      </div>
    </>
  )
}
