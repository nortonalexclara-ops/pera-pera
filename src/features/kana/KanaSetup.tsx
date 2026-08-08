import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowRight, ListChecks } from 'lucide-react'
import ChoiceButtonGroup from '../../components/ui/ChoiceButtonGroup'
import PageTransition from '../../components/ui/PageTransition'
import AmbientGlow from '../../components/ui/AmbientGlow'
import { CONTENT_OPTIONS, CONTENT_TO_MODE, DEFAULT_CONTENT_OPTION } from '../dashboard/sessionOptions'
import type { KanaScript } from './mockKana'
// Réutilise les classes déjà construites pour la séance personnalisée
// (étiquettes, bouton principal) — même esprit d'écran, pas de nouveau
// vocabulaire visuel à apprendre.
import '../dashboard/Dashboard.css'
import './KanaSetup.css'

const SCRIPT_OPTIONS = ['Hiragana', 'Katakana', 'Les deux']

const SCRIPT_TO_VALUE: Record<string, KanaScript[]> = {
  Hiragana: ['hiragana'],
  Katakana: ['katakana'],
  'Les deux': ['hiragana', 'katakana'],
}

/**
 * Écran d'accueil du module Kana — pas de niveau JLPT à choisir
 * (contrairement à Kanjis/Vocabulaire/Grammaire), juste l'alphabet visé
 * et le contenu (Nouveaux/Mélange/À revoir, mêmes options que partout
 * ailleurs). Volontairement séparé de la séance personnalisée
 * (CustomSessionBuilder) plutôt qu'un module de plus dedans : celle-ci
 * suppose un niveau JLPT pour tous ses modules, que hiragana/katakana
 * n'ont pas.
 */
export default function KanaSetup() {
  const navigate = useNavigate()
  const [script, setScript] = useState(SCRIPT_OPTIONS[0])
  const [content, setContent] = useState(DEFAULT_CONTENT_OPTION)

  function handleStart() {
    navigate('/session/kana', {
      state: { scripts: SCRIPT_TO_VALUE[script], contentMode: CONTENT_TO_MODE[content] },
    })
  }

  // Test QCM direct sur le syllabaire choisi, sans passer par une séance
  // d'apprentissage au préalable (demande explicite de l'utilisatrice :
  // "hiragana > test" ou "katakana > test" sélectionnable directement).
  function handleTest() {
    navigate('/session/kana/test', { state: { scripts: SCRIPT_TO_VALUE[script] } })
  }

  return (
    <PageTransition>
      <div className="kana-setup">
        <AmbientGlow top={-90} left={-60} size={260} color="var(--color-warm-glow)" />
        <h1 className="kana-setup__title">Hiragana & Katakana</h1>
        <p className="kana-setup__subtitle">
          Apprends les deux syllabaires de la même façon que les kanjis : carte à retourner, lecture, entraînement à
          l'écriture.
        </p>

        <div className="card kana-setup__card">
          <p className="custom-builder__label">Alphabet</p>
          <ChoiceButtonGroup options={SCRIPT_OPTIONS} selected={[script]} onToggle={setScript} />

          <p className="custom-builder__label">Contenu</p>
          <ChoiceButtonGroup options={CONTENT_OPTIONS} selected={[content]} onToggle={setContent} />

          <button type="button" className="btn-primary hero-card__cta" onClick={handleStart}>
            Commencer
            <ArrowRight size={17} strokeWidth={2} />
          </button>
          <button type="button" className="btn-outline hero-card__cta" onClick={handleTest}>
            Tester mes connaissances
            <ListChecks size={17} strokeWidth={2} />
          </button>
        </div>
      </div>
    </PageTransition>
  )
}
