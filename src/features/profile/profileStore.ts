import { create } from 'zustand'
import { getProfile } from '../../db/profiles'

interface ProfileState {
  activeProfileId: string | null
  activeProfileName: string | null
  activeProfileColorIndex: number | null
  setActiveProfile: (id: string, name: string, colorIndex: number) => void
  clearActiveProfile: () => void
}

// Signalé par l'utilisatrice : rafraîchir la page sur Stats (ou n'importe
// quel autre écran) la ramenait sur un profil vide/inconnu au lieu de
// rester sur le sien — le profil actif n'était gardé qu'en mémoire, donc
// perdu à chaque vrai rechargement. Mis en cache dans localStorage pour
// survivre au rafraîchissement, MAIS jamais fait confiance tel quel :
// restoreActiveProfileFromStorage (plus bas) revérifie systématiquement
// que le profil existe encore dans IndexedDB avant de l'activer. Cette
// vérification est ce qui évite de retomber dans le bug précédent (voir
// main.tsx, restauration bfcache Safari) où un profil supprimé entre-
// temps réapparaissait comme actif — ici, un id caché qui ne correspond
// plus à rien de réel est silencieusement ignoré, jamais réutilisé.
const STORAGE_KEY = 'pera-pera:active-profile'

interface CachedProfile {
  id: string
  name: string
  colorIndex: number
}

function readCache(): CachedProfile | null {
  const raw = localStorage.getItem(STORAGE_KEY)
  if (!raw) return null
  try {
    return JSON.parse(raw) as CachedProfile
  } catch {
    localStorage.removeItem(STORAGE_KEY)
    return null
  }
}

function writeCache(id: string, name: string, colorIndex: number) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify({ id, name, colorIndex }))
}

function clearCache() {
  localStorage.removeItem(STORAGE_KEY)
}

export const useProfileStore = create<ProfileState>((set) => ({
  activeProfileId: null,
  activeProfileName: null,
  activeProfileColorIndex: null,
  setActiveProfile: (id, name, colorIndex) => {
    writeCache(id, name, colorIndex)
    set({ activeProfileId: id, activeProfileName: name, activeProfileColorIndex: colorIndex })
  },
  // Utilisé après suppression du profil actif (voir Settings.tsx) — le
  // profil n'existe plus, on ne peut pas juste laisser l'ancien id en
  // mémoire (ni en cache) le temps de retourner à l'écran de sélection.
  clearActiveProfile: () => {
    clearCache()
    set({ activeProfileId: null, activeProfileName: null, activeProfileColorIndex: null })
  },
}))

// Appelé une fois au démarrage de l'app (voir App.tsx), avant le premier
// rendu des routes : relit le profil mis en cache, vérifie qu'il existe
// toujours réellement (voir getProfile, db/profiles.ts) et ne l'active
// que dans ce cas — sinon le cache est purgé et l'app démarre normalement
// sur l'écran de sélection, exactement comme sur un appareil sans cache.
export async function restoreActiveProfileFromStorage(): Promise<void> {
  const cached = readCache()
  if (!cached) return
  const record = await getProfile(cached.id)
  if (!record) {
    clearCache()
    return
  }
  useProfileStore.getState().setActiveProfile(record.id, record.name, record.colorIndex)
}
