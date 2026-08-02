import { Settings } from 'lucide-react'
import PlaceholderScreen from '../../components/ui/PlaceholderScreen'

export default function SettingsPlaceholder() {
  return (
    <PlaceholderScreen
      icon={Settings}
      title="Paramètres"
      description="Profil, objectifs, types de questions activés, tags et gestion des données."
    />
  )
}
