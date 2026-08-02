import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Check } from 'lucide-react'
import { avatarGradients } from './mockProfiles'
import { useProfileStore } from './profileStore'
import { listProfiles, createProfile } from '../../db/profiles'
import type { ProfileRecord } from '../../db/db'
import AmbientGlow from '../../components/ui/AmbientGlow'
import PageTransition from '../../components/ui/PageTransition'
import './ProfileSelector.css'

const gridVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07 } },
}

const cardVariants = {
  hidden: { opacity: 0, y: 14 },
  visible: { opacity: 1, y: 0 },
}

export default function ProfileSelector() {
  const navigate = useNavigate()
  const setActiveProfile = useProfileStore((s) => s.setActiveProfile)

  const [profiles, setProfiles] = useState<ProfileRecord[]>([])
  const [loaded, setLoaded] = useState(false)
  const [creating, setCreating] = useState(false)
  const [newName, setNewName] = useState('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    listProfiles()
      .then(setProfiles)
      .finally(() => setLoaded(true))
  }, [])

  function handleSelect(id: string, name: string, colorIndex: number) {
    setActiveProfile(id, name, colorIndex)
    navigate('/dashboard')
  }

  async function handleCreate() {
    try {
      const record = await createProfile(newName)
      setProfiles((prev) => [...prev, record])
      setCreating(false)
      setNewName('')
      setError(null)
      handleSelect(record.id, record.name, record.colorIndex)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Impossible de créer ce profil.')
    }
  }

  return (
    <PageTransition>
      <div className="profile-selector">
        <AmbientGlow top={-80} left="calc(50% - 210px)" size={420} />

        <div className="profile-selector__header">
          <h1 className="profile-selector__title">Qui apprend aujourd'hui ?</h1>
          <p className="profile-selector__subtitle">Chaque profil garde sa propre progression.</p>
        </div>

        {loaded && (
          <motion.div className="profile-grid" variants={gridVariants} initial="hidden" animate="visible">
            {profiles.map((profile) => {
              const [from, to] = avatarGradients[profile.colorIndex % avatarGradients.length]
              return (
                <motion.button
                  key={profile.id}
                  className="profile-card card"
                  variants={cardVariants}
                  whileHover={{ y: -3 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => handleSelect(profile.id, profile.name, profile.colorIndex)}
                >
                  <span
                    className="profile-card__avatar"
                    style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
                  >
                    {profile.name.charAt(0).toUpperCase()}
                  </span>
                  <span className="profile-card__name">{profile.name}</span>
                </motion.button>
              )
            })}

            {creating ? (
              <motion.div className="profile-card profile-card--form card" variants={cardVariants}>
                <input
                  type="text"
                  className="profile-card__input"
                  placeholder="Prénom"
                  value={newName}
                  autoFocus
                  maxLength={20}
                  onChange={(e) => setNewName(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
                />
                <button type="button" className="profile-card__confirm" onClick={handleCreate} title="Créer ce profil">
                  <Check size={16} strokeWidth={2} />
                </button>
              </motion.div>
            ) : (
              <motion.button
                className="profile-card profile-card--new card"
                variants={cardVariants}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setCreating(true)}
              >
                <span className="profile-card__avatar">
                  <Plus size={26} strokeWidth={1.75} />
                </span>
                <span className="profile-card__name">Nouveau profil</span>
              </motion.button>
            )}
          </motion.div>
        )}

        {error && <p className="profile-selector__error">{error}</p>}
      </div>
    </PageTransition>
  )
}
