import { create } from 'zustand'

export type Theme = 'light' | 'dark'

function getSystemTheme(): Theme {
  if (typeof window === 'undefined' || !window.matchMedia) return 'light'
  return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'
}

interface ThemeState {
  theme: Theme
  toggleTheme: () => void
}

// En mémoire uniquement pour l'instant (pas de storage) : le choix ne
// survit pas à un rechargement de page tant que la persistance réelle
// n'existe pas. Initialisé sur la préférence système au démarrage.
export const useThemeStore = create<ThemeState>((set) => ({
  theme: getSystemTheme(),
  toggleTheme: () => set((s) => ({ theme: s.theme === 'light' ? 'dark' : 'light' })),
}))
