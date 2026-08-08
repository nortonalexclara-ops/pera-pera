import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Check, Trophy, Info } from 'lucide-react'
import PageTransition from '../../components/ui/PageTransition'
import ProgressRing from '../../components/ui/ProgressRing'
import ModuleEndCard from '../kanji/ModuleEndCard'
import { buildKanaPool, buildKanaQuestions, type KanaDirection } from './buildKanaTest'
import type { KanaScript } from './mockKana'
import '../test/TestKnowledge.css'

interface KanaTestLocationState {
  scripts?: KanaScript[]
}

const SCRIPT_LABELS: Record<string, string> = {
  hiragana: 'Hiragana',
  katakana: 'Katakana',
}

/**
 * Équivalent QCM du test Kanjis/Vocabulaire/Grammaire (voir
 * `TestKnowledge.tsx`), mais pour hiragana/katakana : caractère → romaji ou
 * romaji → caractère, cliquer sur la bonne réponse. Accessible directement
 * depuis KanaSetup (pas seulement en fin de séance) — un test peut porter
 * sur tout un syllabaire, pas juste ce qui vient d'être vu.
 */
export default function KanaTest() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as KanaTestLocationState | null
  const scripts = state?.scripts?.length ? state.scripts : (['hiragana'] as KanaScript[])

  const [questions] = useState(() => buildKanaQuestions(buildKanaPool(scripts)))
  const [qIndex, setQIndex] = useState(0)
  const [phase, setPhase] = useState<'answering' | 'answered'>('answering')
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState(false)
  const [score, setScore] = useState(0)

  const total = questions.length

  function nextQuestion() {
    setQIndex((i) => i + 1)
    setPhase('answering')
    setSelectedOption(null)
  }

  // Voir TestKnowledge.tsx : hook toujours appelé, jamais dans une branche
  // conditionnelle (Rules of Hooks), sinon l'écran de résultat plante.
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Enter' && phase === 'answered') {
        e.preventDefault()
        nextQuestion()
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase])

  const backTarget = '/kana'

  if (total === 0) {
    return (
      <PageTransition>
        <div className="test-screen">
          <header className="test-screen__header">
            <button className="btn-link" onClick={() => navigate(backTarget)}>
              <ArrowLeft size={18} strokeWidth={1.75} />
              Retour
            </button>
          </header>
          <ModuleEndCard
            icon={Info}
            title="Rien à tester"
            description="Aucun caractère disponible pour ce syllabaire."
            buttonLabel="Retour"
            onContinue={() => navigate(backTarget)}
          />
        </div>
      </PageTransition>
    )
  }

  if (qIndex >= total) {
    const percent = Math.round((score / total) * 100)
    return (
      <PageTransition>
        <div className="test-screen">
          <ModuleEndCard
            icon={Trophy}
            title={`Test terminé : ${score}/${total} bonnes réponses`}
            description={
              percent >= 80
                ? 'Très solide — continue comme ça.'
                : percent >= 50
                  ? "Pas mal, quelques révisions ne feraient pas de mal."
                  : 'Ces caractères méritent une nouvelle séance de révision bientôt.'
            }
            buttonLabel="Retour"
            onContinue={() => navigate(backTarget)}
          />
        </div>
      </PageTransition>
    )
  }

  const question = questions[qIndex]
  const isLastQuestion = qIndex === total - 1
  const direction: KanaDirection = question.direction
  const promptText = direction === 'char-to-romaji' ? question.kana.character : question.kana.romaji
  const promptHint = direction === 'char-to-romaji' ? 'Quelle est la lecture ?' : 'Quel est le caractère ?'

  function selectOption(opt: string) {
    if (phase === 'answered') return
    const correct = opt === question.correctAnswer
    setSelectedOption(opt)
    setIsCorrect(correct)
    if (correct) setScore((s) => s + 1)
    setPhase('answered')
  }

  return (
    <PageTransition>
      <div className="test-screen">
        <header className="test-screen__header">
          <button className="btn-link" onClick={() => navigate(backTarget)}>
            <ArrowLeft size={18} strokeWidth={1.75} />
            Retour
          </button>
          <ProgressRing percent={((qIndex + 1) / total) * 100} size={44} strokeWidth={4} label={`${qIndex + 1}`} sublabel={`/ ${total}`} />
        </header>

        <div className="test-card card">
          <p className="test-card__hint">
            {promptHint} — {SCRIPT_LABELS[question.kana.script]}
          </p>
          <span className={direction === 'char-to-romaji' ? 'test-card__prompt-jp' : 'test-card__prompt-fr'}>
            {promptText}
          </span>

          {phase === 'answering' && (
            <div className="test-qcm">
              {question.options.map((opt, i) => (
                <button key={i} type="button" className="qcm-option" onClick={() => selectOption(opt)}>
                  {opt}
                </button>
              ))}
            </div>
          )}

          {phase === 'answered' && (
            <div className="test-qcm">
              {question.options.map((opt, i) => {
                const isTheCorrectOne = opt === question.correctAnswer
                const isThePickedOne = opt === selectedOption
                const cls = isTheCorrectOne ? 'correct' : isThePickedOne ? 'incorrect' : ''
                return (
                  <button key={i} type="button" className={`qcm-option ${cls}`} disabled>
                    {opt}
                  </button>
                )
              })}
            </div>
          )}

          {phase === 'answered' && (
            <motion.div
              className="test-feedback"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.25 }}
            >
              <p className={`test-feedback__status ${isCorrect ? 'correct' : 'incorrect'}`}>
                {isCorrect ? 'Correct !' : 'Pas tout à fait.'}
              </p>
              <button className="btn-primary test-feedback__next" onClick={nextQuestion}>
                {isLastQuestion ? 'Voir le résultat' : 'Question suivante'}
                <Check size={17} strokeWidth={2} />
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </PageTransition>
  )
}
