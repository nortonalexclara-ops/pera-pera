import PageTransition from '../../components/ui/PageTransition'
import WritingCanvas from '../kanji/WritingCanvas'
// Réutilise WritingCanvas (moteur de dessin Pointer Events déjà construit
// pour les cartes de séance) plutôt que de dupliquer la logique de tracé —
// même motif de reuse que ModuleEndCard/Explorer, voir PROJECT_STATE.md.
import '../kanji/SessionCard.css'
import './Notebook.css'

export default function Notebook() {
  return (
    <PageTransition>
      <div className="notebook">
        <h1 className="notebook__title">Cahier</h1>
        <p className="notebook__subtitle">
          Écris librement, sans score ni minuteur — comme un vrai cahier japonais.
        </p>
        <div className="notebook__canvas-wrap">
          <WritingCanvas strokeKey="cahier" title="" grid />
        </div>
      </div>
    </PageTransition>
  )
}
