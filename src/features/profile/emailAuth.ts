import { supabase } from '../../lib/supabaseClient'

// Clé localStorage posée juste avant l'envoi du lien magique (voir
// Settings.tsx handleSendMagicLink) — le clic sur le lien recharge
// l'appli dans un contexte JS tout neuf (nouvel onglet/navigation), donc
// le seul moyen de savoir "quel profil local voulait se connecter" est de
// le déposer ici avant de partir, puis de le relire une fois la session
// établie (voir useEmailAuthLink.ts).
const PENDING_LINK_KEY = 'pera-pera-pending-email-link'

export function setPendingEmailLinkProfileId(profileId: string): void {
  localStorage.setItem(PENDING_LINK_KEY, profileId)
}

export function consumePendingEmailLinkProfileId(): string | null {
  const value = localStorage.getItem(PENDING_LINK_KEY)
  if (value) localStorage.removeItem(PENDING_LINK_KEY)
  return value
}

// Même principe que PENDING_LINK_KEY, mais pour une connexion lancée
// depuis l'écran de sélection de profil (voir ProfileSelector.tsx) plutôt
// que depuis les Réglages d'un profil déjà créé — pas de profileId
// existant à retrouver ici puisqu'aucun profil local n'existe encore sur
// cet appareil (cas d'un nouvel appareil, ou d'une personne qui n'a pas
// encore créé de profil ici). Le nom saisi sert à créer le nouveau profil
// local une fois la connexion établie (voir useEmailAuthLink.ts) — écrasé
// par la progression récupérée si ce compte a déjà une sauvegarde, gardé
// tel quel sinon.
const PENDING_SIGNUP_KEY = 'pera-pera-pending-email-signup'

export function setPendingEmailSignup(name: string): void {
  localStorage.setItem(PENDING_SIGNUP_KEY, name)
}

export function consumePendingEmailSignup(): string | null {
  const value = localStorage.getItem(PENDING_SIGNUP_KEY)
  if (value) localStorage.removeItem(PENDING_SIGNUP_KEY)
  return value
}

export async function sendMagicLink(email: string): Promise<void> {
  if (!supabase) throw new Error('Connexion par email indisponible.')
  const { error } = await supabase.auth.signInWithOtp({
    email,
    options: { emailRedirectTo: `${window.location.origin}/` },
  })
  if (error) throw new Error(error.message)
}

export async function getCurrentSession() {
  if (!supabase) return null
  const { data } = await supabase.auth.getSession()
  return data.session
}

export async function signOutEmail(): Promise<void> {
  if (!supabase) return
  await supabase.auth.signOut()
}
