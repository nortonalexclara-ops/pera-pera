import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Check, CloudDownload } from 'lucide-react'
import { avatarGradients } from './mockProfiles'
import { useProfileStore } from './profileStore'
import { listProfiles, createProfile } from '../../db/profiles'
import { importProfileData } from '../../db/profileSync'
import { setHasCloudBackup } from '../../db/settings'
import { restoreProfile } from './cloudSync'
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

  const [restoring, setRestoring] = useState(false)
  const [restoreName, setRestoreName] = useState('')
  const [restorePin, setRestorePin] = useState('')
  const [restoreBusy, setRestoreBusy] = useState(false)
  const [restoreError, setRestoreError] = useState<string | null>(null)

  // Bug WebKit connu (Safari iPadOS/iOS) : après une restauration bfcache
  // (voir main.tsx), la connexion IndexedDB peut rester "coincée" — toute
  // NOUVELLE transaction dessus ne résout ni ne rejette jamais, elle reste
  // juste bloquée indéfiniment. `listProfiles()` (donc `.then`/`.finally`)
  // ne s'exécute alors jamais, `loaded` ne passe jamais à `true`, et
  // l'écran reste bloqué sur "Qui apprend aujourd'hui ?" sans rien
  // d'autre (signalé par l'utilisatrice sur iPad) — pas d'erreur visible
  // puisque la promesse ne se règle jamais, juste un silence permanent.
  // Filet de sécurité : si `listProfiles()` n'a pas répondu au bout de 4s,
  // on considère la connexion figée et on force un vrai rechargement
  // complet (nouvelle connexion IndexedDB saine), plutôt que de laisser
  // l'app inutilisable sans qu'aucune action de l'utilisatrice ne puisse
  // la débloquer.
  useEffect(() => {
    let cancelled = false
    const watchdog = setTimeout(() => {
      if (!cancelled) window.location.reload()
    }, 4000)

    listProfiles()
      .then((result) => {
        if (cancelled) return
        clearTimeout(watchdog)
        setProfiles(result)
        setLoaded(true)
      })
      .catch(() => {
        if (cancelled) return
        clearTimeout(watchdog)
        setLoaded(true)
      })

    return () => {
      cancelled = true
      clearTimeout(watchdog)
    }
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

  // Récupère un profil sauvegardé depuis un autre appareil (voir Réglages
  // "Retrouver mon profil sur un autre appareil") — crée un nouveau profil
  // local (id forcément différent de l'appareil d'origine) puis y importe
  // la progression reçue du cloud.
  async function handleRestore() {
    setRestoreError(null)
    if (!restoreName.trim() || !/^\d{4}$/.test(restorePin)) return
    setRestoreBusy(true)
    try {
      const result = await restoreProfile(restoreName, restorePin)
      const record = await createProfile(result.displayName)
      await importProfileData(record.id, result.payload)
      // On vient de prouver qu'une sauvegarde en ligne existe pour ce
      // profil (on est en train de la récupérer) — pas la peine de
      // réafficher la bannière/le formulaire "crée un code" juste après.
      await setHasCloudBackup(record.id, true)
      setProfiles((prev) => [...prev, record])
      setRestoring(false)
      setRestoreName('')
      setRestorePin('')
      handleSelect(record.id, record.name, record.colorIndex)
    } catch (err) {
      setRestoreError(err instanceof Error ? err.message : 'Impossible de récupérer ce profil.')
    } finally {
      setRestoreBusy(false)
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

            {restoring ? (
              <motion.div className="profile-card profile-card--form profile-card--restore card" variants={cardVariants}>
                <input
                  type="text"
                  className="profile-card__input"
                  placeholder="Nom du profil"
                  value={restoreName}
                  autoFocus
                  maxLength={20}
                  onChange={(e) => setRestoreName(e.target.value)}
                />
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={4}
                  className="profile-card__input"
                  placeholder="Code à 4 chiffres"
                  value={restorePin}
                  onChange={(e) => setRestorePin(e.target.value.replace(/\D/g, '').slice(0, 4))}
                  onKeyDown={(e) => e.key === 'Enter' && handleRestore()}
                />
                <button
                  type="button"
                  className="profile-card__confirm"
                  onClick={handleRestore}
                  disabled={restoreBusy}
                  title="Récupérer ce profil"
                >
                  <Check size={16} strokeWidth={2} />
                </button>
              </motion.div>
            ) : (
              <motion.button
                className="profile-card profile-card--new card"
                variants={cardVariants}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setRestoring(true)}
              >
                <span className="profile-card__avatar">
                  <CloudDownload size={24} strokeWidth={1.75} />
                </span>
                <span className="profile-card__name">Récupérer un profil</span>
              </motion.button>
            )}
          </motion.div>
        )}

        {error && <p className="profile-selector__error">{error}</p>}
        {restoreError && <p className="profile-selector__error">{restoreError}</p>}
      </div>
    </PageTransition>
  )
}
