import { useEffect, useRef, useState, type ReactNode } from 'react'
import { motion } from 'framer-motion'
import { Check, RotateCcw, GraduationCap, Info, ChevronLeft, ChevronRight, Pencil, X } from 'lucide-react'
import WritingCanvas from './WritingCanvas'
import ModuleEndCard from './ModuleEndCard'
import { recordActivityToday } from '../../db/activity'
import { addTimeSpent } from '../../db/timeSpent'

// Plafond par "tranche" flushée (voir flushTimeSpent) — protège contre un
// onglet resté ouvert en arrière-plan pendant des heures (téléphone
// verrouillé, onglet oublié) qui gonflerait artificiellement le temps
// enregistré : au-delà de 10 min sans qu'un flush n'ait eu lieu, on
// considère le surplus comme de l'inactivité plutôt que de la pratique.
const MAX_TIME_CHUNK_SECONDS = 600

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
  // Fonction plutôt que chaîne pré-calculée : reçoit le total RÉELLEMENT
  // figé par ce composant (`total`, voir plus bas), pas un compte
  // recalculé côté appelant à chaque rendu. Un appelant qui calculerait
  // lui-même `items.length` se ferait avoir dès que la liste dépend de
  // masteredIds/reviewIds (mode "Nouveaux"/"À revoir") : cocher "Maîtrisé"
  // en cours de séance fait alors RÉTRÉCIR cette liste sous ses pieds
  // (l'item vient d'en sortir), donc le total affiché en fin de séance
  // finissait plus petit que ce qui a vraiment été parcouru (signalé par
  // l'utilisatrice : 24 cartes faites, "bravo, tu as revu les 12 mots").
  doneDescription: (total: number) => string
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
  // Le plus loin déjà atteint via une vraie décision (advance) — permet à
  // "revenir à la carte d'après" (voir goForward) de rejouer une carte déjà
  // vue sans jamais avancer sur une carte pas encore décidée (ce qui
  // reviendrait à sauter une carte sans lui donner de décision).
  const [maxIndexSeen, setMaxIndexSeen] = useState(0)
  const [phase, setPhase] = useState<'front' | 'back'>('front')
  const [revealed, setRevealed] = useState<Set<number>>(new Set())
  const [moduleDone, setModuleDone] = useState(false)
  const backFaceRef = useRef<HTMLDivElement>(null)
  // Panneau d'écriture ouvert en fenêtre sur téléphone (demande
  // utilisatrice : toujours affiché en ligne, il forçait trop de
  // défilement pour voir les exemples au dos de la carte) — sans effet
  // sur desktop, où la colonne reste affichée normalement à côté de la
  // carte (voir la règle responsive dans SessionCard.css).
  const [showWritingModal, setShowWritingModal] = useState(false)

  // Temps passé en séance (vrai "temps passé par jour", voir Stats.tsx) —
  // écrit en base par petites tranches (à chaque carte passée, voir
  // advance) plutôt qu'en une fois à la sortie : une sortie brutale
  // (fermeture d'onglet, crash) sans démontage propre ne perdrait alors
  // que la toute dernière tranche en cours, pas toute la séance. `ref` (pas
  // state) pour `profileId` : lu depuis le cleanup du useEffect ci-dessous,
  // qui doit voir la valeur la plus récente même si ce composant ne se
  // re-rend pas entre-temps.
  const profileIdRef = useRef(profileId)
  useEffect(() => {
    profileIdRef.current = profileId
  }, [profileId])
  const chunkStartRef = useRef(Date.now())

  function flushTimeSpent() {
    const pid = profileIdRef.current
    const elapsedSeconds = Math.round((Date.now() - chunkStartRef.current) / 1000)
    chunkStartRef.current = Date.now()
    if (!pid || elapsedSeconds <= 0) return
    addTimeSpent(pid, Math.min(elapsedSeconds, MAX_TIME_CHUNK_SECONDS))
  }

  useEffect(() => {
    return () => flushTimeSpent()
    // Volontairement []: ce flush de sortie ne doit se déclencher qu'au
    // démontage réel du composant, pas à chaque changement de profileId
    // (déjà suivi séparément via profileIdRef ci-dessus).
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

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
    flushTimeSpent()
    if (isLast) {
      setModuleDone(true)
    } else {
      setIndex((i) => {
        const next = i + 1
        setMaxIndexSeen((m) => Math.max(m, next))
        return next
      })
      setPhase('front')
      setRevealed(new Set())
      setShowWritingModal(false)
    }
  }

  function goBack() {
    if (index === 0) return
    setIndex((i) => i - 1)
    setPhase('front')
    setRevealed(new Set())
    setShowWritingModal(false)
  }

  // Rejoue une carte déjà vue (voir maxIndexSeen) — pour "revenir en
  // arrière voir une carte puis revenir à la carte d'après" (demande
  // explicite de l'utilisatrice) sans avoir à re-décider "Maîtrisé"/"À
  // revoir" sur chaque carte entre les deux.
  function goForward() {
    if (index >= maxIndexSeen) return
    setIndex((i) => i + 1)
    setPhase('front')
    setRevealed(new Set())
    setShowWritingModal(false)
  }

  if (moduleDone) {
    return (
      <ModuleEndCard
        icon={GraduationCap}
        title={doneTitle}
        description={doneDescription(total)}
        buttonLabel={continueLabel}
        onContinue={onDone}
      />
    )
  }

  return (
    <>
      <div className="session__card-col">
        {renderCounter && (
          <div className="session__top-row">
            <div className="session__level-counter">{renderCounter(index, total)}</div>
          </div>
        )}
        <div className={`flip-card${phase === 'back' ? ' is-flipped' : ''}`}>
          {total > 1 && (
            <button
              type="button"
              className="session__nav-btn session__nav-btn--prev"
              onClick={goBack}
              disabled={index === 0}
              title="Carte précédente"
            >
              <ChevronLeft size={28} strokeWidth={2} />
            </button>
          )}
          {/* `key` sur l'item courant — sans ça, passer à la carte
              suivante (Maîtrisé/À revoir, ou navigation précédente/
              suivante) réutilisait le même nœud DOM : son contenu passait
              instantanément à la carte suivante pendant que la rotation
              CSS (retour de "retourné" à "face") continuait encore
              d'animer sur 0.6s, laissant entrevoir le VERSO de la carte
              suivante pendant la transition (signalé par l'utilisatrice,
              sur toutes les cartes, pas seulement Kanjis). Remonter un
              nœud frais à chaque nouvel item évite l'animation — il n'y a
              alors rien "d'avant" dont partir, il apparaît directement
              dans son état final (face visible, `phase` déjà "front"). Le
              retournement pour révéler la MÊME carte n'est pas affecté :
              la clé ne change pas dans ce cas. */}
          <div className="flip-card__inner" key={getKey(item)}>
            <button type="button" className="flip-card__face flip-card__face--front" onClick={() => setPhase('back')}>
              {renderFront(item)}
              <p className="flip-card__flip-hint">Touche la carte pour révéler</p>
            </button>

            <div className="flip-card__face flip-card__face--back" ref={backFaceRef}>
              {renderBack(item, revealed, toggleReveal)}
            </div>
          </div>
          {total > 1 && (
            <button
              type="button"
              className="session__nav-btn session__nav-btn--next"
              onClick={goForward}
              disabled={index >= maxIndexSeen}
              title="Carte suivante"
            >
              <ChevronRight size={28} strokeWidth={2} />
            </button>
          )}
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

      {/* Bulle + fenêtre : uniquement au verso, sur téléphone (voir
          @media 860px, SessionCard.css) — demande utilisatrice, écrire de
          mémoire AVANT de retourner la carte reste utile, donc la zone
          reste ouverte en ligne au recto comme avant ; au verso (réponse
          déjà visible), elle est camouflée derrière la bulle pour ne plus
          forcer à défiler autant pour voir les exemples. Sur desktop, ni
          la bulle ni ce fond ne s'affichent (colonne toujours en ligne). */}
      {phase === 'back' && (
        <button
          type="button"
          className="session__writing-fab"
          onClick={() => setShowWritingModal(true)}
          title="Entraînement à l'écriture"
        >
          <Pencil size={20} strokeWidth={2} />
        </button>
      )}

      <div
        className={`session__writing-backdrop${phase === 'back' && showWritingModal ? ' is-open' : ''}`}
        onClick={() => setShowWritingModal(false)}
      />

      <div
        className={`session__writing-col${
          phase === 'front' ? ' session__writing-col--inline' : showWritingModal ? ' is-open' : ''
        }`}
      >
        {phase === 'back' && (
          <button
            type="button"
            className="session__writing-modal-close"
            onClick={() => setShowWritingModal(false)}
            title="Fermer"
          >
            <X size={18} strokeWidth={2} />
          </button>
        )}
        {renderWritingExtra?.(item)}
        <WritingCanvas strokeKey={getKey(item)} />
      </div>
    </>
  )
}
