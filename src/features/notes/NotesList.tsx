import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, StickyNote, Bookmark, X } from 'lucide-react'
import { useProfileStore } from '../profile/profileStore'
import { listNotes, createNote } from '../../db/notes'
import { listSavedWords, toggleSavedWord } from '../../db/savedWords'
import { mockVocabList } from '../vocab/mockVocab'
import type { NoteRecord, SavedWordRecord } from '../../db/db'
import PageTransition from '../../components/ui/PageTransition'
import './Notes.css'

const vocabWords = new Set(mockVocabList.map((w) => w.word))

// Beaucoup de mots exemples (choisis pour illustrer un kanji) n'ont pas de
// fiche à eux dans le catalogue de vocabulaire — chercher leur texte exact
// dans Explorer renverrait "0 résultat". Le kanji dont ils viennent, lui,
// existe toujours : on l'utilise comme repli pour que le clic mène
// toujours quelque part de pertinent (voir SavedWordRecord.kanjiChar).
function explorerQueryFor(word: SavedWordRecord): string {
  return vocabWords.has(word.word) ? word.word : word.kanjiChar
}

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
  // Mots exemples sauvegardés en séance ("j'aime ce mot, je veux le
  // revoir" — voir la liste "Mots" de KanjiCardLoop.tsx) : liste séparée
  // des notes libres, rechargée après chaque ajout/retrait plutôt que via
  // useLiveQuery (pas besoin de réactivité en direct sur cet écran).
  const [savedWords, setSavedWords] = useState<SavedWordRecord[]>([])

  useEffect(() => {
    if (!profileId) {
      setNotes([])
      setSavedWords([])
      setLoaded(true)
      return
    }
    Promise.all([listNotes(profileId), listSavedWords(profileId)])
      .then(([n, w]) => {
        setNotes(n)
        setSavedWords(w)
      })
      .finally(() => setLoaded(true))
  }, [profileId])

  async function handleCreate() {
    if (!profileId) return
    const note = await createNote(profileId)
    navigate(`/notes/${note.id}`)
  }

  async function handleRemoveSavedWord(word: SavedWordRecord) {
    if (!profileId) return
    await toggleSavedWord(profileId, word.word, word.reading, word.meaning, word.kanjiChar)
    setSavedWords((words) => words.filter((w) => w.id !== word.id))
  }

  return (
    <PageTransition>
      <div className="notes-list">
        <h1 className="notes-list__title">Notes</h1>
        <p className="notes-list__subtitle">
          Une expression entendue, un mot à retenir, un kanji vu quelque part — pas de score, pas de
          révision, juste pour toi.
        </p>

        {loaded && savedWords.length > 0 && (
          <div className="saved-words card">
            <p className="saved-words__title">
              <Bookmark size={16} strokeWidth={1.75} />
              Mots enregistrés
            </p>
            <ul className="saved-words__list">
              {savedWords.map((word) => (
                <li key={word.id} className="saved-words__item">
                  <button
                    type="button"
                    className="saved-words__word"
                    onClick={() => navigate('/explorer', { state: { query: explorerQueryFor(word) } })}
                  >
                    {word.word}
                    <span className="saved-words__meaning">{word.meaning}</span>
                  </button>
                  <button
                    type="button"
                    className="saved-words__remove"
                    onClick={() => handleRemoveSavedWord(word)}
                    title="Retirer de la liste"
                  >
                    <X size={14} strokeWidth={2} />
                  </button>
                </li>
              ))}
            </ul>
          </div>
        )}

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
