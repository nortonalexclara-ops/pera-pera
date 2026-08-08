// Options volontairement qualitatives — jamais de quota chiffré ici,
// conformément à la philosophie "pas de nombre imposé" de la séance
// personnalisée. Boutons à choix simples, esprit Anki : pas de listes
// déroulantes.

export const LEVEL_OPTIONS = ['N5', 'N4', 'N3', 'N2', 'N1']

// "Nouveaux", "À revoir" ou "Mélange" pour chaque module (ordre demandé
// par l'utilisatrice). Pas de réglage de priorité séparé : quand
// "Mélange" est choisi, l'app privilégie implicitement les éléments
// difficiles à retenir (comportement interne, pas une option affichée).
export const CONTENT_OPTIONS = ['Nouveaux', 'À revoir', 'Mélange']

// Sélection pré-cochée à l'ouverture des écrans de séance personnalisée
// (CustomSessionBuilder, KanaSetup) — nommée explicitement plutôt que
// `CONTENT_OPTIONS[1]` : un index se retrouve silencieusement faux dès que
// l'ordre du tableau ci-dessus change (déjà arrivé une fois : le
// réordonnancement pour la demande utilisatrice ci-dessus avait fait
// glisser la présélection par défaut de "Mélange" vers "À revoir" sans
// qu'aucun code ne le signale).
export const DEFAULT_CONTENT_OPTION = 'Mélange'

// "Nouveaux" = jamais classé ni "Maîtrisé" ni "À revoir" par le profil
// actif (voir MasteryRecord/ReviewMarkRecord, db.ts) ; "À revoir" =
// uniquement les cartes explicitement marquées "À revoir" la dernière
// fois qu'elles ont été vues — demande explicite de l'utilisatrice,
// distinct de "Nouveaux" qui ne doit PLUS inclure ce qui a déjà été vu et
// mis "à revoir" ; "Mélange" = tout le contenu du niveau, maîtrisé ou non
// (il n'y a pas de signal de difficulté par item à ce stade — juste
// maîtrisé/pas maîtrisé — donc "Mélange" ne peut pas encore vraiment
// prioriser le "difficile à retenir", il montre simplement tout).
export const CONTENT_TO_MODE: Record<string, 'new' | 'mix' | 'review'> = {
  Nouveaux: 'new',
  Mélange: 'mix',
  'À revoir': 'review',
}

export const VOCAB_TYPE_OPTIONS = ['Noms', 'Verbes', 'Adjectifs', 'Expressions']
