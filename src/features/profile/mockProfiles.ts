export interface MockProfile {
  id: string
  name: string
  colorIndex: number
}

// Données fictives — remplacées plus tard par les profils réels stockés
// dans le registre de profils (jp-profiles-registry).
export const mockProfiles: MockProfile[] = [
  { id: 'p1', name: 'Alex', colorIndex: 0 },
  { id: 'p2', name: 'Camille', colorIndex: 1 },
]

// Chaque profil a une identité propre : un dégradé à deux tons parmi une
// palette restreinte, cohérente avec l'accent turquoise de l'app.
export const avatarGradients: [string, string][] = [
  ['#14a098', '#0c766f'],
  ['#f2994a', '#d9762b'],
  ['#8e7cc3', '#6c58a8'],
  ['#5b8c5a', '#3f6b3f'],
]
