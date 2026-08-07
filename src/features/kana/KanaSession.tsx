import { useLocation, useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import PageTransition from '../../components/ui/PageTransition'
import KanaCardLoop from './KanaCardLoop'
import type { KanaScript } from './mockKana'
import '../kanji/SessionCard.css'

interface KanaSessionState {
  scripts?: KanaScript[]
  contentMode?: 'new' | 'mix' | 'review'
}

const SCRIPT_LABELS: Record<string, string> = {
  hiragana: 'Hiragana',
  katakana: 'Katakana',
}

/**
 * Écran de pratique du module Kana — même habillage que SessionFlow
 * (Kanjis/Vocabulaire/Grammaire) mais un seul "module" à la fois, pas de
 * séquence à plusieurs étapes ni de "Tester mes connaissances" ensuite
 * (hors périmètre pour ce premier jet).
 */
export default function KanaSession() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as KanaSessionState | null
  const scripts = state?.scripts?.length ? state.scripts : (['hiragana'] as KanaScript[])
  const contentMode = state?.contentMode ?? 'mix'

  function handleDone() {
    navigate('/dashboard')
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
            <span className="session__module-badge">
              {scripts.length > 1 ? 'Hiragana & Katakana' : SCRIPT_LABELS[scripts[0]]}
            </span>
          </div>
        </header>

        <div className="session__body">
          <KanaCardLoop scripts={scripts} contentMode={contentMode} continueLabel="Terminer" onDone={handleDone} />
        </div>
      </div>
    </PageTransition>
  )
}
