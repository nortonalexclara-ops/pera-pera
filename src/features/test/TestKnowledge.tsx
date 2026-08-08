import { useEffect, useState, type FormEvent } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { ArrowLeft, Check, Trophy, Info } from 'lucide-react'
import PageTransition from '../../components/ui/PageTransition'
import ProgressRing from '../../components/ui/ProgressRing'
import ModuleEndCard from '../kanji/ModuleEndCard'
import type { JlptLevel } from '../kanji/mockKanji'
import { buildTestPool, buildTestPoolFromSeen, buildQuestions, isAnswerAccepted, type SeenItem } from './buildTest'
import './TestKnowledge.css'

interface TestLocationState {
  modules?: string[]
  level?: JlptLevel
  seenItems?: SeenItem[]
}

export default function TestKnowledge() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as TestLocationState | null
  const modules = state?.modules?.length ? state.modules : ['Kanjis']
  const level = state?.level ?? null
  const seenItems = state?.seenItems

  // Se limite à ce qui vient d'être vu pendant la séance (le chemin
  // normal) — repli sur tout le contenu du niveau seulement si `/session/test`
  // est atteint sans passer par une séance (`seenItems` absent).
  const [questions] = useState(() =>
    buildQuestions(seenItems && seenItems.length > 0 ? buildTestPoolFromSeen(seenItems) : buildTestPool(modules, level)),
  )
  const [qIndex, setQIndex] = useState(0)
  const [phase, setPhase] = useState<'answering' | 'answered'>('answering')
  const [writeInput, setWriteInput] = useState('')
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState(false)
  const [wasSkipped, setWasSkipped] = useState(false)
  const [score, setScore] = useState(0)

  const total = questions.length

  function nextQuestion() {
    setQIndex((i) => i + 1)
    setPhase('answering')
    setWriteInput('')
    setSelectedOption(null)
    setWasSkipped(false)
  }

  // Entrée passe à la question suivante une fois la réponse révélée — pas
  // besoin de viser le bouton avec la souris/le doigt à chaque fois. En
  // mode "écrire", la première Entrée valide déjà la réponse via le
  // formulaire ; celle-ci ne fait quelque chose qu'une fois en phase
  // "answered", donc pas de double-validation sur le même appui.
  // Doit rester AVANT les `return` anticipés ci-dessous (total===0,
  // qIndex>=total) : un hook appelé seulement dans certaines branches
  // viole les Rules of Hooks ("Rendered fewer hooks than expected") dès
  // qu'on atteint une branche qui ne l'appelle pas — c'est précisément ce
  // qui plantait l'écran de résultat en fin de test (signalé par
  // l'utilisatrice : rien ne s'affichait après la dernière question).
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

  if (total === 0) {
    return (
      <PageTransition>
        <div className="test-screen">
          <header className="test-screen__header">
            <button className="btn-link" onClick={() => navigate('/dashboard')}>
              <ArrowLeft size={18} strokeWidth={1.75} />
              Retour au dashboard
            </button>
          </header>
          <ModuleEndCard
            icon={Info}
            title="Rien à tester"
            description="Aucun module Kanjis, Vocabulaire ou Grammaire n'a été inclus dans cette séance — le test n'a rien à proposer pour l'instant."
            buttonLabel="Retour au dashboard"
            onContinue={() => navigate('/dashboard')}
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
                  : 'Ces notions méritent une nouvelle séance de révision bientôt.'
            }
            buttonLabel="Retour au dashboard"
            onContinue={() => navigate('/dashboard')}
          />
        </div>
      </PageTransition>
    )
  }

  const question = questions[qIndex]
  const isLastQuestion = qIndex === total - 1

  // En mode "écrire", quel que soit le sens de la question, on accepte la
  // traduction française OU la lecture OU le mot/kanji lui-même — répondre
  // avec ce qu'on sait, peu importe sous quelle forme, plutôt que de devoir
  // deviner quelle forme précise est attendue.
  const writeCandidates = [...question.item.meanings, ...question.item.readings, question.item.prompt]

  function submitWrite(e: FormEvent) {
    e.preventDefault()
    if (!writeInput.trim() || phase === 'answered') return
    const correct = isAnswerAccepted(writeInput, writeCandidates)
    setIsCorrect(correct)
    setWasSkipped(false)
    if (correct) setScore((s) => s + 1)
    setPhase('answered')
  }

  function selectOption(opt: string) {
    if (phase === 'answered') return
    const correctOption = question.direction === 'jp-to-fr' ? question.item.meanings[0] : question.item.prompt
    const correct = opt === correctOption
    setSelectedOption(opt)
    setIsCorrect(correct)
    setWasSkipped(false)
    if (correct) setScore((s) => s + 1)
    setPhase('answered')
  }

  function skipQuestion() {
    if (phase === 'answered') return
    setIsCorrect(false)
    setWasSkipped(true)
    setPhase('answered')
  }

  const promptText = question.direction === 'jp-to-fr' ? question.item.prompt : question.item.meanings[0]
  // "Écris ce mot..." n'a plus de sens maintenant que le test est
  // quasi-toujours en QCM (demande utilisatrice) — ne s'affiche que sur le
  // repli "write" (pool à un seul item, voir buildQuestions), le reste du
  // temps c'est "clique sur la bonne réponse" qui décrit vraiment l'action.
  const promptHint =
    question.direction === 'jp-to-fr'
      ? 'Quelle est la traduction ?'
      : question.mode === 'qcm'
        ? 'Quel est ce mot en japonais ?'
        : 'Écris ce mot en japonais'
  const writePlaceholder = question.direction === 'jp-to-fr' ? 'Traduction en français' : 'Mot en japonais ou lecture'
  const correctOptionForQcm = question.direction === 'jp-to-fr' ? question.item.meanings[0] : question.item.prompt

  return (
    <PageTransition>
      <div className="test-screen">
        <header className="test-screen__header">
          <button className="btn-link" onClick={() => navigate('/dashboard')}>
            <ArrowLeft size={18} strokeWidth={1.75} />
            Retour au dashboard
          </button>
          <ProgressRing percent={((qIndex + 1) / total) * 100} size={44} strokeWidth={4} label={`${qIndex + 1}`} sublabel={`/ ${total}`} />
        </header>

        <div className="test-card card">
          <p className="test-card__hint">{promptHint}</p>
          <span className={question.direction === 'jp-to-fr' ? 'test-card__prompt-jp' : 'test-card__prompt-fr'}>
            {promptText}
          </span>

          {phase === 'answering' && question.mode === 'write' && (
            <>
              <form className="test-write" onSubmit={submitWrite}>
                <input
                  className="test-write__input"
                  type="text"
                  placeholder={writePlaceholder}
                  value={writeInput}
                  onChange={(e) => setWriteInput(e.target.value)}
                  autoComplete="off"
                  autoCapitalize="off"
                  spellCheck={false}
                />
                <button type="submit" className="btn-primary test-write__submit">
                  Valider
                </button>
              </form>
              <button type="button" className="btn-link test-skip" onClick={skipQuestion}>
                Je ne sais pas
              </button>
            </>
          )}

          {phase === 'answering' && question.mode === 'qcm' && question.options && (
            <>
              <div className="test-qcm">
                {question.options.map((opt, i) => (
                  <button key={i} type="button" className="qcm-option" onClick={() => selectOption(opt)}>
                    {opt}
                  </button>
                ))}
              </div>
              <button type="button" className="btn-link test-skip" onClick={skipQuestion}>
                Je ne sais pas
              </button>
            </>
          )}

          {phase === 'answered' && question.mode === 'qcm' && question.options && (
            <div className="test-qcm">
              {question.options.map((opt, i) => {
                const isTheCorrectOne = opt === correctOptionForQcm
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
                {isCorrect ? 'Correct !' : wasSkipped ? 'Pas grave, on continue.' : 'Pas tout à fait.'}
              </p>
              <p className="test-feedback__answer">
                Réponse : <strong>{question.correctAnswer}</strong>
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
