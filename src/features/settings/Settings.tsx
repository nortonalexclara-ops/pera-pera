import { useState } from 'react'
import { motion } from 'framer-motion'
import { Trash2, Check, AlertTriangle, CloudUpload } from 'lucide-react'
import PageTransition from '../../components/ui/PageTransition'
import AmbientGlow from '../../components/ui/AmbientGlow'
import { useProfileStore } from '../profile/profileStore'
import { resetMastery } from '../../db/mastery'
import { resetActivity } from '../../db/activity'
import { resetNotes } from '../../db/notes'
import { exportProfileData } from '../../db/profileSync'
import { backupProfile } from '../profile/cloudSync'
import type { ItemKind } from '../../db/db'
import './Settings.css'

type ResetOption = 'kanji' | 'vocab' | 'grammar' | 'streak' | 'notes'

const RESET_OPTIONS: { key: ResetOption; label: string; description: string }[] = [
  { key: 'kanji', label: 'Progression Kanjis', description: 'Retire "Maîtrisé" de tous les kanjis de ce profil.' },
  { key: 'vocab', label: 'Progression Vocabulaire', description: 'Retire "Maîtrisé" de tous les mots de ce profil.' },
  { key: 'grammar', label: 'Progression Grammaire', description: 'Retire "Maîtrisé" de tous les points de grammaire de ce profil.' },
  { key: 'streak', label: 'Série (jours de suite)', description: 'Remet le compteur "jours de suite" à zéro.' },
  { key: 'notes', label: 'Notes personnelles', description: 'Supprime toutes les notes du Cahier de notes.' },
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
  const profileId = useProfileStore((s) => s.activeProfileId)
  const profileName = useProfileStore((s) => s.activeProfileName)
  const [selected, setSelected] = useState<Set<ResetOption>>(new Set())
  const [confirming, setConfirming] = useState(false)
  const [done, setDone] = useState(false)
  const [busy, setBusy] = useState(false)

  const [pin, setPin] = useState('')
  const [backupBusy, setBackupBusy] = useState(false)
  const [backupResult, setBackupResult] = useState<'ok' | string | null>(null)

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
    if (kinds.length > 0) await resetMastery(profileId, kinds)
    if (selected.has('streak')) await resetActivity(profileId)
    if (selected.has('notes')) await resetNotes(profileId)
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
      setBackupResult('ok')
    } catch (err) {
      setBackupResult(err instanceof Error ? err.message : 'Échec de la sauvegarde.')
    } finally {
      setBackupBusy(false)
    }
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
          <h2 className="settings-card__title">Retrouver mon profil sur un autre appareil</h2>
          <p className="settings-card__hint">
            Choisis un code à 4 chiffres pour {profileName ?? 'ce profil'}, puis sauvegarde. Sur l'autre appareil, choisis
            "Récupérer un profil" depuis l'écran de sélection, avec le même nom et le même code.
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
              {backupBusy ? 'Sauvegarde…' : 'Sauvegarder en ligne'}
            </button>
          </div>

          {backupResult === 'ok' && (
            <p className="reset-done">
              <Check size={15} strokeWidth={2} />
              Profil sauvegardé — utilise ce nom et ce code sur l'autre appareil.
            </p>
          )}
          {backupResult && backupResult !== 'ok' && <p className="settings-error">{backupResult}</p>}
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
      </div>
    </PageTransition>
  )
}
