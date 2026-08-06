import { Volume2 } from 'lucide-react'
import { isSpeechSupported, speakJapaneseSequence } from '../../utils/speech'

interface SpeakButtonProps {
  // Texte à lire (kana/kanji) — jamais le texte affiché tel quel s'il
  // contient de la romanisation entre parenthèses, voir toSpokenKanjiReading.
  // Un tableau lit plusieurs lectures à la suite (ex. tous les on'yomi
  // d'un kanji) en une seule pression.
  text: string | string[]
  label?: string
  className?: string
}

/**
 * Bouton "écouter la prononciation", réutilisé partout où un mot/une
 * lecture japonaise est affiché (Explorer, dos des cartes de séance).
 * `stopPropagation` systématique : ce bouton apparaît presque toujours à
 * l'intérieur d'un élément cliquable plus large (ligne Explorer, bascule
 * "révéler" d'une carte) — un tap dessus ne doit déclencher QUE la
 * lecture audio, pas l'action du parent. Ne se rend pas du tout si la
 * synthèse vocale n'est pas disponible plutôt que d'afficher un bouton
 * mort.
 *
 * `<span role="button">` plutôt qu'un vrai `<button>` : dans Explorer, ce
 * composant est nichée à l'intérieur du `<button>` de toute la ligne
 * (déplier la fiche) — un `<button>` imbriqué dans un autre `<button>`
 * est invalide en HTML et se comporte de façon incohérente d'un
 * navigateur à l'autre. Même motif déjà utilisé par les icônes
 * favori/entraînement de la ligne Explorer, pour la même raison.
 */
export default function SpeakButton({ text, label = 'Écouter la prononciation', className = '' }: SpeakButtonProps) {
  const texts = Array.isArray(text) ? text : [text]
  if (!isSpeechSupported() || !texts.some((t) => t.trim())) return null
  return (
    <span
      role="button"
      tabIndex={0}
      className={`speak-btn ${className}`.trim()}
      title={label}
      aria-label={label}
      onClick={(e) => {
        e.stopPropagation()
        speakJapaneseSequence(texts)
      }}
    >
      <Volume2 size={15} strokeWidth={1.75} />
    </span>
  )
}
