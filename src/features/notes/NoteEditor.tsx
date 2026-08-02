import { useEffect, useRef, useState } from 'react'
import type { ChangeEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Trash2 } from 'lucide-react'
import { getNote, updateNote, deleteNote } from '../../db/notes'
import type { NoteRecord } from '../../db/db'
import PageTransition from '../../components/ui/PageTransition'
import NoteCanvas from './NoteCanvas'
import '../kanji/SessionCard.css'
import './Notes.css'

// Sauvegarde du texte tapé après une pause dans la frappe plutôt qu'à
// chaque caractère — évite une écriture Dexie par lettre tapée tout en
// restant imperceptible (personne ne tape assez vite pour remarquer 400ms).
const TEXT_SAVE_DELAY = 400

export default function NoteEditor() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [note, setNote] = useState<NoteRecord | null | undefined>(undefined)
  const [title, setTitle] = useState('')
  const [text, setText] = useState('')
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    if (!id) return
    getNote(id).then((found) => {
      setNote(found ?? null)
      setTitle(found?.title ?? '')
      setText(found?.text ?? '')
    })
    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current)
    }
  }, [id])

  function handleTitleChange(e: ChangeEvent<HTMLInputElement>) {
    const value = e.target.value
    setTitle(value)
    if (!id) return
    updateNote(id, { title: value })
  }

  function handleTextChange(e: ChangeEvent<HTMLTextAreaElement>) {
    const value = e.target.value
    setText(value)
    if (!id) return
    if (saveTimeout.current) clearTimeout(saveTimeout.current)
    saveTimeout.current = setTimeout(() => updateNote(id, { text: value }), TEXT_SAVE_DELAY)
  }

  function handleDrawingChange(dataUrl: string) {
    if (!id) return
    updateNote(id, { drawingDataUrl: dataUrl })
  }

  async function handleDelete() {
    if (!id) return
    if (!window.confirm('Supprimer cette note ? Ça ne peut pas être annulé.')) return
    await deleteNote(id)
    navigate('/notes')
  }

  if (note === undefined) return null

  if (note === null) {
    return (
      <PageTransition>
        <div className="note-editor">
          <p className="note-editor__missing">Cette note n'existe plus.</p>
          <button className="btn-link" onClick={() => navigate('/notes')}>
            <ArrowLeft size={16} strokeWidth={2} />
            Retour aux notes
          </button>
        </div>
      </PageTransition>
    )
  }

  return (
    <PageTransition>
      <div className="note-editor">
        <div className="note-editor__header">
          <button className="btn-link" onClick={() => navigate('/notes')}>
            <ArrowLeft size={16} strokeWidth={2} />
            Notes
          </button>
          <button className="note-editor__delete" onClick={handleDelete} title="Supprimer la note">
            <Trash2 size={16} strokeWidth={1.75} />
          </button>
        </div>

        <input
          type="text"
          className="note-editor__title"
          value={title}
          onChange={handleTitleChange}
          placeholder="Titre de la note"
          maxLength={60}
        />

        <textarea
          className="note-editor__text"
          value={text}
          onChange={handleTextChange}
          placeholder="Écris ici..."
        />

        <p className="note-editor__canvas-label">Ou à la main :</p>
        <NoteCanvas key={note.id} initialImage={note.drawingDataUrl} onChange={handleDrawingChange} />
      </div>
    </PageTransition>
  )
}
