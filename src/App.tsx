import { useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './app/MainLayout'
import ProfileSelector from './features/profile/ProfileSelector'
import Dashboard from './features/dashboard/Dashboard'
import Explorer from './features/explorer/Explorer'
import Notebook from './features/notebook/Notebook'
import NotesList from './features/notes/NotesList'
import NoteEditor from './features/notes/NoteEditor'
import StatsScreen from './features/stats/StatsScreen'
import Settings from './features/settings/Settings'
import SessionFlow from './features/kanji/SessionFlow'
import TestKnowledge from './features/test/TestKnowledge'
import { useThemeStore } from './features/theme/themeStore'

// Écrans "plein écran" (sans barre de navigation) : sélection de profil,
// séance guidée, entraînement libre — cohérent avec le diagramme de
// navigation validé en V3.
export default function App() {
  const theme = useThemeStore((s) => s.theme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  return (
    <Routes>
      <Route path="/" element={<ProfileSelector />} />
      <Route path="/session" element={<SessionFlow />} />
      <Route path="/session/test" element={<TestKnowledge />} />

      {/* Écrans accessibles depuis la barre d'onglets */}
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/explorer" element={<Explorer />} />
        <Route path="/notebook" element={<Notebook />} />
        <Route path="/notes" element={<NotesList />} />
        <Route path="/notes/:id" element={<NoteEditor />} />
        <Route path="/stats" element={<StatsScreen />} />
        <Route path="/settings" element={<Settings />} />
      </Route>

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
