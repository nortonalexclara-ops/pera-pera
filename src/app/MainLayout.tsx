import { NavLink, Outlet, useNavigate } from 'react-router-dom'
import { Home, BookOpen, PenLine, StickyNote, BarChart3, Settings, Sun, Moon } from 'lucide-react'
import { useProfileStore } from '../features/profile/profileStore'
import { avatarGradients } from '../features/profile/mockProfiles'
import { useThemeStore } from '../features/theme/themeStore'
import './MainLayout.css'

const TABS = [
  { to: '/dashboard', label: 'Dashboard', icon: Home },
  { to: '/explorer', label: 'Explorer', icon: BookOpen },
  { to: '/notebook', label: 'Cahier', icon: PenLine },
  { to: '/notes', label: 'Notes', icon: StickyNote },
  { to: '/stats', label: 'Stats', icon: BarChart3 },
  { to: '/settings', label: 'Réglages', icon: Settings },
]

export default function MainLayout() {
  const navigate = useNavigate()
  const activeProfileName = useProfileStore((s) => s.activeProfileName)
  const activeProfileColorIndex = useProfileStore((s) => s.activeProfileColorIndex)
  const [from, to] = avatarGradients[(activeProfileColorIndex ?? 0) % avatarGradients.length]
  const theme = useThemeStore((s) => s.theme)
  const toggleTheme = useThemeStore((s) => s.toggleTheme)

  return (
    <div className="main-layout">
      <nav className="tab-bar" aria-label="Navigation principale">
        <button
          className="tab-bar__profile"
          onClick={() => navigate('/')}
          title="Changer de profil"
        >
          <span
            className="tab-bar__avatar"
            style={{ background: `linear-gradient(135deg, ${from}, ${to})` }}
          >
            {activeProfileName?.charAt(0).toUpperCase() ?? '?'}
          </span>
        </button>

        <button
          className="tab-bar__theme"
          onClick={toggleTheme}
          title={theme === 'light' ? 'Passer en thème sombre' : 'Passer en thème clair'}
        >
          {theme === 'light' ? <Moon size={18} strokeWidth={1.75} /> : <Sun size={18} strokeWidth={1.75} />}
        </button>

        {TABS.map(({ to: path, label, icon: Icon }) => (
          <NavLink
            key={path}
            to={path}
            className={({ isActive }) => `tab-item${isActive ? ' active' : ''}`}
          >
            <Icon size={22} strokeWidth={1.75} />
            <span>{label}</span>
          </NavLink>
        ))}
      </nav>

      <main className="main-layout__content">
        <Outlet />
      </main>
    </div>
  )
}
