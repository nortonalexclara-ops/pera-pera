// Options volontairement qualitatives — jamais de quota chiffré ici,
// conformément à la philosophie "pas de nombre imposé" de la séance
// personnalisée. Boutons à choix simples, esprit Anki : pas de listes
// déroulantes.

export const LEVEL_OPTIONS = ['N5', 'N4', 'N3', 'N2', 'N1']

// "Nouveaux" ou "Mélange" pour chaque module. Pas de réglage de priorité
// séparé : quand "Mélange" est choisi, l'app privilégie implicitement les
// éléments difficiles à retenir (comportement interne, pas une option
// affichée).
export const CONTENT_OPTIONS = ['Nouveaux', 'Mélange']

// "Nouveaux" = pas encore coché "Maîtrisé" par le profil actif ;
// "Mélange" = tout le contenu du niveau, maîtrisé ou non (il n'y a pas de
// signal de difficulté par item à ce stade — juste maîtrisé/pas maîtrisé —
// donc "Mélange" ne peut pas encore vraiment prioriser le "difficile à
// retenir", il montre simplement tout).
export const CONTENT_TO_MODE: Record<string, 'new' | 'mix'> = {
  Nouveaux: 'new',
  Mélange: 'mix',
}

export const VOCAB_TYPE_OPTIONS = ['Noms', 'Verbes', 'Adjectifs', 'Expressions']
