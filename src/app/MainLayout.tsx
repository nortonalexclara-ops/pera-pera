import { useEffect, useRef } from 'react'
import { NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom'
import { Home, BookOpen, ScanSearch, StickyNote, BarChart3, Settings, Sun, Moon, Type } from 'lucide-react'
import { useProfileStore } from '../features/profile/profileStore'
import { avatarGradients } from '../features/profile/mockProfiles'
import { useThemeStore } from '../features/theme/themeStore'
import './MainLayout.css'

const TABS = [
  { to: '/dashboard', label: 'Dashboard', icon: Home },
  { to: '/explorer', label: 'Explorer', icon: BookOpen },
  { to: '/kana', label: 'Kana', icon: Type },
  { to: '/notebook', label: 'Kanji', icon: ScanSearch },
  { to: '/notes', label: 'Notes', icon: StickyNote },
  { to: '/stats', label: 'Stats', icon: BarChart3 },
  { to: '/settings', label: 'Réglages', icon: Settings },
]

export default function MainLayout() {
  const navigate = useNavigate()
  const location = useLocation()
  const contentRef = useRef<HTMLElement>(null)
  const activeProfileName = useProfileStore((s) => s.activeProfileName)
  const activeProfileColorIndex = useProfileStore((s) => s.activeProfileColorIndex)
  const [from, to] = avatarGradients[(activeProfileColorIndex ?? 0) % avatarGradients.length]
  const theme = useThemeStore((s) => s.theme)
  const toggleTheme = useThemeStore((s) => s.toggleTheme)

  // Signalé sur iPhone : en changeant de page (ex. vers Reconnaissance de
  // kanji), on arrivait parfois déjà scrollé en bas de la nouvelle page
  // (le texte du haut hors champ) au lieu de démarrer en haut. `<Outlet/>`
  // change le contenu DANS le même `<main>` sans jamais réinitialiser le
  // défilement tout seul. `.main-layout` n'a qu'un `min-height: 100vh`
  // (pas de hauteur fixe) : sur une page dont le contenu dépasse l'écran,
  // c'est la fenêtre elle-même qui défile (`window`/`document`), pas
  // `.main-layout__content` (son `overflow-y: auto` ne s'active jamais
  // vraiment puisque sa hauteur grandit avec son contenu). On réinitialise
  // donc le scroll de la fenêtre — et, par précaution, celui du conteneur
  // lui-même au cas où une page future serait mise en page différemment.
  useEffect(() => {
    window.scrollTo(0, 0)
    contentRef.current?.scrollTo(0, 0)
  }, [location.pathname])

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

      <main className="main-layout__content" ref={contentRef}>
        <Outlet />
      </main>
    </div>
  )
}
