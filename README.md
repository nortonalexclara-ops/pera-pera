# Pera Pera — coquille d'interface (V0)

Cette version ne contient **que l'interface** : navigation complète entre tous
les écrans, données fictives (mock), aucune logique métier, aucun stockage,
aucun FSRS. L'objectif est de valider l'expérience utilisateur avant
d'attaquer la couche métier.

## Prérequis

- [Node.js](https://nodejs.org/) version 20 ou plus récente (installe `npm`
  en même temps). Vérifie avec :
  ```
  node --version
  ```
- Un éditeur de code (VS Code par exemple).

## Démarrage

Dans le dossier du projet :

```bash
npm install
npm run dev
```

Le terminal affiche une adresse locale (en général `http://localhost:5173`)
— ouvre-la dans ton navigateur. La page se recharge automatiquement à
chaque modification de code.

## Ce qui est déjà navigable

- `/` — sélection de profil (2 profils fictifs)
- `/dashboard` — checklist du jour, objectif, bouton "Commencer ma séance"
- `/explorer`, `/notebook`, `/stats`, `/settings` — écrans "à venir"
  accessibles depuis la barre d'onglets (en bas en portrait, sur le côté
  en paysage/desktop)
- `/session`, `/training` — écrans "à venir" plein écran, lancés depuis le
  dashboard

## Ce qui n'est PAS encore là (volontairement)

Stockage, IndexedDB, FSRS, import de données, logique de cycle de vie des
kanjis — tout ça arrive une fois l'interface validée.

## Structure

```
src/
  app/            Layout principal + barre de navigation
  components/ui/  Composants partagés (placeholders, filigrane kanji)
  features/       Un dossier par écran/module, avec ses données mock
  styles/         Design tokens (couleurs, espacements, typographie)
```
