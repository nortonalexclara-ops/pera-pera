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
import {
  signInWithPassword,
  signUpWithPassword,
  sendPasswordResetEmail,
  setPendingEmailSignup,
  consumePendingEmailSignup,
} from './emailAuth'
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

  // Connexion par email — mot de passe (comme sur Okane, demande explicite
  // de l'utilisatrice) plutôt qu'un lien magique : plus rapide sur un
  // nouvel appareil (pas besoin d'aller vérifier sa boîte mail à chaque
  // connexion), seule la CRÉATION de compte garde une étape par email
  // (confirmation, voir emailAuth.ts) quand Supabase l'exige.
  const [emailOpen, setEmailOpen] = useState(false)
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')
  const [authName, setAuthName] = useState('')
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authBusy, setAuthBusy] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [confirmSent, setConfirmSent] = useState(false)
  const [forgotSent, setForgotSent] = useState(false)
  const isValidAuthEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(authEmail)
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

  // Connexion à un compte email EXISTANT directement depuis cet écran, sans
  // devoir d'abord créer un profil "vide" puis aller dans Réglages (gap
  // signalé par l'utilisatrice). Synchrone : contrairement à une création
  // de compte (qui peut exiger une confirmation par email), se connecter à
  // un compte déjà confirmé établit la session tout de suite — le marqueur
  // "en attente" posé juste avant sert quand même de filet (voir
  // useEmailAuthLink.ts) au cas où l'événement de connexion Supabase
  // arrive avant que ce `await` ne se résolve ici.
  async function handleLogin() {
    setAuthError(null)
    if (!isValidAuthEmail || !authPassword) return
    setAuthBusy(true)
    try {
      // Nom de repli SEULEMENT si ce compte n'a encore aucune sauvegarde
      // (cas rare pour une connexion) — sinon le vrai nom déjà enregistré
      // est utilisé à la place (voir completeEmailAuth.ts).
      setPendingEmailSignup(authEmail.split('@')[0])
      await signInWithPassword(authEmail, authPassword)
    } catch (err) {
      consumePendingEmailSignup()
      setAuthError(err instanceof Error ? err.message : 'Échec de la connexion.')
    } finally {
      setAuthBusy(false)
    }
  }

  // Création d'un tout nouveau compte — le profil local n'est créé qu'une
  // fois la connexion effectivement établie (voir useEmailAuthLink.ts),
  // pas ici : si Supabase exige une confirmation par email, rien n'est
  // encore vrai à cet instant, juste une demande en attente.
  async function handleSignup() {
    setAuthError(null)
    if (!authName.trim() || !isValidAuthEmail || authPassword.length < 6) return
    setAuthBusy(true)
    try {
      setPendingEmailSignup(authName.trim())
      const { needsConfirmation } = await signUpWithPassword(authEmail, authPassword)
      if (needsConfirmation) setConfirmSent(true)
    } catch (err) {
      consumePendingEmailSignup()
      setAuthError(err instanceof Error ? err.message : 'Échec de la création du compte.')
    } finally {
      setAuthBusy(false)
    }
  }

  async function handleForgotPassword() {
    setAuthError(null)
    if (!isValidAuthEmail) return
    setAuthBusy(true)
    try {
      await sendPasswordResetEmail(authEmail)
      setForgotSent(true)
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : "Échec de l'envoi du lien.")
    } finally {
      setAuthBusy(false)
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

            {emailOpen ? (
              <motion.div className="profile-card profile-card--form profile-card--restore card" variants={cardVariants}>
                {confirmSent ? (
                  <p className="profile-card__warning">
                    Compte créé — ouvre ta boîte mail sur cet appareil et clique sur le lien de confirmation pour te
                    connecter.
                  </p>
                ) : forgotSent ? (
                  <p className="profile-card__warning">
                    Lien envoyé à {authEmail} — ouvre ta boîte mail et clique dessus pour choisir un nouveau mot de
                    passe.
                  </p>
                ) : (
                  <>
                    {authMode === 'signup' && (
                      <input
                        type="text"
                        className="profile-card__input"
                        placeholder="Prénom"
                        value={authName}
                        autoFocus
                        maxLength={20}
                        onChange={(e) => setAuthName(e.target.value)}
                      />
                    )}
                    {authMode === 'signup' && isDuplicateName(authName) && (
                      <p className="profile-card__warning">
                        Ce nom est déjà utilisé par un profil actif sur cet appareil (pas supprimé) — celui-ci sera
                        séparé.
                      </p>
                    )}
                    <input
                      type="email"
                      className="profile-card__input"
                      placeholder="ton@email.com"
                      autoComplete="email"
                      value={authEmail}
                      autoFocus={authMode === 'login'}
                      onChange={(e) => setAuthEmail(e.target.value)}
                    />
                    <input
                      type="password"
                      className="profile-card__input"
                      placeholder="Mot de passe"
                      autoComplete={authMode === 'login' ? 'current-password' : 'new-password'}
                      value={authPassword}
                      onChange={(e) => setAuthPassword(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && (authMode === 'login' ? handleLogin() : handleSignup())}
                    />
                    <button
                      type="button"
                      className="profile-card__confirm"
                      onClick={authMode === 'login' ? handleLogin : handleSignup}
                      disabled={
                        authBusy ||
                        !isValidAuthEmail ||
                        (authMode === 'login' ? !authPassword : !authName.trim() || authPassword.length < 6)
                      }
                      title={authMode === 'login' ? 'Se connecter' : 'Créer mon compte'}
                    >
                      {authBusy ? '…' : authMode === 'login' ? 'Se connecter' : 'Créer mon compte'}
                    </button>
                    <p className="auth-links">
                      {authMode === 'login' ? (
                        <>
                          <button type="button" className="auth-inline-link" onClick={() => setAuthMode('signup')}>
                            Créer un compte
                          </button>
                          {' · '}
                          <button type="button" className="auth-inline-link" onClick={handleForgotPassword}>
                            Mot de passe oublié ?
                          </button>
                        </>
                      ) : (
                        <button type="button" className="auth-inline-link" onClick={() => setAuthMode('login')}>
                          J'ai déjà un compte
                        </button>
                      )}
                    </p>
                  </>
                )}
                {authError && <p className="profile-selector__error">{authError}</p>}
              </motion.div>
            ) : (
              <motion.button
                className="profile-card profile-card--new card"
                variants={cardVariants}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.97 }}
                onClick={() => setEmailOpen(true)}
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
      </div>
    </PageTransition>
  )
}
