import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Check } from 'lucide-react'
import { getCurrentSession, updatePassword } from './emailAuth'
import AmbientGlow from '../../components/ui/AmbientGlow'
import PageTransition from '../../components/ui/PageTransition'
import './ProfileSelector.css'

// Atterrissage du lien "mot de passe oublié" reçu par email (voir
// emailAuth.ts, sendPasswordResetEmail) — Supabase établit une session de
// récupération automatiquement au chargement de cette page (même
// mécanisme de détection que pour la confirmation d'inscription, voir
// supabaseClient.ts, `detectSessionInUrl`), pas besoin de la demander
// nous-mêmes ici, juste vérifier qu'elle existe avant d'autoriser à
// changer le mot de passe.
export default function ResetPassword() {
  const navigate = useNavigate()
  const [status, setStatus] = useState<'checking' | 'ready' | 'invalid'>('checking')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [done, setDone] = useState(false)

  useEffect(() => {
    // Laisse un instant au client Supabase pour analyser l'URL et établir
    // la session de récupération avant de vérifier — sinon `getSession()`
    // appelé trop tôt peut ne rien trouver alors que le lien est valide.
    const timeout = setTimeout(async () => {
      const session = await getCurrentSession()
      setStatus(session ? 'ready' : 'invalid')
    }, 400)
    return () => clearTimeout(timeout)
  }, [])

  async function handleSubmit() {
    setError(null)
    if (password.length < 6) {
      setError('6 caractères minimum.')
      return
    }
    if (password !== confirmPassword) {
      setError('Les mots de passe ne correspondent pas.')
      return
    }
    setBusy(true)
    try {
      await updatePassword(password)
      setDone(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Échec de la mise à jour.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <PageTransition>
      <div className="profile-selector">
        <AmbientGlow top={-80} left="calc(50% - 210px)" size={420} />

        <div className="profile-selector__header">
          <h1 className="profile-selector__title">Nouveau mot de passe</h1>
          <p className="profile-selector__subtitle">
            {status === 'ready' && !done && 'Choisis un nouveau mot de passe pour ton compte.'}
          </p>
        </div>

        {status === 'checking' && <p className="profile-selector__subtitle">Vérification du lien…</p>}

        {status === 'invalid' && (
          <p className="profile-selector__error">
            Ce lien n'est plus valide ou a expiré — retourne sur l'écran d'accueil et redemande un lien.
          </p>
        )}

        {status === 'ready' && !done && (
          <div className="profile-selector__legacy-form card">
            <input
              type="password"
              className="profile-card__input"
              placeholder="Nouveau mot de passe"
              autoComplete="new-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <input
              type="password"
              className="profile-card__input"
              placeholder="Confirme le mot de passe"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
            />
            <div className="profile-selector__legacy-form-actions">
              <button type="button" className="btn-primary" onClick={handleSubmit} disabled={busy}>
                {busy ? 'Enregistrement…' : 'Enregistrer'}
              </button>
            </div>
            {error && <p className="profile-selector__error">{error}</p>}
          </div>
        )}

        {done && (
          <div className="profile-selector__legacy-form card">
            <p className="profile-card__warning" style={{ color: 'var(--color-success)' }}>
              <Check size={15} strokeWidth={2} /> Mot de passe mis à jour.
            </p>
            <button type="button" className="btn-primary" onClick={() => navigate('/')}>
              Continuer
            </button>
          </div>
        )}
      </div>
    </PageTransition>
  )
}
