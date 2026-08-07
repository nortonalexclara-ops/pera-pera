// Options volontairement qualitatives — jamais de quota chiffré ici,
// conformément à la philosophie "pas de nombre imposé" de la séance
// personnalisée. Boutons à choix simples, esprit Anki : pas de listes
// déroulantes.

export const LEVEL_OPTIONS = ['N5', 'N4', 'N3', 'N2', 'N1']

// "Nouveaux", "Mélange" ou "À revoir" pour chaque module. Pas de réglage
// de priorité séparé : quand "Mélange" est choisi, l'app privilégie
// implicitement les éléments difficiles à retenir (comportement interne,
// pas une option affichée).
export const CONTENT_OPTIONS = ['Nouveaux', 'Mélange', 'À revoir']

// "Nouveaux" = pas encore coché "Maîtrisé" par le profil actif ;
// "Mélange" = tout le contenu du niveau, maîtrisé ou non (il n'y a pas de
// signal de difficulté par item à ce stade — juste maîtrisé/pas maîtrisé —
// donc "Mélange" ne peut pas encore vraiment prioriser le "difficile à
// retenir", il montre simplement tout) ; "À revoir" = uniquement les
// cartes explicitement marquées "À revoir" la dernière fois qu'elles ont
// été vues (voir ReviewMarkRecord, db.ts — demande explicite de
// l'utilisatrice, distinct de "Nouveaux" qui inclut aussi ce qui n'a
// encore jamais été vu).
export const CONTENT_TO_MODE: Record<string, 'new' | 'mix' | 'review'> = {
  Nouveaux: 'new',
  Mélange: 'mix',
  'À revoir': 'review',
}

export const VOCAB_TYPE_OPTIONS = ['Noms', 'Verbes', 'Adjectifs', 'Expressions']
