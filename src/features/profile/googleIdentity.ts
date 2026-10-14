// Connexion Google "directe" (Google Identity Services, sans redirection) :
// un petit bouton Google s'affiche dans la page, et le choix du compte se
// fait dans une fenêtre qui annonce le nom de l'APPLI (pera-pera-eight.
// vercel.app) au lieu de l'adresse technique du serveur Supabase (la longue
// suite de caractères en .supabase.co qu'affiche la redirection classique,
// voir emailAuth.ts signInWithGoogle). Le jeton reçu est ensuite remis à
// Supabase (signInWithGoogleIdToken, emailAuth.ts).

// Juste ce qu'on utilise de l'API Google — pas de paquet de types à
// installer pour si peu.
interface GoogleCredentialResponse {
  credential: string
}

interface GoogleButtonConfig {
  type?: 'standard' | 'icon'
  theme?: 'outline' | 'filled_blue' | 'filled_black'
  size?: 'large' | 'medium' | 'small'
  text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin'
  shape?: 'rectangular' | 'pill'
  logo_alignment?: 'left' | 'center'
  width?: number
  locale?: string
}

interface GoogleAccountsId {
  initialize: (config: {
    client_id: string
    callback: (response: GoogleCredentialResponse) => void
    nonce?: string
    use_fedcm_for_prompt?: boolean
    ux_mode?: 'popup' | 'redirect'
  }) => void
  renderButton: (parent: HTMLElement, config: GoogleButtonConfig) => void
}

declare global {
  interface Window {
    google?: { accounts: { id: GoogleAccountsId } }
  }
}

const GIS_SCRIPT_SRC = 'https://accounts.google.com/gsi/client'

// Identifiant client "Web" créé dans Google Cloud — public par nature (il
// apparaît dans toute page qui affiche un bouton Google), contrairement au
// secret client, qui lui reste uniquement côté Supabase.
export const GOOGLE_CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID as string | undefined

let scriptPromise: Promise<void> | null = null

// Charge le script Google une seule fois pour toute la session. Rejette si
// le chargement échoue (hors-ligne, bloqueur de pub...) — l'appelant retombe
// alors sur la connexion par redirection, qui marche sans ce script.
export function loadGoogleIdentityScript(): Promise<void> {
  if (window.google?.accounts?.id) return Promise.resolve()
  if (scriptPromise) return scriptPromise
  scriptPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script')
    script.src = GIS_SCRIPT_SRC
    script.async = true
    script.onload = () => resolve()
    script.onerror = () => {
      scriptPromise = null
      script.remove()
      reject(new Error('Script Google indisponible.'))
    }
    document.head.appendChild(script)
  })
  return scriptPromise
}

function toHex(bytes: Uint8Array): string {
  return Array.from(bytes, (b) => b.toString(16).padStart(2, '0')).join('')
}

// Supabase vérifie que le jeton Google a bien été demandé POUR cette
// connexion-ci (protection contre le rejeu d'un vieux jeton) : on garde le
// nonce brut pour Supabase, et on donne à Google son empreinte SHA-256 —
// c'est ce couple précis qu'il attend (voir signInWithGoogleIdToken).
export async function createNonce(): Promise<{ raw: string; hashed: string }> {
  const raw = toHex(crypto.getRandomValues(new Uint8Array(16)))
  const digest = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(raw))
  return { raw, hashed: toHex(new Uint8Array(digest)) }
}
