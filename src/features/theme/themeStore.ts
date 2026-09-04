import { create } from 'zustand'

export type Theme = 'light' | 'dark'

const STORAGE_KEY = 'pera-pera:theme'

function getSystemTheme(): Theme {
  if (typeof window === 'undefined' || !window.matchMedia) return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

// Le réglage vit maintenant dans Réglages (voir Settings.tsx) plutôt que
// dans un bouton de la barre de navigation — un choix fait là mérite de
// survivre à un rechargement, contrairement au bouton précédent où
// l'absence de persistance passait inaperçue (retoucher était aussi
// rapide que retrouver le réglage).
function getInitialTheme(): Theme {
  if (typeof window === 'undefined') return 'light'
  const stored = window.localStorage.getItem(STORAGE_KEY)
  return stored === 'light' || stored === 'dark' ? stored : getSystemTheme()
}

interface ThemeState {
  theme: Theme
  setTheme: (theme: Theme) => void
}

export const useThemeStore = create<ThemeState>((set) => ({
  theme: getInitialTheme(),
  setTheme: (theme) => {
    window.localStorage.setItem(STORAGE_KEY, theme)
    set({ theme })
  },
}))
