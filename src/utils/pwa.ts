// Vrai uniquement quand l'appli tourne en mode autonome (lancée depuis une
// icône ajoutée à l'écran d'accueil), pas dans un onglet Safari/Chrome
// normal — `navigator.standalone` est la propriété historique iOS,
// `display-mode: standalone` la version standard (aussi supportée par iOS
// 16.4+ et Android). Sert à éviter tout rechargement complet forcé
// (`window.location.reload()`) en mode autonome : sur iOS, un tel
// rechargement fait perdre le mode plein écran et rouvre l'appli dans un
// onglet Safari classique avec barre d'adresse (signalé par
// l'utilisatrice : "au début je ne vois pas les bords, et quand je clique
// sur des boutons les bords apparaissent") — un rechargement complet reste
// en revanche inoffensif dans un onglet de navigateur normal, où il n'y a
// pas de mode plein écran à perdre.
export function isStandalonePwa(): boolean {
  if (typeof window === 'undefined') return false
  const nav = window.navigator as Navigator & { standalone?: boolean }
  return nav.standalone === true || window.matchMedia?.('(display-mode: standalone)')?.matches === true
}
