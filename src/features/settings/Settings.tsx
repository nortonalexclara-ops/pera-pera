import { useState, useMemo, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useLiveQuery } from 'dexie-react-hooks'
import { Trash2, Check, AlertTriangle, CloudUpload, CheckCheck, Volume2 } from 'lucide-react'
import PageTransition from '../../components/ui/PageTransition'
import AmbientGlow from '../../components/ui/AmbientGlow'
import { useProfileStore } from '../profile/profileStore'
import { resetMastery, bulkMarkMastered, getMasteredIds, resetReviewMarks } from '../../db/mastery'
import { resetActivity } from '../../db/activity'
import { resetNotes } from '../../db/notes'
import { resetFavorites } from '../../db/favorites'
import { resetTimeSpent } from '../../db/timeSpent'
import { resetSavedWords } from '../../db/savedWords'
import { exportProfileData } from '../../db/profileSync'
import { deleteProfile } from '../../db/profiles'
import { getKanjiGoal, setKanjiGoal, getHasCloudBackup, setHasCloudBackup, DEFAULT_KANJI_GOAL } from '../../db/settings'
import { getCloudSyncState, enableCloudSync, disableCloudSync } from '../../db/cloudSyncState'
import { backupProfile, deleteAccountBackup } from '../profile/cloudSync'
import { syncNow } from '../profile/cloudSyncEngine'
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
  { key: 'savedWords', label: 'Mots enregistrés', description: 'Vide la liste des mots enregistrés pendant une séance (affichée dans Notes).' },
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
  const [selected, setSelected] = useState<Set<ResetOption>>(new Set())
  const [confirming, setConfirming] = useState(false)
  const [done, setDone] = useState(false)
  const [busy, setBusy] = useState(false)

  const [pin, setPin] = useState('')
  const [backupBusy, setBackupBusy] = useState(false)
  const [backupResult, setBackupResult] = useState<'ok' | string | null>(null)

  // Une fois qu'une sauvegarde a réussi pour ce profil, on n'invite plus à
  // (re)créer un code — voir src/db/settings.ts. Réservé au statut connu
  // localement (pas d'appel serveur juste pour l'afficher).
  const hasCloudBackup = useLiveQuery(
    () => (profileId ? getHasCloudBackup(profileId) : Promise.resolve(false)),
    [profileId],
    false,
  )

  // État de la synchronisation automatique en arrière-plan pour ce
  // profil SUR CET APPAREIL (voir cloudSyncState.ts) — distinct de
  // `hasCloudBackup` : un profil peut avoir une sauvegarde en ligne sans
  // que la synchro auto soit activée ICI (ex. sauvegarde faite avant
  // l'existence de cette fonctionnalité — voir le texte conditionnel
  // plus bas, qui invite alors à ressaisir le code une fois).
  const cloudSyncState = useLiveQuery(
    () => (profileId ? getCloudSyncState(profileId) : Promise.resolve(undefined)),
    [profileId],
    undefined,
  )
  const [manualSyncBusy, setManualSyncBusy] = useState(false)

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

  async function handleBackup() {
    if (!profileId || !profileName || !/^\d{4}$/.test(pin)) return
    setBackupBusy(true)
    setBackupResult(null)
    try {
      const payload = await exportProfileData(profileId)
      await backupProfile(profileName, pin, payload)
      await setHasCloudBackup(profileId, true)
      // Active la synchro automatique en arrière-plan sur cet appareil —
      // le code n'a plus besoin d'être ressaisi ensuite (voir
      // cloudSyncState.ts, useCloudSyncScheduler.ts).
      await enableCloudSync(profileId, pin)
      setBackupResult('ok')
      setPin('')
      // Pas attendu : ne bloque pas l'affichage du message de succès,
      // juste une première synchro immédiate plutôt que d'attendre le
      // prochain déclenchement automatique.
      syncNow(profileId, profileName)
    } catch (err) {
      setBackupResult(err instanceof Error ? err.message : 'Échec de la sauvegarde.')
    } finally {
      setBackupBusy(false)
    }
  }

  async function handleManualSync() {
    if (!profileId || !profileName) return
    setManualSyncBusy(true)
    await syncNow(profileId, profileName)
    setManualSyncBusy(false)
  }

  async function handleDisableSync() {
    if (!profileId) return
    await disableCloudSync(profileId)
  }

  async function handleSaveGoal() {
    const n = parseInt(goalValue, 10)
    if (!profileId || !Number.isFinite(n) || n <= 0) return
    await setKanjiGoal(profileId, n)
    setGoalInput(null)
    setGoalSaved(true)
  }

  // Le code n'est vérifié que si ce profil a déjà une sauvegarde en ligne
  // (voir api/delete-account.ts) — sinon rien à protéger, la suppression
  // locale se fait dès confirmation. Empêche qu'un autre utilisateur du
  // même appareil supprime un profil sauvegardé qui n'est pas le sien.
  // Un souci serveur (Redis indisponible, réseau...) ne bloque PAS la
  // suppression locale — seul un vrai refus (mauvais code) le fait, voir
  // `deleteAccountBackup`.
  async function handleDeleteProfile() {
    if (!profileId || !profileName) return
    setDeleteBusy(true)
    setDeleteError(null)
    const result = await deleteAccountBackup(profileName, deletePin)
    if (result.blockedByWrongPin) {
      setDeleteError(result.error ?? 'Code incorrect.')
      setDeleteBusy(false)
      return
    }
    if (!result.ok) {
      console.warn('Suppression de la sauvegarde en ligne impossible (suppression locale quand même) :', result.error)
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
          <h2 className="settings-card__title">Synchronisation entre appareils</h2>

          {cloudSyncState?.enabled ? (
            <>
              {/* Une fois activée, la synchro tourne toute seule en
                  arrière-plan (voir useCloudSyncScheduler.ts) — plus
                  besoin de reressaisir le code ni de cliquer quoi que ce
                  soit pour que les notes/progrès faits sur un appareil
                  apparaissent sur l'autre. */}
              <p className="settings-card__hint">
                <Check size={15} strokeWidth={2} className="settings-card__hint-icon" />
                Synchronisation automatique activée pour {profileName ?? 'ce profil'}. Dernière synchro :{' '}
                {cloudSyncState.lastSyncedAt ? formatRelativeSync(cloudSyncState.lastSyncedAt) : 'pas encore'}.
              </p>
              <p className="settings-card__hint">
                Utilise le même nom et le même code avec "Récupérer un profil" sur ton autre appareil pour les lier
                ensemble.
              </p>
              <div className="reset-confirm__actions">
                <button type="button" className="btn-link" onClick={handleManualSync} disabled={manualSyncBusy}>
                  {manualSyncBusy ? 'Synchronisation…' : 'Synchroniser maintenant'}
                </button>
                <button type="button" className="btn-link" onClick={handleDisableSync}>
                  Désactiver
                </button>
              </div>
            </>
          ) : (
            <>
              {/* Cas d'un profil sauvegardé manuellement avant l'ajout de
                  la synchro automatique (hasCloudBackup vrai mais pas de
                  code enregistré localement, voir cloudSyncState.ts) —
                  une seule ressaisie suffit pour l'activer. */}
              <p className="settings-card__hint">
                {hasCloudBackup
                  ? `Une sauvegarde existe déjà pour ${profileName ?? 'ce profil'}, mais la synchronisation automatique n'est pas encore activée sur cet appareil. Ressaisis le même code pour l'activer.`
                  : `Choisis un code à 4 chiffres pour ${profileName ?? 'ce profil'}. Une fois activée, la synchronisation avec ton autre appareil se fait ensuite toute seule, en arrière-plan — utilise "Récupérer un profil" avec le même nom et le même code sur l'autre appareil pour les lier.`}
              </p>

              <div className="pin-row">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={4}
                  placeholder="Code à 4 chiffres"
                  className="pin-input"
                  value={pin}
                  onChange={(e) => {
                    setPin(e.target.value.replace(/\D/g, '').slice(0, 4))
                    setBackupResult(null)
                  }}
                />
                <button
                  type="button"
                  className="btn-primary"
                  disabled={!/^\d{4}$/.test(pin) || backupBusy}
                  onClick={handleBackup}
                >
                  <CloudUpload size={16} strokeWidth={1.75} />
                  {backupBusy ? 'Activation…' : hasCloudBackup ? 'Activer la synchronisation' : 'Sauvegarder en ligne'}
                </button>
              </div>

              {backupResult === 'ok' && (
                <p className="reset-done">
                  <Check size={15} strokeWidth={2} />
                  Synchronisation activée.
                </p>
              )}
              {backupResult && backupResult !== 'ok' && <p className="settings-error">{backupResult}</p>}
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
            cet appareil. Si ce profil a une sauvegarde en ligne, entre son code à 4 chiffres pour confirmer — sinon,
            laisse le champ vide.
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
              <div className="pin-row">
                <input
                  type="text"
                  inputMode="numeric"
                  pattern="[0-9]*"
                  maxLength={4}
                  placeholder="Code à 4 chiffres (si sauvegardé)"
                  className="pin-input"
                  value={deletePin}
                  onChange={(e) => {
                    setDeletePin(e.target.value.replace(/\D/g, '').slice(0, 4))
                    setDeleteError(null)
                  }}
                />
              </div>
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
