import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Plus, Check, RefreshCw, Mail } from 'lucide-react'
import { avatarGradients } from './mockProfiles'
import { useProfileStore } from './profileStore'
import { listProfiles, createProfile } from '../../db/profiles'
import { markPinOnboardingPending } from './pinOnboarding'
import { replaceProfileData } from '../../db/profileSync'
import { setHasCloudBackup } from '../../db/settings'
import { enableCloudSync } from '../../db/cloudSyncState'
import { restoreProfile } from './cloudSync'
import { syncNow } from './cloudSyncEngine'
import { sendMagicLink, setPendingEmailSignup } from './emailAuth'
import { isStandalonePwa } from '../../utils/pwa'
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

  // Recours discret pour les profils qui utilisaient encore l'ancien
  // système nom+code (avant la connexion par email) et n'ont jamais migré
  // — retiré une première fois comme carte au même niveau que les autres
  // (source de confusion : deux façons de "récupérer" affichées à égalité,
  // voir Settings.tsx), remis en lien discret plutôt que supprimé pour de
  // bon : sans ça, ces profils n'auraient plus AUCUN moyen de retrouver
  // leurs données sur un nouvel appareil.
  const [restoring, setRestoring] = useState(false)
  const [restoreName, setRestoreName] = useState('')
  const [restorePin, setRestorePin] = useState('')
  const [restoreBusy, setRestoreBusy] = useState(false)
  const [restoreError, setRestoreError] = useState<string | null>(null)

  const [emailSigningUp, setEmailSigningUp] = useState(false)
  const [signupName, setSignupName] = useState('')
  const [signupEmail, setSignupEmail] = useState('')
  const [signupBusy, setSignupBusy] = useState(false)
  const [signupLinkSent, setSignupLinkSent] = useState(false)
  const [signupError, setSignupError] = useState<string | null>(null)
  const isValidSignupEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signupEmail)
  // Vrai si le filet de sécurité ci-dessous s'est déclenché en mode
  // autonome (voir isStandalonePwa) — affiche un bouton de rechargement
  // manuel plutôt qu'un rechargement automatique.
  const [stuckLoading, setStuckLoading] = useState(false)

  // Bug WebKit connu (Safari iPadOS/iOS) : après une restauration bfcache
  // (voir main.tsx), la connexion IndexedDB peut rester "coincée" — toute
  // NOUVELLE transaction dessus ne résout ni ne rejette jamais, elle reste
  // juste bloquée indéfiniment. `listProfiles()` (donc `.then`/`.finally`)
  // ne s'exécute alors jamais, `loaded` ne passe jamais à `true`, et
  // l'écran reste bloqué sur "Qui apprend aujourd'hui ?" sans rien
  // d'autre (signalé par l'utilisatrice sur iPad) — pas d'erreur visible
  // puisque la promesse ne se règle jamais, juste un silence permanent.
  // Filet de sécurité : si `listProfiles()` n'a pas répondu au bout de 4s,
  // on considère la connexion figée. En mode autonome (écran d'accueil),
  // pas de rechargement automatique — `location.reload()` y ferait perdre
  // le mode plein écran (second bug signalé, voir isStandalonePwa) —
  // juste un bouton pour recharger manuellement si l'utilisatrice le
  // choisit. Dans un onglet de navigateur normal, le rechargement
  // automatique reste inoffensif et évite de laisser l'app bloquée sans
  // action possible.
  useEffect(() => {
    let cancelled = false
    const watchdog = setTimeout(() => {
      if (cancelled) return
      if (isStandalonePwa()) {
        setStuckLoading(true)
      } else {
        window.location.reload()
      }
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

  // "Nouveau profil"/"Se connecter par email" créent toujours un
  // enregistrement séparé, même si un profil du même nom existe déjà sur
  // cet appareil (les profils sont distingués par id, pas par nom) —
  // repéré après coup par l'utilisatrice ("il y a deux profils Kurara
  // différents"), qui avait sans le savoir créé le même profil deux fois
  // sous le même nom, avec la confusion "lequel a mes vraies données ?"
  // qui va avec. Prévenu ici plutôt que bloqué : averti mais toujours
  // libre de continuer (deux personnes du même foyer peuvent légitimement
  // partager un prénom).
  function isDuplicateName(name: string): boolean {
    const trimmed = name.trim().toLowerCase()
    return trimmed !== '' && profiles.some((p) => p.name.trim().toLowerCase() === trimmed)
  }

  async function handleCreate() {
    try {
      const record = await createProfile(newName)
      // Déclenche la fenêtre "protège ta progression" (voir
      // PinOnboardingModal.tsx) au prochain passage sur le Dashboard —
      // seulement pour un TOUT NOUVEAU profil, jamais après une connexion
      // par email (voir useEmailAuthLink.ts, qui lie déjà un compte).
      markPinOnboardingPending(record.id)
      setProfiles((prev) => [...prev, record])
      setCreating(false)
      setNewName('')
      setError(null)
      handleSelect(record.id, record.name, record.colorIndex)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Impossible de créer ce profil.')
    }
  }

  // Récupère un profil sauvegardé sous l'ancien système nom+code (voir
  // cloudSync.ts) — crée un nouveau profil local puis y importe la
  // progression reçue du serveur.
  async function handleRestore() {
    setRestoreError(null)
    if (!restoreName.trim() || !/^\d{4}$/.test(restorePin)) return
    setRestoreBusy(true)
    try {
      const result = await restoreProfile(restoreName, restorePin)
      const record = await createProfile(result.displayName)
      await replaceProfileData(record.id, result.payload)
      await setHasCloudBackup(record.id, true)
      await enableCloudSync(record.id, restorePin)
      setProfiles((prev) => [...prev, record])
      syncNow(record.id, record.name)
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

  // Connexion/récupération par email directement depuis cet écran, sans
  // devoir d'abord créer un profil "vide" puis aller dans Réglages (gap
  // signalé par l'utilisatrice) — le profil local n'est créé qu'une fois
  // le lien magique cliqué avec succès (voir useEmailAuthLink.ts), pas
  // ici : à cet instant, on ne sait pas encore si ce compte a déjà une
  // sauvegarde à récupérer ou s'il faut en créer un tout neuf.
  async function handleSendSignupLink() {
    setSignupError(null)
    if (!signupName.trim() || !isValidSignupEmail) return
    setSignupBusy(true)
    try {
      setPendingEmailSignup(signupName.trim())
      await sendMagicLink(signupEmail)
      setSignupLinkSent(true)
    } catch (err) {
      setSignupError(err instanceof Error ? err.message : "Échec de l'envoi du lien.")
    } finally {
      setSignupBusy(false)
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

        {!loaded && stuckLoading && (
          <motion.div
            className="profile-selector__stuck card"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <p>Le chargement prend plus de temps que prévu.</p>
            <button
              type="button"
              className="profile-selector__reload"
              onClick={() => window.location.reload()}
            >
              <RefreshCw size={16} strokeWidth={2} />
              Recharger
            </button>
          </motion.div>
        )}

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
                {isDuplicateName(newName) && (
                  <p className="profile-card__warning">
                    Ce nom est déjà utilisé par un profil actif sur cet appareil (pas supprimé) — celui-ci sera séparé.
                  </p>
                )}
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

            {emailSigningUp ? (
              <motion.div className="profile-card profile-card--form profile-card--restore card" variants={cardVariants}>
                {signupLinkSent ? (
                  <p className="profile-card__warning">
                    Lien envoyé à {signupEmail} — ouvre ta boîte mail sur cet appareil et clique dessus.
                  </p>
                ) : (
                  <>
                    <input
                      type="text"
                      className="profile-card__input"
                      placeholder="Prénom"
                      value={signupName}
                      autoFocus
                      maxLength={20}
                      onChange={(e) => setSignupName(e.target.value)}
                    />
                    {isDuplicateName(signupName) && (
                      <p className="profile-card__warning">
                        Ce nom est déjà utilisé par un profil actif sur cet appareil (pas supprimé) — celui-ci sera
                        séparé.
                      </p>
                    )}
                    <input
                      type="email"
                      className="profile-card__input"
                      placeholder="ton@email.com"
                      value={signupEmail}
                      onChange={(e) => setSignupEmail(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && handleSendSignupLink()}
                    />
                    <button
                      type="button"
                      className="profile-card__confirm"
                      onClick={handleSendSignupLink}
                      disabled={signupBusy || !signupName.trim() || !isValidSignupEmail}
                      title="Envoyer le lien"
                    >
                      <Mail size={16} strokeWidth={2} />
                    </button>
                  </>
                )}
              </motion.div>
            ) : (
              <motion.button
                className="profile-card profile-card--new card"
                variants={cardVariants}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setEmailSigningUp(true)}
              >
                <span className="profile-card__avatar">
                  <Mail size={22} strokeWidth={1.75} />
                </span>
                <span className="profile-card__name">Se connecter par email</span>
              </motion.button>
            )}
          </motion.div>
        )}

        {loaded && !restoring && (
          <button type="button" className="profile-selector__legacy-link" onClick={() => setRestoring(true)}>
            J'ai un ancien code de récupération
          </button>
        )}

        {restoring && (
          <motion.div
            className="profile-selector__legacy-form card"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
          >
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
            <div className="profile-selector__legacy-form-actions">
              <button
                type="button"
                className="btn-link"
                onClick={() => {
                  setRestoring(false)
                  setRestoreName('')
                  setRestorePin('')
                  setRestoreError(null)
                }}
                disabled={restoreBusy}
              >
                Annuler
              </button>
              <button
                type="button"
                className="btn-primary"
                onClick={handleRestore}
                disabled={restoreBusy || !restoreName.trim() || !/^\d{4}$/.test(restorePin)}
              >
                {restoreBusy ? 'Récupération…' : 'Récupérer'}
              </button>
            </div>
            {restoreError && <p className="profile-selector__error">{restoreError}</p>}
          </motion.div>
        )}

        {error && <p className="profile-selector__error">{error}</p>}
        {signupError && <p className="profile-selector__error">{signupError}</p>}
      </div>
    </PageTransition>
  )
}
