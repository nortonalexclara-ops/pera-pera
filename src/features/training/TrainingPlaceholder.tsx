import { Target } from 'lucide-react'
import FullScreenFlow from '../../components/ui/FullScreenFlow'

export default function TrainingPlaceholder() {
  return (
    <FullScreenFlow
      icon={Target}
      title="Entraînement libre"
      description="Choisis les types de questions et le nombre de cartes — sans aucun impact sur tes révisions FSRS."
    />
  )
}
