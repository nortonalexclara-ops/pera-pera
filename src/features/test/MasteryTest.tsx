import { useEffect, useMemo, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useLiveQuery } from 'dexie-react-hooks'
import { Square, Check, Trophy, Info } from 'lucide-react'
import { useProfileStore } from '../profile/profileStore'
import { getAllMasteredIds } from '../../db/mastery'
import { recordActivityToday } from '../../db/activity'
import { getTestRecord, recordTestResult, type TestRecord } from '../../db/settings'
import type { ItemKind } from '../../db/db'
import type { JlptLevel } from '../kanji/mockKanji'
import PageTransition from '../../components/ui/PageTransition'
import ModuleEndCard from '../kanji/ModuleEndCard'
import { buildMasteredTestPool, buildOneQuestion, type TestQuestion } from './buildTest'
import './TestKnowledge.css'

interface MasteryTestLocationState {
  level?: JlptLevel
  modules?: string[]
}

const EMPTY_MASTERED: Record<ItemKind, Set<string>> = {
  kanji: new Set(),
  vocab: new Set(),
  grammar: new Set(),
  hiragana: new Set(),
  katakana: new Set(),
}

const EMPTY_RECORD: TestRecord = { bestScore: 0, bestTimeSeconds: 0 }

export function formatTime(totalSeconds: number): string {
  const m = Math.floor(totalSeconds / 60)
  const s = totalSeconds % 60
  return `${m}:${String(s).padStart(2, '0')}`
}

// Test "Maîtrisé" — questions illimitées tirées du pool de cartes déjà
// maîtrisées par le profil (contrairement à TestKnowledge.tsx, qui teste un
// lot fixe issu d'une séance ou de tout un niveau). Pas de fin automatique :
// l'utilisatrice arrête quand elle veut via le bouton "Terminer le test",
// qui affiche alors un récap correct/total, avec le temps tenu et le
// record (score et temps, voir settings.ts) — pensé comme un petit jeu où
// on essaie de battre sa propre meilleure tentative.
export default function MasteryTest() {
  const navigate = useNavigate()
  const location = useLocation()
  const state = location.state as MasteryTestLocationState | null
  const level = state?.level ?? null
  const modules = state?.modules?.length ? state.modules : ['Kanjis', 'Vocabulaire', 'Grammaire']
  const profileId = useProfileStore((s) => s.activeProfileId)

  const masteredIds = useLiveQuery(
    () => (profileId ? getAllMasteredIds(profileId) : Promise.resolve(EMPTY_MASTERED)),
    [profileId],
    EMPTY_MASTERED,
  )
  // Même repère que Dashboard.tsx/Explorer.tsx : tant que `masteredIds` est
  // encore la référence par défaut, la requête n'a pas fini son premier
  // aller-retour — évite d'afficher "pas assez de cartes" par erreur le
  // temps que la vraie liste arrive.
  const masteredReady = masteredIds !== EMPTY_MASTERED

  const pool = useMemo(
    () => (level ? buildMasteredTestPool(modules, level, masteredIds) : []),
    [modules, level, masteredIds],
  )

  const record = useLiveQuery(
    () => (profileId ? getTestRecord(profileId) : Promise.resolve(EMPTY_RECORD)),
    [profileId],
    EMPTY_RECORD,
  )

  const [question, setQuestion] = useState<TestQuestion | null>(null)
  const [phase, setPhase] = useState<'answering' | 'answered'>('answering')
  const [selectedOption, setSelectedOption] = useState<string | null>(null)
  const [isCorrect, setIsCorrect] = useState(false)
  const [answeredCount, setAnsweredCount] = useState(0)
  const [correctCount, setCorrectCount] = useState(0)
  const [finished, setFinished] = useState(false)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [newRecord, setNewRecord] = useState<{ score: boolean; time: boolean } | null>(null)

  // Tire la toute première question dès que le pool est prêt et suffisant —
  // les questions suivantes sont tirées par nextQuestion(), pas ce hook.
  useEffect(() => {
    if (masteredReady && pool.length >= 2 && !question) {
      setQuestion(buildOneQuestion(pool))
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [masteredReady, pool.length])

  // Chrono affiché en haut du test — démarre dès la première question et
  // s'arrête à "Terminer le test" (voir endTest), pas de pause possible.
  const hasStarted = question !== null
  useEffect(() => {
    if (!hasStarted || finished) return
    const interval = setInterval(() => setElapsedSeconds((s) => s + 1), 1000)
    return () => clearInterval(interval)
  }, [hasStarted, finished])

  function selectOption(opt: string) {
    if (!question || phase === 'answered') return
    // Compte pour le streak dès la première réponse — sans ça, un profil
    // qui ne fait QUE le test illimité (jamais de séance Kanjis/Vocab/
    // Grammaire, seul chemin qui l'enregistrait jusqu'ici) voyait son
    // streak rester bloqué à 0 malgré une vraie pratique du jour.
    if (answeredCount === 0 && profileId) recordActivityToday(profileId)
    const correctOption = question.direction === 'jp-to-fr' ? question.item.meanings[0] : question.item.prompt
    const correct = opt === correctOption
    setSelectedOption(opt)
    setIsCorrect(correct)
    setAnsweredCount((c) => c + 1)
    if (correct) setCorrectCount((c) => c + 1)
    setPhase('answered')
  }

  function nextQuestion() {
    setQuestion(buildOneQuestion(pool))
    setPhase('answering')
    setSelectedOption(null)
  }

  async function endTest() {
    setFinished(true)
    if (profileId) {
      const result = await recordTestResult(profileId, correctCount, elapsedSeconds)
      setNewRecord({ score: result.newScoreRecord, time: result.newTimeRecord })
    }
  }

  if (masteredReady && pool.length < 2) {
    return (
      <PageTransition>
        <div className="test-screen">
          <ModuleEndCard
            icon={Info}
            title="Pas assez de cartes maîtrisées"
            description="Avec ce niveau et ces modules, il n'y a pas assez de cartes marquées Maîtrisé pour lancer un test (il en faut au moins 2)."
            buttonLabel="Retour au dashboard"
            onContinue={() => navigate('/dashboard')}
          />
        </div>
      </PageTransition>
    )
  }

  if (finished) {
    const percent = answeredCount > 0 ? Math.round((correctCount / answeredCount) * 100) : 0
    const finalBestScore = Math.max(record.bestScore, correctCount)
    const finalBestTime = Math.max(record.bestTimeSeconds, elapsedSeconds)
    return (
      <PageTransition>
        <div className="test-screen">
          <ModuleEndCard
            icon={Trophy}
            title={`Test terminé : ${correctCount}/${answeredCount} bonnes réponses`}
            description={
              answeredCount === 0
                ? "Aucune question répondue avant d'arrêter."
                : percent >= 80
                  ? 'Très solide — continue comme ça.'
                  : percent >= 50
                    ? 'Pas mal, quelques révisions ne feraient pas de mal.'
                    : 'Ces notions méritent une nouvelle séance de révision bientôt.'
            }
            buttonLabel="Retour au dashboard"
            onContinue={() => navigate('/dashboard')}
          >
            <div className="test-mastery__recap-stats">
              <span>Temps tenu : {formatTime(elapsedSeconds)}</span>
              <span>
                Record : {finalBestScore} bonnes réponses · {formatTime(finalBestTime)}
              </span>
            </div>
            {(newRecord?.score || newRecord?.time) && <p className="test-mastery__new-record">Nouveau record !</p>}
          </ModuleEndCard>
        </div>
      </PageTransition>
    )
  }

  if (!question) return null

  const promptText = question.direction === 'jp-to-fr' ? question.item.prompt : question.item.meanings[0]
  const promptHint = question.direction === 'jp-to-fr' ? 'Quelle est la traduction ?' : 'Quel est ce mot en japonais ?'
  const correctOptionForQcm = question.direction === 'jp-to-fr' ? question.item.meanings[0] : question.item.prompt

  return (
    <PageTransition>
      <div className="test-screen">
        <header className="test-screen__header test-mastery__header">
          <button className="btn-link" onClick={endTest}>
            <Square size={16} strokeWidth={1.75} />
            Terminer le test
          </button>
          <span className="test-mastery__timer">{formatTime(elapsedSeconds)}</span>
          <span className="test-mastery__score">
            {correctCount} / {answeredCount} correctes
          </span>
        </header>

        {(record.bestScore > 0 || record.bestTimeSeconds > 0) && (
          <p className="test-mastery__record-hint">
            Record à battre : {record.bestScore} bonnes réponses · {formatTime(record.bestTimeSeconds)}
          </p>
        )}

        <div className="test-card card">
          <p className="test-card__hint">{promptHint}</p>
          <span className={question.direction === 'jp-to-fr' ? 'test-card__prompt-jp' : 'test-card__prompt-fr'}>
            {promptText}
          </span>

          {phase === 'answering' && question.options && (
            <div className="test-qcm">
              {question.options.map((opt, i) => (
                <button key={i} type="button" className="qcm-option" onClick={() => selectOption(opt)}>
                  {opt}
                </button>
              ))}
            </div>
          )}

          {phase === 'answered' && question.options && (
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
                {isCorrect ? 'Correct !' : 'Pas tout à fait.'}
              </p>
              <p className="test-feedback__answer">
                Réponse : <strong>{question.correctAnswer}</strong>
              </p>
              <button className="btn-primary test-feedback__next" onClick={nextQuestion}>
                Question suivante
                <Check size={17} strokeWidth={2} />
              </button>
            </motion.div>
          )}
        </div>
      </div>
    </PageTransition>
  )
}
