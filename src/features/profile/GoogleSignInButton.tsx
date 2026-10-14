import { useEffect, useRef, useState } from 'react'
import GoogleIcon from '../../components/ui/GoogleIcon'
import { isStandalonePwa } from '../../utils/pwa'
import { signInWithGoogle, signInWithGoogleIdToken } from './emailAuth'
import { GOOGLE_CLIENT_ID, createNonce, loadGoogleIdentityScript } from './googleIdentity'

type Mode = 'loading' | 'gis' | 'redirect'

interface GoogleSignInButtonProps {
  // Appelé juste avant de confier la connexion à Supabase (poser ici le
  // marqueur "en attente" lu par useEmailAuthLink.ts, passer en "occupé").
  onStart: () => void
  // Appelé si la connexion échoue : retirer le marqueur posé par onStart.
  onError: (message: string) => void
  disabled?: boolean
}

// Bouton "Continuer avec Google". Deux façons de faire la même chose :
//  - bouton Google intégré à la page (Google Identity Services, voir
//    googleIdentity.ts) : le choix du compte annonce le nom de l'appli
//    plutôt que l'adresse technique de Supabase ;
//  - redirection classique via Supabase (voir emailAuth.ts) : marche
//    partout, mais affiche cette adresse technique.
// La redirection reste utilisée quand le bouton intégré ne peut pas l'être :
// pas d'identifiant client configuré, script Google injoignable, ou appli
// installée sur l'écran d'accueil (la fenêtre de choix de compte de Google
// ne s'ouvre pas de façon fiable depuis une appli iOS installée).
export default function GoogleSignInButton({ onStart, onError, disabled }: GoogleSignInButtonProps) {
  const [mode, setMode] = useState<Mode>(() =>
    !GOOGLE_CLIENT_ID || isStandalonePwa() ? 'redirect' : 'loading',
  )
  const containerRef = useRef<HTMLDivElement>(null)
  // Les rappels du parent changent à chaque rendu : on les lit via des refs
  // pour ne pas ré-initialiser le bouton Google (et sa fenêtre) à chaque
  // frappe dans les champs voisins.
  const onStartRef = useRef(onStart)
  const onErrorRef = useRef(onError)
  onStartRef.current = onStart
  onErrorRef.current = onError

  useEffect(() => {
    if (mode !== 'loading') return
    let cancelled = false
    loadGoogleIdentityScript()
      .then(() => {
        if (!cancelled) setMode('gis')
      })
      .catch(() => {
        if (!cancelled) setMode('redirect')
      })
    return () => {
      cancelled = true
    }
  }, [mode])

  useEffect(() => {
    const clientId = GOOGLE_CLIENT_ID
    if (mode !== 'gis' || !clientId) return
    const container = containerRef.current
    const gsi = window.google?.accounts.id
    if (!container || !gsi) return
    let cancelled = false
    createNonce().then(({ raw, hashed }) => {
      if (cancelled) return
      gsi.initialize({
        client_id: clientId,
        nonce: hashed,
        callback: async ({ credential }) => {
          onStartRef.current()
          try {
            await signInWithGoogleIdToken(credential, raw)
          } catch (err) {
            onErrorRef.current(err instanceof Error ? err.message : 'Échec de la connexion Google.')
          }
        },
      })
      // Google impose une largeur en pixels, entre 200 et 400.
      const width = Math.min(400, Math.max(200, Math.round(container.clientWidth)))
      gsi.renderButton(container, {
        type: 'standard',
        theme: 'outline',
        size: 'large',
        text: 'continue_with',
        shape: 'rectangular',
        logo_alignment: 'center',
        locale: 'fr',
        width,
      })
    })
    return () => {
      cancelled = true
    }
  }, [mode])

  async function handleRedirectClick() {
    onStart()
    try {
      await signInWithGoogle()
    } catch (err) {
      onError(err instanceof Error ? err.message : 'Échec de la connexion Google.')
    }
  }

  // Pendant le chargement du script, le bouton par redirection reste
  // utilisable plutôt qu'un trou dans la page.
  if (mode === 'gis') {
    return <div ref={containerRef} className={`auth-google-gis${disabled ? ' is-disabled' : ''}`} />
  }
  return (
    <button type="button" className="auth-google-btn" onClick={handleRedirectClick} disabled={disabled}>
      <GoogleIcon />
      Continuer avec Google
    </button>
  )
}
