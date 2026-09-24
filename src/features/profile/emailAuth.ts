import { supabase } from '../../lib/supabaseClient'

// Filets de sécurité pour le SEUL cas qui reste asynchrone/multi-page dans
// la connexion par email : une création de compte qui exige une
// confirmation par email avant de pouvoir se connecter (voir
// signUpWithPassword ci-dessous, et useEmailAuthLink.ts qui les consomme).
// La connexion à un compte déjà confirmé, elle, est directe/synchrone —
// pas besoin de ces marqueurs dans ce cas (voir ProfileSelector.tsx/
// Settings.tsx).
const PENDING_LINK_KEY = 'pera-pera-pending-email-link'
const PENDING_SIGNUP_KEY = 'pera-pera-pending-email-signup'

export function setPendingEmailLinkProfileId(profileId: string): void {
  localStorage.setItem(PENDING_LINK_KEY, profileId)
}

export function consumePendingEmailLinkProfileId(): string | null {
  const value = localStorage.getItem(PENDING_LINK_KEY)
  if (value) localStorage.removeItem(PENDING_LINK_KEY)
  return value
}

export function setPendingEmailSignup(name: string): void {
  localStorage.setItem(PENDING_SIGNUP_KEY, name)
}

export function consumePendingEmailSignup(): string | null {
  const value = localStorage.getItem(PENDING_SIGNUP_KEY)
  if (value) localStorage.removeItem(PENDING_SIGNUP_KEY)
  return value
}

// `needsConfirmation` vrai si Supabase exige de cliquer un lien de
// confirmation reçu par email avant de pouvoir se connecter (réglage par
// défaut d'un projet Supabase) — dans ce cas, aucune session n'est établie
// tout de suite, la création du profil local attendra ce clic (voir
// useEmailAuthLink.ts). Si `needsConfirmation` est faux, la session est
// déjà active à cet instant, exactement comme après signInWithPassword.
export async function signUpWithPassword(email: string, password: string): Promise<{ needsConfirmation: boolean }> {
  if (!supabase) throw new Error('Connexion par email indisponible.')
  const { data, error } = await supabase.auth.signUp({ email, password })
  if (error) {
    throw new Error(/already registered|already exists/i.test(error.message) ? 'Un compte existe déjà avec cet email.' : error.message)
  }
  return { needsConfirmation: !data.session }
}

export async function signInWithPassword(email: string, password: string): Promise<void> {
  if (!supabase) throw new Error('Connexion par email indisponible.')
  const { error } = await supabase.auth.signInWithPassword({ email, password })
  if (error) throw new Error('Email ou mot de passe incorrect.')
}

export async function sendPasswordResetEmail(email: string): Promise<void> {
  if (!supabase) throw new Error('Connexion par email indisponible.')
  const { error } = await supabase.auth.resetPasswordForEmail(email, {
    redirectTo: `${window.location.origin}/reset-password`,
  })
  if (error) throw new Error(error.message)
}

export async function updatePassword(newPassword: string): Promise<void> {
  if (!supabase) throw new Error('Connexion par email indisponible.')
  const { error } = await supabase.auth.updateUser({ password: newPassword })
  if (error) throw new Error(error.message)
}

// Contrairement à signIn/signUp par mot de passe, cet appel ne "résout"
// jamais vraiment ici — il fait quitter la page tout de suite vers
// l'écran de consentement Google, puis Supabase ramène sur `redirectTo`
// une fois connecté (voir useEmailAuthLink.ts, qui prend le relais avec
// le marqueur posé juste avant l'appel côté ProfileSelector.tsx/
// Settings.tsx — même mécanisme que pour la confirmation par email).
export async function signInWithGoogle(): Promise<void> {
  if (!supabase) throw new Error('Connexion par Google indisponible.')
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: { redirectTo: `${window.location.origin}/` },
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
