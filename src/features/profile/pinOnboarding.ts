const KEY_PREFIX = 'pera-pera:pin-onboarding-pending:'

// Marqué juste après la création d'un TOUT NOUVEAU profil (jamais après une
// récupération — qui suppose déjà un code existant ailleurs) — consommé une
// seule fois au prochain passage sur le Dashboard (voir
// consumePinOnboardingFlag) pour afficher la fenêtre "protège ta
// progression" (voir PinOnboardingModal.tsx) au bon moment, une seule fois.
export function markPinOnboardingPending(profileId: string): void {
  localStorage.setItem(KEY_PREFIX + profileId, '1')
}

// Vrai seulement au tout premier appel pour ce profil — retiré aussitôt
// pour ne plus jamais redéclencher la fenêtre ensuite (y compris si
// l'utilisatrice choisit "Plus tard" : ça ne réapparaît qu'une fois, pas à
// chaque visite du Dashboard).
export function consumePinOnboardingFlag(profileId: string): boolean {
  const key = KEY_PREFIX + profileId
  const pending = localStorage.getItem(key) === '1'
  if (pending) localStorage.removeItem(key)
  return pending
}
