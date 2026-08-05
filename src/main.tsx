import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import './styles/tokens.css'
import './styles/global.css'

// Bug signalé : sur mobile (Safari iOS notamment), revenir sur l'onglet
// après l'avoir quitté (changement d'appli, geste "tirer pour
// rafraîchir"...) peut RESTAURER la page depuis le bfcache du navigateur
// au lieu de la recharger vraiment — la page reprend alors exactement
// l'état JS gelé au moment où elle a été mise en cache, y compris le
// profil actif en mémoire (`useProfileStore`, volontairement PAS
// persisté, voir profileStore.ts). Résultat : l'utilisatrice se
// retrouvait sur un ancien profil (ex. "Alex", actif à un moment donné
// avant d'être supprimé) au lieu de revenir à l'écran de sélection comme
// prévu — pas un bug applicatif (aucun code ne "choisit" un profil tout
// seul), un piège classique de bfcache pour toute SPA avec de l'état en
// mémoire. `pageshow` avec `event.persisted` détecte précisément une
// restauration depuis le bfcache (par opposition à un vrai chargement) ;
// on force alors un rechargement complet pour repartir d'un état frais.
window.addEventListener('pageshow', (event) => {
  if (event.persisted) {
    window.location.reload()
  }
})

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <BrowserRouter>
      <App />
    </BrowserRouter>
  </React.StrictMode>,
)
