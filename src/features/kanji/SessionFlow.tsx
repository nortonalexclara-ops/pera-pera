import { useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft, ArrowRight } from 'lucide-react'
import PageTransition from '../../components/ui/PageTransition'
import KanjiCardLoop from './KanjiCardLoop'
import VocabCardLoop from '../vocab/VocabCardLoop'
import GrammarCardLoop from '../grammar/GrammarCardLoop'
import RevisionCardLoop from '../revision/RevisionCardLoop'
import type { JlptLevel } from './mockKanji'
import type { SeenItem } from '../test/buildTest'
import './SessionCard.css'

const DEFAULT_MODULES = ['Kanjis']

type ContentMode = 'new' | 'mix'

interface SessionLocationState {
  modules?: string[]
  level?: JlptLevel
  // 'new' pour un module = ne montrer que ce qui n'est pas encore
  // "Maîtrisé" par le profil actif ; absent/'mix' = comportement historique
  // (tout le contenu du niveau). Envoyé par la séance recommandée
  // ('new' sur Kanjis/Vocabulaire/Grammaire) et par la séance personnalisée
  // (reflète le choix Nouveaux/Mélange par module).
  contentModes?: Partial<Record<'Kanjis' | 'Vocabulaire' | 'Grammaire', ContentMode>>
  // Plafonne la taille de chaque module — seule la séance recommandée
  // l'utilise, pour proposer un lot raisonnable plutôt que tout le niveau.
  limits?: Partial<Record<'Kanjis' | 'Vocabulaire' | 'Grammaire' | 'Révisions', number>>
}

export default function SessionFlow() {
  const navigate = useNavigate()
  const location = useLocation()
  const [moduleIndex, setModuleIndex] = useState(0)
  // Accumule ce qui a été vu (décision Maîtrisé/À revoir prise) sur tous
  // les modules de la séance, dans l'ordre — c'est cette liste précise qui
  // alimente "Tester mes connaissances" ensuite, pas tout le contenu du
  // niveau. Un ref suffit : rien n'a besoin de redéclencher un rendu ici.
  const seenItemsRef = useRef<SeenItem[]>([])

  const state = location.state as SessionLocationState | null
  const modules = state?.modules?.length ? state.modules : DEFAULT_MODULES
  // Pas de niveau choisi (ex. séance recommandée) = tous niveaux confondus,
  // comme le ferait un vrai algorithme de révision.
  const level = state?.level ?? null
  const contentModes = state?.contentModes
  const limits = state?.limits

  const currentModule = modules[moduleIndex]
  const isLastModule = moduleIndex === modules.length - 1
  const continueLabel = isLastModule ? 'Tester mes connaissances' : 'Passer au module suivant'

  function handleItemSeen(item: SeenItem) {
    seenItemsRef.current.push(item)
  }

  function handleModuleDone() {
    if (isLastModule) {
      navigate('/session/test', { state: { modules, level, seenItems: seenItemsRef.current } })
    } else {
      setModuleIndex((i) => i + 1)
    }
  }

  return (
    <PageTransition>
      <div className="session">
        <header className="session__header">
          <button className="btn-link" onClick={() => navigate('/dashboard')}>
            <ArrowLeft size={18} strokeWidth={1.75} />
            Retour au dashboard
          </button>
          <div className="session__header-right">
            {level && <span className="session__module-badge">{level}</span>}
            {modules.length > 1 && (
              <span className="session__module-badge">
                {currentModule} · {moduleIndex + 1}/{modules.length}
              </span>
            )}
            {/* Toujours disponible : aucun nombre de cartes n'est imposé pour
                un module, donc c'est à l'utilisateur de décider quand il a
                fini, pas à un compteur. */}
            <button className="btn-link" onClick={handleModuleDone}>
              {continueLabel}
              <ArrowRight size={14} strokeWidth={2} />
            </button>
          </div>
        </header>

        <div className="session__body">
          {currentModule === 'Kanjis' ? (
            <KanjiCardLoop
              level={level}
              contentMode={contentModes?.Kanjis}
              limit={limits?.Kanjis}
              continueLabel={continueLabel}
              onDone={handleModuleDone}
              onItemSeen={handleItemSeen}
            />
          ) : currentModule === 'Vocabulaire' ? (
            <VocabCardLoop
              level={level}
              contentMode={contentModes?.Vocabulaire}
              limit={limits?.Vocabulaire}
              continueLabel={continueLabel}
              onDone={handleModuleDone}
              onItemSeen={handleItemSeen}
            />
          ) : currentModule === 'Grammaire' ? (
            <GrammarCardLoop
              level={level}
              contentMode={contentModes?.Grammaire}
              limit={limits?.Grammaire}
              continueLabel={continueLabel}
              onDone={handleModuleDone}
              onItemSeen={handleItemSeen}
            />
          ) : (
            <RevisionCardLoop
              level={level}
              limit={limits?.Révisions}
              continueLabel={continueLabel}
              onDone={handleModuleDone}
              onItemSeen={handleItemSeen}
            />
          )}
        </div>
      </div>
    </PageTransition>
  )
}
