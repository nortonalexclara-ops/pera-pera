import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useLiveQuery } from 'dexie-react-hooks'
import { Trash2, Check, AlertTriangle, CheckCheck, Volume2, Mail, Sun, Moon, Bell } from 'lucide-react'
import PageTransition from '../../components/ui/PageTransition'
import AmbientGlow from '../../components/ui/AmbientGlow'
import { useProfileStore } from '../profile/profileStore'
import { resetMastery, bulkMarkMastered, getMasteredIds, resetReviewMarks } from '../../db/mastery'
import { resetActivity } from '../../db/activity'
import { resetNotes } from '../../db/notes'
import { resetFavorites } from '../../db/favorites'
import { resetTimeSpent } from '../../db/timeSpent'
import { resetSavedWords } from '../../db/savedWords'
import { deleteProfile } from '../../db/profiles'
import { getKanjiGoal, setKanjiGoal, DEFAULT_KANJI_GOAL } from '../../db/settings'
import { getCloudSyncState, disableCloudSync } from '../../db/cloudSyncState'
import { useThemeStore } from '../theme/themeStore'
import { deleteAccountBackup } from '../profile/cloudSync'
import { deleteEmailBackup } from '../profile/emailSync'
import { syncNow } from '../profile/cloudSyncEngine'
import {
  signInWithPassword,
  signUpWithPassword,
  sendPasswordResetEmail,
  signInWithGoogle,
  setPendingEmailLinkProfileId,
  consumePendingEmailLinkProfileId,
  signOutEmail,
} from '../profile/emailAuth'
import { isPushSupported, subscribeToPush, unsubscribeFromPush } from '../notifications/pushNotifications'
import {
  isSpeechSupported,
  listJapaneseVoices,
  getPreferredVoiceURI,
  setPreferredVoiceURI,
  speakJapanese,
} from '../../utils/speech'
import type { ItemKind } from '../../db/db'
import { mockKanjiList, type JlptLevel } from '../kanji/mockKanji'
import { mockVocabList } from '../vocab/mockVocab'
import { mockGrammarList } from '../grammar/mockGrammar'
import './Settings.css'

const JLPT_LEVELS: JlptLevel[] = ['N5', 'N4', 'N3', 'N2', 'N1']

const KIND_OPTIONS: { key: ItemKind; label: string }[] = [
  { key: 'kanji', label: 'Kanjis' },
  { key: 'vocab', label: 'Vocabulaire' },
  { key: 'grammar', label: 'Grammaire' },
]

// "Dernière synchro : il y a 2 min" — assez grossier (pas de seconde
// près), une synchro automatique tourne toutes les ~3 min de toute façon
// (voir useCloudSyncScheduler.ts), la précision à la seconde n'aiderait
// pas à se repérer.
function formatRelativeSync(ts: number): string {
  const diffSec = Math.round((Date.now() - ts) / 1000)
  if (diffSec < 10) return "à l'instant"
  if (diffSec < 60) return `il y a ${diffSec} s`
  const diffMin = Math.round(diffSec / 60)
  if (diffMin < 60) return `il y a ${diffMin} min`
  const diffH = Math.round(diffMin / 60)
  if (diffH < 24) return `il y a ${diffH} h`
  const diffD = Math.round(diffH / 24)
  return `il y a ${diffD} j`
}

// Même contenu que Explorer/Stats, juste ré-indexé par (kind, level) pour
// le marquage en masse — pas de nouvelle source de données.
function itemIdsFor(kind: ItemKind, level: JlptLevel): string[] {
  if (kind === 'kanji') return mockKanjiList.filter((k) => k.jlptLevel === level).map((k) => k.id)
  if (kind === 'vocab') return mockVocabList.filter((w) => w.jlptLevel === level).map((w) => w.id)
  return mockGrammarList.filter((g) => g.jlptLevel === level).map((g) => g.id)
}

type ResetOption =
  | 'kanji'
  | 'vocab'
  | 'grammar'
  | 'hiragana'
  | 'katakana'
  | 'streak'
  | 'notes'
  | 'favorites'
  | 'timeSpent'
  | 'reviewMarks'
  | 'savedWords'

const RESET_OPTIONS: { key: ResetOption; label: string; description: string }[] = [
  { key: 'kanji', label: 'Progression Kanjis', description: 'Retire "Maîtrisé" de tous les kanjis de ce profil.' },
  { key: 'vocab', label: 'Progression Vocabulaire', description: 'Retire "Maîtrisé" de tous les mots de ce profil.' },
  { key: 'grammar', label: 'Progression Grammaire', description: 'Retire "Maîtrisé" de tous les points de grammaire de ce profil.' },
  { key: 'hiragana', label: 'Progression Hiragana', description: 'Retire "Maîtrisé" de tous les hiragana de ce profil.' },
  { key: 'katakana', label: 'Progression Katakana', description: 'Retire "Maîtrisé" de tous les katakana de ce profil.' },
  { key: 'streak', label: 'Série (jours de suite)', description: 'Remet le compteur "jours de suite" à zéro.' },
  { key: 'notes', label: 'Notes personnelles', description: 'Supprime toutes les notes du Cahier de notes.' },
  { key: 'favorites', label: 'Favoris', description: 'Retire tous les kanjis/mots/points de grammaire mis en favori.' },
  { key: 'timeSpent', label: 'Temps passé', description: 'Efface l\'historique du temps passé en séance jour par jour.' },
  { key: 'reviewMarks', label: 'Cartes "À revoir"', description: 'Retire la marque "À revoir" de tous les kanjis/mots/points de grammaire.' },
  { key: 'savedWords', label: 'Mots enregistrés', description: 'Vide les mots, phrases et clés enregistrés pendant une séance (affichés dans Notes).' },
]

/**
 * Demande explicite de l'utilisatrice : pouvoir remettre à zéro certaines
 * données par profil (pas un unique "tout effacer") — utile notamment
 * pour repartir propre au moment du passage à l'hébergement en ligne
 * (les stats "12 jours de suite"/"mot du jour" fixes ont été remplacées
 * par de vraies données par profil, voir Dashboard.tsx/src/db/activity.ts
 * — ce n'était pas un vrai reset qui manquait, juste des chiffres
 * inventés partagés par tout le monde).
 */
export default function Settings() {
  const navigate = useNavigate()
  const profileId = useProfileStore((s) => s.activeProfileId)
  const profileName = useProfileStore((s) => s.activeProfileName)
  const clearActiveProfile = useProfileStore((s) => s.clearActiveProfile)
  const theme = useThemeStore((s) => s.theme)
  const setTheme = useThemeStore((s) => s.setTheme)
  const [selected, setSelected] = useState<Set<ResetOption>>(new Set())
  const [confirming, setConfirming] = useState(false)
  const [done, setDone] = useState(false)
  const [busy, setBusy] = useState(false)

  // État de la synchronisation automatique en arrière-plan pour ce
  // profil SUR CET APPAREIL (voir cloudSyncState.ts).
  const cloudSyncState = useLiveQuery(
    () => (profileId ? getCloudSyncState(profileId) : Promise.resolve(undefined)),
    [profileId],
    undefined,
  )
  const [manualSyncBusy, setManualSyncBusy] = useState(false)

  // Connexion par email — mot de passe (comme sur Okane), voir
  // ProfileSelector.tsx pour le même mécanisme côté écran de sélection.
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login')
  const [authEmail, setAuthEmail] = useState('')
  const [authPassword, setAuthPassword] = useState('')
  const [authBusy, setAuthBusy] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [confirmSent, setConfirmSent] = useState(false)
  const [forgotSent, setForgotSent] = useState(false)
  const isValidAuthEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(authEmail)

  // Objectif de kanjis affiché sur le Dashboard, personnalisable — `null`
  // tant que l'utilisatrice n'a pas commencé à taper, pour que le champ
  // affiche la vraie valeur enregistrée (kanjiGoal, résolue de façon
  // asynchrone) plutôt qu'une valeur figée au premier rendu.
  const kanjiGoal = useLiveQuery(
    () => (profileId ? getKanjiGoal(profileId) : Promise.resolve(DEFAULT_KANJI_GOAL)),
    [profileId],
    DEFAULT_KANJI_GOAL,
  )
  const [goalInput, setGoalInput] = useState<string | null>(null)
  const [goalSaved, setGoalSaved] = useState(false)
  const goalValue = goalInput ?? String(kanjiGoal)

  const [deleteConfirming, setDeleteConfirming] = useState(false)
  const [deletePin, setDeletePin] = useState('')
  const [deleteBusy, setDeleteBusy] = useState(false)
  const [deleteError, setDeleteError] = useState<string | null>(null)

  const [bulkKind, setBulkKind] = useState<ItemKind>('kanji')
  const [bulkLevel, setBulkLevel] = useState<JlptLevel>('N5')
  const [bulkConfirming, setBulkConfirming] = useState(false)
  const [bulkBusy, setBulkBusy] = useState(false)
  const [bulkDone, setBulkDone] = useState<number | null>(null)

  const bulkItemIds = useMemo(() => itemIdsFor(bulkKind, bulkLevel), [bulkKind, bulkLevel])
  const bulkMasteredIds = useLiveQuery(
    () => (profileId ? getMasteredIds(profileId, bulkKind) : Promise.resolve(new Set<string>())),
    [profileId, bulkKind],
    new Set<string>(),
  )
  const bulkRemaining = bulkItemIds.filter((id) => !bulkMasteredIds.has(id)).length

  async function applyBulkMark() {
    if (!profileId || bulkRemaining === 0) return
    setBulkBusy(true)
    const added = await bulkMarkMastered(profileId, bulkKind, bulkItemIds)
    setBulkConfirming(false)
    setBulkBusy(false)
    setBulkDone(added)
  }

  function toggle(key: ResetOption) {
    setSelected((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
    setDone(false)
    setConfirming(false)
  }

  async function applyReset() {
    if (!profileId || selected.size === 0) return
    setBusy(true)
    const kinds: ItemKind[] = []
    if (selected.has('kanji')) kinds.push('kanji')
    if (selected.has('vocab')) kinds.push('vocab')
    if (selected.has('grammar')) kinds.push('grammar')
    if (selected.has('hiragana')) kinds.push('hiragana')
    if (selected.has('katakana')) kinds.push('katakana')
    if (kinds.length > 0) await resetMastery(profileId, kinds)
    if (selected.has('streak')) await resetActivity(profileId)
    if (selected.has('notes')) await resetNotes(profileId)
    if (selected.has('favorites')) await resetFavorites(profileId)
    if (selected.has('timeSpent')) await resetTimeSpent(profileId)
    if (selected.has('reviewMarks')) await resetReviewMarks(profileId)
    if (selected.has('savedWords')) await resetSavedWords(profileId)
    setSelected(new Set())
    setConfirming(false)
    setBusy(false)
    setDone(true)
  }

  async function handleManualSync() {
    if (!profileId || !profileName) return
    setManualSyncBusy(true)
    await syncNow(profileId, profileName)
    setManualSyncBusy(false)
  }

  // Connexion à un compte EXISTANT, pour lier ce profil-ci — synchrone
  // (établit la session tout de suite), le marqueur posé avant sert de
  // filet au cas où l'événement de connexion Supabase arrive avant que ce
  // `await` ne se résolve ici (voir useEmailAuthLink.ts).
  async function handleSettingsLogin() {
    if (!profileId || !isValidAuthEmail || !authPassword) return
    setAuthBusy(true)
    setAuthError(null)
    try {
      setPendingEmailLinkProfileId(profileId)
      await signInWithPassword(authEmail, authPassword)
    } catch (err) {
      consumePendingEmailLinkProfileId()
      setAuthError(err instanceof Error ? err.message : 'Échec de la connexion.')
    } finally {
      setAuthBusy(false)
    }
  }

  // Création d'un tout nouveau compte pour ce profil — si Supabase exige
  // une confirmation par email, la liaison n'a lieu qu'au clic sur ce lien
  // (voir useEmailAuthLink.ts), pas ici.
  async function handleSettingsSignup() {
    if (!profileId || !isValidAuthEmail || authPassword.length < 6) return
    setAuthBusy(true)
    setAuthError(null)
    try {
      setPendingEmailLinkProfileId(profileId)
      const { needsConfirmation } = await signUpWithPassword(authEmail, authPassword)
      if (needsConfirmation) setConfirmSent(true)
    } catch (err) {
      consumePendingEmailLinkProfileId()
      setAuthError(err instanceof Error ? err.message : 'Échec de la création du compte.')
    } finally {
      setAuthBusy(false)
    }
  }

  async function handleSettingsForgotPassword() {
    if (!isValidAuthEmail) return
    setAuthBusy(true)
    setAuthError(null)
    try {
      await sendPasswordResetEmail(authEmail)
      setForgotSent(true)
    } catch (err) {
      setAuthError(err instanceof Error ? err.message : "Échec de l'envoi du lien.")
    } finally {
      setAuthBusy(false)
    }
  }

  // Lie ce profil-ci à un compte Google — redirige immédiatement, rien à
  // faire après cet appel (voir emailAuth.ts, useEmailAuthLink.ts).
  async function handleSettingsGoogleSignIn() {
    if (!profileId) return
    setAuthError(null)
    setAuthBusy(true)
    try {
      setPendingEmailLinkProfileId(profileId)
      await signInWithGoogle()
    } catch (err) {
      consumePendingEmailLinkProfileId()
      setAuthError(err instanceof Error ? err.message : 'Échec de la connexion Google.')
      setAuthBusy(false)
    }
  }

  async function handleSignOutEmail() {
    if (!profileId) return
    await signOutEmail()
    await disableCloudSync(profileId)
  }

  async function handleSaveGoal() {
    const n = parseInt(goalValue, 10)
    if (!profileId || !Number.isFinite(n) || n <= 0) return
    await setKanjiGoal(profileId, n)
    setGoalInput(null)
    setGoalSaved(true)
  }

  // Un code n'est demandé QUE pour l'ancien système nom+code — protège
  // contre une suppression par quelqu'un d'autre sur le même appareil, vu
  // que ce système "réserve" juste un nom (voir api/backup.ts). Pour un
  // profil lié par compte email, rien à redemander : la connexion elle-
  // même (voir Réglages, section Synchronisation) EST déjà la protection,
  // demander en plus un code à 4 chiffres qui n'a jamais existé pour ce
  // système n'a fait que dérouter l'utilisatrice ("il me demande un code
  // que je n'ai pas configuré"). Un souci serveur (Redis/Supabase
  // indisponible, réseau...) ne bloque PAS la suppression locale — seul un
  // vrai refus (mauvais code, système nom+code) le fait.
  async function handleDeleteProfile() {
    if (!profileId || !profileName) return
    setDeleteBusy(true)
    setDeleteError(null)
    if (cloudSyncState?.authUserId) {
      try {
        await deleteEmailBackup()
      } catch (err) {
        console.warn('Suppression de la sauvegarde email impossible (suppression locale quand même) :', err)
      }
      await signOutEmail()
    } else if (cloudSyncState?.pin) {
      const result = await deleteAccountBackup(profileName, deletePin)
      if (result.blockedByWrongPin) {
        setDeleteError(result.error ?? 'Code incorrect.')
        setDeleteBusy(false)
        return
      }
      if (!result.ok) {
        console.warn('Suppression de la sauvegarde en ligne impossible (suppression locale quand même) :', result.error)
      }
    }
    await deleteProfile(profileId)
    clearActiveProfile()
    navigate('/')
  }

  return (
    <PageTransition>
      <div className="settings">
        <div className="settings__header">
          <AmbientGlow top={-90} left={-60} size={240} />
          <h1 className="settings__title">Réglages</h1>
          <p className="settings__subtitle">Profil actif : {profileName ?? '—'}</p>
        </div>

        <section className="settings-card">
          <h2 className="settings-card__title">Apparence</h2>
          <div className="theme-toggle">
            <button
              type="button"
              className={`theme-toggle__option${theme === 'light' ? ' active' : ''}`}
              onClick={() => setTheme('light')}
            >
              <Sun size={16} strokeWidth={1.75} />
              Clair
            </button>
            <button
              type="button"
              className={`theme-toggle__option${theme === 'dark' ? ' active' : ''}`}
              onClick={() => setTheme('dark')}
            >
              <Moon size={16} strokeWidth={1.75} />
              Sombre
            </button>
          </div>
        </section>

        <NotificationSection profileId={profileId} />

        <section className="settings-card">
          <h2 className="settings-card__title">Synchronisation entre appareils</h2>

          {cloudSyncState?.enabled && cloudSyncState.authUserId ? (
            <>
              {/* Lié par compte email (voir emailAuth.ts/emailSync.ts) —
                  une fois connecté, la synchro tourne toute seule en
                  arrière-plan (voir useCloudSyncScheduler.ts). */}
              <p className="settings-card__hint">
                <Check size={15} strokeWidth={2} className="settings-card__hint-icon" />
                Connecté en tant que {cloudSyncState.email}. Dernière synchro :{' '}
                {cloudSyncState.lastSyncedAt ? formatRelativeSync(cloudSyncState.lastSyncedAt) : 'pas encore'}.
              </p>
              <p className="settings-card__hint">
                Connecte-toi avec la même adresse email sur ton autre appareil pour les lier ensemble.
              </p>
              <div className="reset-confirm__actions">
                <button type="button" className="btn-link" onClick={handleManualSync} disabled={manualSyncBusy}>
                  {manualSyncBusy ? 'Synchronisation…' : 'Synchroniser maintenant'}
                </button>
                <button type="button" className="btn-link" onClick={handleSignOutEmail}>
                  Se déconnecter
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Un profil encore lié à l'ancien système nom+code (voir
                  cloudSync.ts) tombe ici aussi — se connecter par email
                  remplace automatiquement cet ancien lien dès qu'un compte
                  est lié avec succès (voir useEmailAuthLink.ts,
                  enableEmailSync écrase l'ancien enregistrement nom+code),
                  pas besoin d'un statut ou d'un bouton "Désactiver" séparé
                  pour ça — source de confusion signalée par l'utilisatrice
                  ("j'ai déjà synchronisé avec mon email" alors que l'écran
                  montrait encore l'ancien statut nom+code). */}
              <p className="settings-card__hint">
                Connecte-toi avec ton adresse email pour retrouver ta progression sur tous tes appareils.
              </p>

              {confirmSent ? (
                <p className="settings-card__hint">
                  <Check size={15} strokeWidth={2} className="settings-card__hint-icon" />
                  Compte créé — ouvre ta boîte mail sur cet appareil et clique sur le lien de confirmation pour lier
                  ce profil.
                </p>
              ) : forgotSent ? (
                <p className="settings-card__hint">
                  <Check size={15} strokeWidth={2} className="settings-card__hint-icon" />
                  Lien envoyé à {authEmail} — ouvre ta boîte mail et clique dessus pour choisir un nouveau mot de
                  passe.
                </p>
              ) : (
                <>
                  <div className="pin-row">
                    <input
                      type="email"
                      placeholder="ton@email.com"
                      className="pin-input"
                      autoComplete="email"
                      value={authEmail}
                      onChange={(e) => {
                        setAuthEmail(e.target.value)
                        setAuthError(null)
                      }}
                    />
                    <input
                      type="password"
                      placeholder="Mot de passe"
                      className="pin-input"
                      autoComplete={authMode === 'login' ? 'current-password' : 'new-password'}
                      value={authPassword}
                      onChange={(e) => {
                        setAuthPassword(e.target.value)
                        setAuthError(null)
                      }}
                      onKeyDown={(e) =>
                        e.key === 'Enter' && (authMode === 'login' ? handleSettingsLogin() : handleSettingsSignup())
                      }
                    />
                    <button
                      type="button"
                      className="btn-primary"
                      disabled={
                        authBusy || !isValidAuthEmail || (authMode === 'login' ? !authPassword : authPassword.length < 6)
                      }
                      onClick={authMode === 'login' ? handleSettingsLogin : handleSettingsSignup}
                    >
                      <Mail size={16} strokeWidth={1.75} />
                      {authBusy ? '…' : authMode === 'login' ? 'Se connecter' : 'Créer mon compte'}
                    </button>
                  </div>
                  <p className="auth-links">
                    {authMode === 'login' ? (
                      <>
                        <button type="button" className="auth-inline-link" onClick={() => setAuthMode('signup')}>
                          Créer un compte
                        </button>
                        {' · '}
                        <button
                          type="button"
                          className="auth-inline-link"
                          onClick={handleSettingsForgotPassword}
                        >
                          Mot de passe oublié ?
                        </button>
                      </>
                    ) : (
                      <button type="button" className="auth-inline-link" onClick={() => setAuthMode('login')}>
                        J'ai déjà un compte
                      </button>
                    )}
                  </p>
                  <p className="auth-divider">ou</p>
                  <button
                    type="button"
                    className="auth-google-btn"
                    onClick={handleSettingsGoogleSignIn}
                    disabled={authBusy}
                  >
                    Continuer avec Google
                  </button>
                </>
              )}

              {authError && <p className="settings-error">{authError}</p>}
            </>
          )}
        </section>

        <section className="settings-card">
          <h2 className="settings-card__title">Objectif</h2>
          <p className="settings-card__hint">
            Nombre de kanjis à maîtriser pour atteindre 100% de l'objectif affiché sur le Dashboard.
          </p>

          <div className="pin-row">
            <input
              type="number"
              min={1}
              max={2491}
              className="pin-input goal-input"
              value={goalValue}
              onChange={(e) => {
                setGoalInput(e.target.value)
                setGoalSaved(false)
              }}
            />
            <button
              type="button"
              className="btn-primary"
              disabled={!profileId || !Number.isFinite(parseInt(goalValue, 10)) || parseInt(goalValue, 10) <= 0}
              onClick={handleSaveGoal}
            >
              Enregistrer
            </button>
          </div>

          {goalSaved && (
            <p className="reset-done">
              <Check size={15} strokeWidth={2} />
              Objectif mis à jour.
            </p>
          )}
        </section>

        <VoiceSection />

        <section className="settings-card">
          <h2 className="settings-card__title">Marquer un niveau comme maîtrisé</h2>
          <p className="settings-card__hint">
            Tu connais déjà tout un niveau ? Marque-le "Maîtrisé" d'un coup pour {profileName ?? 'ce profil'}, sans repasser
            chaque carte une par une.
          </p>

          <div className="bulk-mark-row">
            <select
              className="bulk-mark-select"
              value={bulkKind}
              onChange={(e) => {
                setBulkKind(e.target.value as ItemKind)
                setBulkDone(null)
                setBulkConfirming(false)
              }}
            >
              {KIND_OPTIONS.map((opt) => (
                <option key={opt.key} value={opt.key}>
                  {opt.label}
                </option>
              ))}
            </select>
            <select
              className="bulk-mark-select"
              value={bulkLevel}
              onChange={(e) => {
                setBulkLevel(e.target.value as JlptLevel)
                setBulkDone(null)
                setBulkConfirming(false)
              }}
            >
              {JLPT_LEVELS.map((level) => (
                <option key={level} value={level}>
                  {level}
                </option>
              ))}
            </select>
          </div>

          <p className="settings-card__hint">
            {bulkRemaining === 0
              ? `Tout le niveau ${bulkLevel} est déjà marqué "Maîtrisé".`
              : `${bulkRemaining} sur ${bulkItemIds.length} pas encore marqués "Maîtrisé".`}
          </p>

          {!bulkConfirming ? (
            <button
              type="button"
              className="btn-primary bulk-mark-trigger"
              disabled={bulkRemaining === 0}
              onClick={() => setBulkConfirming(true)}
            >
              <CheckCheck size={16} strokeWidth={1.75} />
              Marquer {bulkRemaining} comme maîtrisés
            </button>
          ) : (
            <motion.div className="reset-confirm bulk-mark-confirm" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <p className="reset-confirm__text bulk-mark-confirm__text">
                <AlertTriangle size={16} strokeWidth={1.75} />
                Marquer les {bulkRemaining} {KIND_OPTIONS.find((k) => k.key === bulkKind)?.label.toLowerCase()} {bulkLevel}{' '}
                restants comme maîtrisés ?
              </p>
              <div className="reset-confirm__actions">
                <button type="button" className="btn-link" onClick={() => setBulkConfirming(false)} disabled={bulkBusy}>
                  Annuler
                </button>
                <button type="button" className="btn-primary" onClick={applyBulkMark} disabled={bulkBusy}>
                  {bulkBusy ? 'Marquage…' : 'Oui, marquer'}
                </button>
              </div>
            </motion.div>
          )}

          {bulkDone !== null && (
            <p className="reset-done">
              <Check size={15} strokeWidth={2} />
              {bulkDone} élément{bulkDone !== 1 ? 's' : ''} marqué{bulkDone !== 1 ? 's' : ''} "Maîtrisé".
            </p>
          )}
        </section>

        <section className="settings-card">
          <h2 className="settings-card__title">Réinitialiser mes données</h2>
          <p className="settings-card__hint">
            Coche uniquement ce que tu veux remettre à zéro pour {profileName ?? 'ce profil'} — le reste n'est pas touché.
          </p>

          <ul className="reset-option-list">
            {RESET_OPTIONS.map((opt) => (
              <li key={opt.key} className="reset-option">
                <label className="reset-option__row">
                  <input
                    type="checkbox"
                    checked={selected.has(opt.key)}
                    onChange={() => toggle(opt.key)}
                  />
                  <span>
                    <span className="reset-option__label">{opt.label}</span>
                    <span className="reset-option__description">{opt.description}</span>
                  </span>
                </label>
              </li>
            ))}
          </ul>

          {!confirming ? (
            <button
              type="button"
              className="btn-danger reset-trigger"
              disabled={selected.size === 0}
              onClick={() => setConfirming(true)}
            >
              <Trash2 size={16} strokeWidth={1.75} />
              Réinitialiser la sélection
            </button>
          ) : (
            <motion.div className="reset-confirm" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <p className="reset-confirm__text">
                <AlertTriangle size={16} strokeWidth={1.75} />
                Action irréversible pour {profileName ?? 'ce profil'}. Confirmer ?
              </p>
              <div className="reset-confirm__actions">
                <button type="button" className="btn-link" onClick={() => setConfirming(false)} disabled={busy}>
                  Annuler
                </button>
                <button type="button" className="btn-danger" onClick={applyReset} disabled={busy}>
                  {busy ? 'Réinitialisation…' : 'Oui, réinitialiser'}
                </button>
              </div>
            </motion.div>
          )}

          {done && (
            <p className="reset-done">
              <Check size={15} strokeWidth={2} />
              C'est fait.
            </p>
          )}
        </section>

        <section className="settings-card">
          <h2 className="settings-card__title">Supprimer ce profil</h2>
          <p className="settings-card__hint">
            Supprime définitivement {profileName ?? 'ce profil'} et toutes ses données (progression, notes, favoris) de
            cet appareil{cloudSyncState?.authUserId ? ' et sa sauvegarde en ligne' : ''}.
            {cloudSyncState?.pin && !cloudSyncState?.authUserId && ' Entre son code à 4 chiffres pour confirmer.'}
          </p>

          {!deleteConfirming ? (
            <button
              type="button"
              className="btn-danger reset-trigger"
              onClick={() => setDeleteConfirming(true)}
              disabled={!profileId}
            >
              <Trash2 size={16} strokeWidth={1.75} />
              Supprimer ce profil
            </button>
          ) : (
            <motion.div className="reset-confirm" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}>
              <p className="reset-confirm__text">
                <AlertTriangle size={16} strokeWidth={1.75} />
                Action irréversible pour {profileName ?? 'ce profil'}.
              </p>
              {cloudSyncState?.pin && !cloudSyncState?.authUserId && (
                <div className="pin-row">
                  <input
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    maxLength={4}
                    placeholder="Code à 4 chiffres"
                    className="pin-input"
                    value={deletePin}
                    onChange={(e) => {
                      setDeletePin(e.target.value.replace(/\D/g, '').slice(0, 4))
                      setDeleteError(null)
                    }}
                  />
                </div>
              )}
              <div className="reset-confirm__actions">
                <button
                  type="button"
                  className="btn-link"
                  onClick={() => {
                    setDeleteConfirming(false)
                    setDeletePin('')
                    setDeleteError(null)
                  }}
                  disabled={deleteBusy}
                >
                  Annuler
                </button>
                <button type="button" className="btn-danger" onClick={handleDeleteProfile} disabled={deleteBusy}>
                  {deleteBusy ? 'Suppression…' : 'Oui, supprimer définitivement'}
                </button>
              </div>
              {deleteError && <p className="settings-error">{deleteError}</p>}
            </motion.div>
          )}
        </section>
      </div>
    </PageTransition>
  )
}

// Rappel quotidien (demande explicite de l'utilisatrice : recevoir une
// notification une fois par jour pour penser à réviser) — activé/désactivé
// par profil, sur CET appareil. `pushEnabledKey` : préférence purement
// locale (pas dans la sauvegarde cloud, comme la voix de prononciation
// ci-dessous) — l'abonnement Push lui-même est de toute façon propre à un
// appareil, pas transférable d'un profil/appareil à l'autre.
function NotificationSection({ profileId }: { profileId: string | null }) {
  const supported = useMemo(() => isPushSupported(), [])
  const pushEnabledKey = profileId ? `pera-pera:push-enabled:${profileId}` : null
  const [enabled, setEnabled] = useState(() => pushEnabledKey != null && localStorage.getItem(pushEnabledKey) === '1')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function handleToggle() {
    if (!profileId || !pushEnabledKey) return
    setError(null)
    setBusy(true)
    try {
      if (enabled) {
        await unsubscribeFromPush(profileId)
        localStorage.removeItem(pushEnabledKey)
        setEnabled(false)
      } else {
        await subscribeToPush(profileId)
        localStorage.setItem(pushEnabledKey, '1')
        setEnabled(true)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Échec.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <section className="settings-card">
      <h2 className="settings-card__title">Rappel quotidien</h2>
      {supported ? (
        <>
          <p className="settings-card__hint">
            Reçois une notification une fois par jour pour penser à réviser.
          </p>
          <button
            type="button"
            className={enabled ? 'btn-danger' : 'btn-primary'}
            onClick={handleToggle}
            disabled={busy || !profileId}
          >
            <Bell size={16} strokeWidth={1.75} />
            {busy ? 'Patiente…' : enabled ? 'Désactiver les rappels' : 'Activer les rappels'}
          </button>
          {error && <p className="settings-error">{error}</p>}
        </>
      ) : (
        <p className="settings-card__hint">
          Pas disponible sur cet appareil pour l'instant — sur iPhone/iPad, ajoute d'abord l'appli à l'écran
          d'accueil (Safari → Partager → Sur l'écran d'accueil), nécessite iOS 16.4 ou plus récent.
        </p>
      )}
    </section>
  )
}

// Choix de la voix utilisée par le bouton "écouter la prononciation"
// (voir SpeakButton.tsx) — un réglage d'appareil/navigateur (les voix
// installées diffèrent d'un appareil à l'autre), pas une donnée de
// profil : gardé en local uniquement (voir setPreferredVoiceURI), pas
// dans la sauvegarde cloud. `voiceschanged` : `getVoices()` peut renvoyer
// une liste vide au tout premier rendu, le temps que le navigateur la
// charge de façon asynchrone — sans ça, un appareil avec plusieurs voix
// japonaises pourrait n'en montrer aucune si Réglages est ouvert tôt.
function VoiceSection() {
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>(() => listJapaneseVoices())
  const [selected, setSelected] = useState(() => getPreferredVoiceURI() ?? '')

  useEffect(() => {
    if (!isSpeechSupported()) return
    function refresh() {
      setVoices(listJapaneseVoices())
    }
    refresh()
    window.speechSynthesis.addEventListener('voiceschanged', refresh)
    return () => window.speechSynthesis.removeEventListener('voiceschanged', refresh)
  }, [])

  if (!isSpeechSupported()) return null

  const currentURI = selected || voices[0]?.voiceURI || ''

  function handleChange(uri: string) {
    setSelected(uri)
    setPreferredVoiceURI(uri)
  }

  return (
    <section className="settings-card">
      <h2 className="settings-card__title">Voix de prononciation</h2>

      {/* Les voix viennent du SYSTÈME (iPad, iPhone, ordinateur...), pas de
          l'appli — chacune a les siennes, installées séparément, donc la
          liste diffère forcément d'un appareil à l'autre (question
          explicite de l'utilisatrice : "comment avoir toutes les voix sur
          tous les appareils ?" — pas possible d'unifier depuis l'appli,
          seulement d'en installer plus PAR appareil). Rappel affiché en
          permanence, pas seulement quand aucune voix n'est trouvée. */}
      <p className="settings-card__hint">
        {voices.length === 0
          ? 'Aucune voix japonaise trouvée sur cet appareil — la prononciation utilisera la voix par défaut du navigateur.'
          : voices.length === 1
            ? 'Une seule voix japonaise est installée sur cet appareil.'
            : `${voices.length} voix japonaises disponibles sur cet appareil.`}{' '}
        Les voix dépendent de chaque appareil, pas de l'appli — la liste peut donc différer entre ton iPad, ton
        téléphone ou ton ordinateur. Sur iPad/iPhone : Réglages → Accessibilité → Contenu énoncé → Voix → Japonais,
        pour en installer/télécharger d'autres.
      </p>

      {voices.length > 0 && (
        <div className="pin-row">
          <select className="bulk-mark-select" value={currentURI} onChange={(e) => handleChange(e.target.value)}>
            {voices.map((v) => (
              <option key={v.voiceURI} value={v.voiceURI}>
                {v.name}
              </option>
            ))}
          </select>
          <button type="button" className="btn-primary" onClick={() => speakJapanese('こんにちは、元気ですか')}>
            <Volume2 size={16} strokeWidth={1.75} />
            Écouter un exemple
          </button>
        </div>
      )}
    </section>
  )
}
