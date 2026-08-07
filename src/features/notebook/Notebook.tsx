import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { ScanSearch } from 'lucide-react'
import PageTransition from '../../components/ui/PageTransition'
import WritingCanvas from '../kanji/WritingCanvas'
import { recognizeKanji, type RecognitionMatch } from '../kanji/kanjiRecognize'
import { mockKanjiList } from '../kanji/mockKanji'
// Réutilise WritingCanvas (moteur de dessin Pointer Events déjà construit
// pour les cartes de séance) plutôt que de dupliquer la logique de tracé —
// même motif de reuse que ModuleEndCard/Explorer, voir PROJECT_STATE.md.
import '../kanji/SessionCard.css'
import './Notebook.css'

type Point = { x: number; y: number }

const MIN_POINTS_TO_RECOGNIZE = 2

/**
 * Remplace l'ancien "Cahier" (dessin libre sans but) : on dessine toujours
 * librement, mais un bouton "Reconnaître" compare le tracé à tous les
 * kanjis connus (voir kanjiRecognize.ts) et propose les candidats les plus
 * proches — comme sur Renshuu/SLJFAQ. Reste une heuristique de forme, pas
 * un modèle entraîné : elle peut se tromper sur des tracés ambigus.
 */
export default function Notebook() {
  const navigate = useNavigate()
  const [strokes, setStrokes] = useState<Point[][]>([])
  const [results, setResults] = useState<RecognitionMatch[] | null>(null)
  const [recognizing, setRecognizing] = useState(false)

  function handleStrokesChange(next: Point[][]) {
    setStrokes(next)
    setResults(null)
  }

  function handleRecognize() {
    setRecognizing(true)
    // Laisse le bouton se re-rendre en "Reconnaissance…" avant le calcul
    // synchrone (peut prendre jusqu'à ~1s la première fois, le temps de
    // construire le cache de traits de référence pour tous les kanjis).
    // setTimeout plutôt que requestAnimationFrame : ce n'est pas une
    // animation, et rAF ne se déclenche pas tant que l'onglet n'est pas
    // visuellement actif/composité (peut ne jamais se déclencher en
    // arrière-plan).
    setTimeout(() => {
      setResults(recognizeKanji(strokes, mockKanjiList, 5))
      setRecognizing(false)
    }, 0)
  }

  const canRecognize = strokes.reduce((n, s) => n + s.length, 0) >= MIN_POINTS_TO_RECOGNIZE

  return (
    <PageTransition>
      <div className="notebook">
        <h1 className="notebook__title">Reconnaissance de kanji</h1>
        <p className="notebook__subtitle">Dessine un kanji, puis appuie sur "Reconnaître" pour voir les candidats les plus proches.</p>
        <div className="notebook__canvas-wrap">
          <WritingCanvas
            strokeKey="recognize"
            title=""
            grid
            onStrokesChange={handleStrokesChange}
            extraTools={
              <button
                type="button"
                className="notebook__recognize-btn"
                disabled={!canRecognize || recognizing}
                onClick={handleRecognize}
                title="Reconnaître le kanji"
              >
                <ScanSearch size={17} strokeWidth={1.75} />
                {recognizing ? 'Reconnaissance…' : 'Reconnaître le kanji'}
              </button>
            }
          />
        </div>

        {results && results.length > 0 && (
          <ul className="notebook__results">
            {results.map((match) => {
              const kanji = mockKanjiList.find((k) => k.id === match.id)
              if (!kanji) return null
              return (
                <li key={match.id}>
                  <button
                    type="button"
                    className="notebook__result"
                    onClick={() => navigate('/explorer', { state: { query: kanji.character } })}
                  >
                    <span className="notebook__result-char">{kanji.character}</span>
                    <span className="notebook__result-meaning">{kanji.meanings[0]}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        )}
      </div>
    </PageTransition>
  )
}
