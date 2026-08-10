import { useEffect, useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import MainLayout from './app/MainLayout'
import ProfileSelector from './features/profile/ProfileSelector'
import { restoreActiveProfileFromStorage } from './features/profile/profileStore'
import { useCloudSyncScheduler } from './features/profile/useCloudSyncScheduler'
import Dashboard from './features/dashboard/Dashboard'
import Explorer from './features/explorer/Explorer'
import Notebook from './features/notebook/Notebook'
import NotesList from './features/notes/NotesList'
import NoteEditor from './features/notes/NoteEditor'
import StatsScreen from './features/stats/StatsScreen'
import Settings from './features/settings/Settings'
import SessionFlow from './features/kanji/SessionFlow'
import TestKnowledge from './features/test/TestKnowledge'
import KanaSetup from './features/kana/KanaSetup'
import KanaSession from './features/kana/KanaSession'
import KanaTest from './features/kana/KanaTest'
import { useThemeStore } from './features/theme/themeStore'

// Écrans "plein écran" (sans barre de navigation) : sélection de profil,
// séance guidée, entraînement libre — cohérent avec le diagramme de
// navigation validé en V3.
export default function App() {
  const theme = useThemeStore((s) => s.theme)
  // Voir profileStore.ts : le profil actif est mis en cache pour survivre
  // à un rafraîchissement, mais toujours revérifié contre IndexedDB avant
  // d'être réactivé — les routes n'ont donc rien à afficher tant que
  // cette vérification (rapide, une seule lecture par id) n'est pas
  // passée, sous peine d'un flash "aucun profil" au chargement.
  const [profileReady, setProfileReady] = useState(false)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
  }, [theme])

  useEffect(() => {
    restoreActiveProfileFromStorage().finally(() => setProfileReady(true))
  }, [])

  // Synchro automatique en arrière-plan entre appareils (voir
  // cloudSyncEngine.ts) — monté ici plutôt que dans MainLayout.tsx : les
  // écrans plein écran de séance (hors MainLayout) sont justement là où
  // mastery/reviewMarks/timeSpent/activity s'écrivent le plus.
  useCloudSyncScheduler()

  if (!profileReady) return null

  return (
    <Routes>
      <Route path="/" element={<ProfileSelector />} />
      <Route path="/session" element={<SessionFlow />} />
      <Route path="/session/test" element={<TestKnowledge />} />
      <Route path="/session/kana" element={<KanaSession />} />
      <Route path="/session/kana/test" element={<KanaTest />} />

      {/* Écrans accessibles depuis la barre d'onglets */}
      <Route element={<MainLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/kana" element={<KanaSetup />} />
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
