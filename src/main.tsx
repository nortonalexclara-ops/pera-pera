import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App'
import { isStandalonePwa } from './utils/pwa'
import './styles/tokens.css'
import './styles/global.css'

// Bug signalé : sur mobile (Safari iOS notamment), revenir sur l'onglet
// après l'avoir quitté (changement d'appli, geste "tirer pour
// rafraîchir"...) peut RESTAURER la page depuis le bfcache du navigateur
// au lieu de la recharger vraiment — la page reprend alors exactement
// l'état JS gelé au moment où elle a été mise en cache. `pageshow` avec
// `event.persisted` détecte précisément une restauration depuis le
// bfcache (par opposition à un vrai chargement) ; on force alors un
// rechargement complet pour repartir d'un état frais plutôt que de courir
// le risque d'un état obsolète (ex. profil actif supprimé entre-temps
// dans un autre onglet). Le profil actif est mis en cache dans
// localStorage pour survivre à CE rechargement forcé sans reperdre la
// session (voir profileStore.ts, restoreActiveProfileFromStorage) — mais
// toujours revérifié contre IndexedDB avant d'être réactivé, jamais fait
// confiance tel quel.
//
// Pas de rechargement forcé en mode autonome (voir isStandalonePwa) :
// second bug signalé ensuite, plus gênant que celui-ci — un
// `location.reload()` dans une appli lancée depuis l'écran d'accueil iOS
// fait perdre le mode plein écran et rouvre l'appli dans un onglet Safari
// classique avec barre d'adresse. Le filet de sécurité bfcache reste actif
// dans un onglet de navigateur normal, où il n'y a pas ce risque.
window.addEventListener('pageshow', (event) => {
  if (event.persisted && !isStandalonePwa()) {
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
