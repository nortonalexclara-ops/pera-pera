import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, StickyNote } from 'lucide-react'
import { useProfileStore } from '../profile/profileStore'
import { listNotes, createNote } from '../../db/notes'
import type { NoteRecord } from '../../db/db'
import PageTransition from '../../components/ui/PageTransition'
import './Notes.css'

const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.05 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
}

function formatDate(ts: number): string {
  return new Date(ts).toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
}

export default function NotesList() {
  const navigate = useNavigate()
  const profileId = useProfileStore((s) => s.activeProfileId)
  const [notes, setNotes] = useState<NoteRecord[]>([])
  const [loaded, setLoaded] = useState(false)

  useEffect(() => {
    if (!profileId) {
      setNotes([])
      setLoaded(true)
      return
    }
    listNotes(profileId)
      .then(setNotes)
      .finally(() => setLoaded(true))
  }, [profileId])

  async function handleCreate() {
    if (!profileId) return
    const note = await createNote(profileId)
    navigate(`/notes/${note.id}`)
  }

  return (
    <PageTransition>
      <div className="notes-list">
        <h1 className="notes-list__title">Notes</h1>
        <p className="notes-list__subtitle">
          Une expression entendue, un mot à retenir, un kanji vu quelque part — pas de score, pas de
          révision, juste pour toi.
        </p>

        {loaded && (
          <motion.div className="notes-list__grid" variants={gridVariants} initial="hidden" animate="visible">
            {notes.map((note) => (
              <motion.button
                key={note.id}
                className="note-card card"
                variants={cardVariants}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate(`/notes/${note.id}`)}
              >
                <StickyNote size={18} strokeWidth={1.75} className="note-card__icon" />
                <span className="note-card__title">{note.title || 'Sans titre'}</span>
                <span className="note-card__date">{formatDate(note.updatedAt)}</span>
                {note.text && <span className="note-card__preview">{note.text}</span>}
              </motion.button>
            ))}

            <motion.button
              className="note-card note-card--new card"
              variants={cardVariants}
              whileHover={{ y: -3 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleCreate}
            >
              <Plus size={22} strokeWidth={1.75} />
              <span className="note-card__title">Nouvelle note</span>
            </motion.button>
          </motion.div>
        )}
      </div>
    </PageTransition>
  )
}
