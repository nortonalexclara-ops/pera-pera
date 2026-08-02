import { create } from 'zustand'

interface ProfileState {
  activeProfileId: string | null
  activeProfileName: string | null
  activeProfileColorIndex: number | null
  setActiveProfile: (id: string, name: string, colorIndex: number) => void
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
}))
