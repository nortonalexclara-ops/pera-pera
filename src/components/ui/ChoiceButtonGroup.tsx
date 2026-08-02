interface ChoiceButtonGroupProps {
  options: string[]
  selected: string[]
  onToggle: (option: string) => void
}

/**
 * Rangée de boutons de choix — le comportement simple/multiple dépend
 * uniquement de la façon dont l'appelant met à jour `selected` :
 * remplacer la valeur (sélection unique) ou ajouter/retirer d'un
 * ensemble (sélection multiple). Le composant reste agnostique.
 */
export default function ChoiceButtonGroup({ options, selected, onToggle }: ChoiceButtonGroupProps) {
  return (
    <div className="choice-btn-group">
      {options.map((opt) => (
        <button
          key={opt}
          type="button"
          className={`choice-btn${selected.includes(opt) ? ' active' : ''}`}
          onClick={() => onToggle(opt)}
        >
          {opt}
        </button>
      ))}
    </div>
  )
}
