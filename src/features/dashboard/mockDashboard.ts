// Séance proposée automatiquement par l'app (mode "intelligent"). Les
// comptes (kanjiCount/vocabCount/grammarCount/reviewCount) sont désormais
// calculés en vrai dans Dashboard.tsx à partir de la maîtrise persistée du
// profil actif (voir SESSION_SIZE là-bas) — cette interface reste ici
// simplement comme contrat partagé avec RecommendedSessionPanel.
export interface RecommendedSession {
  kanjiCount: number
  vocabCount: number
  grammarCount: number
  reviewCount: number
  durationMinutes: number
}
