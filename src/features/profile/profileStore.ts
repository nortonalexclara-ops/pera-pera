import { create } from 'zustand'

interface ProfileState {
  activeProfileId: string | null
  activeProfileName: string | null
  activeProfileColorIndex: number | null
  setActiveProfile: (id: string, name: string, colorIndex: number) => void
  clearActiveProfile: () => void
}

// Le PROFIL ACTIF reste volontairement en mémoire seulement (pas de
// persist middleware) — redemander "qui apprend ?" à chaque ouverture est
// un choix produit assumé (voir ProfileSelector), pas une limitation
// technique. Les profils eux-mêmes (liste, création) et leurs données
// (maîtrise) sont bien persistés depuis IndexedDB — voir `src/db/`.
export const useProfileStore = create<ProfileState>((set) => ({
  activeProfileId: null,
  activeProfileName: null,
  activeProfileColorIndex: null,
  setActiveProfile: (id, name, colorIndex) =>
    set({ activeProfileId: id, activeProfileName: name, activeProfileColorIndex: colorIndex }),
  // Utilisé après suppression du profil actif (voir Settings.tsx) — le
  // profil n'existe plus, on ne peut pas juste laisser l'ancien id en
  // mémoire le temps de retourner à l'écran de sélection.
  clearActiveProfile: () => set({ activeProfileId: null, activeProfileName: null, activeProfileColorIndex: null }),
}))
