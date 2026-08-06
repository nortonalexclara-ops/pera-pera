import Dexie, { type Table } from 'dexie'

// Première couche de persistance réelle de l'app (jusqu'ici : interface
// seule, mock data — voir PROJECT_STATE.md). Demande explicite de
// l'utilisateur : vrais profils créables/sélectionnables, et mémoire de ce
// qui a été coché "Maîtrisé" en séance. Un seul IndexedDB partagé plutôt que
// des bases séparées par profil (plus simple à ouvrir/gérer) — l'isolation
// entre profils se fait via `profileId` en préfixe de chaque enregistrement,
// pas via des bases physiquement distinctes.
//
// Volontairement PAS de FSRS ici (pas d'intervalle, pas de date de
// prochaine révision, pas d'ease factor) — seulement mastered/pas mastered
// par item. La vraie planification de répétition espacée reste un chantier
// séparé, pas demandé pour l'instant.

export interface ProfileRecord {
  id: string
  name: string
  colorIndex: number
  createdAt: number
}

export type ItemKind = 'kanji' | 'vocab' | 'grammar'

export interface MasteryRecord {
  id?: number
  profileId: string
  kind: ItemKind
  itemId: string
  masteredAt: number
}

// Notes personnelles libres (pas du contenu appris/testé — juste un
// carnet perso : une expression entendue, un mot à retenir...). `text`
// pour la saisie tapée, `drawingDataUrl` pour la partie manuscrite (bitmap
// PNG en base64, voir `NoteCanvas.tsx`) — les deux coexistent sur la même
// note plutôt que d'obliger à choisir un mode. Rien n'est jamais
// interprété/reconnu, c'est juste stocké tel quel.
export interface NoteRecord {
  id: string
  profileId: string
  title: string
  text: string
  drawingDataUrl: string
  createdAt: number
  updatedAt: number
}

// Une ligne par jour où le profil a fait au moins une carte en séance
// (voir `src/db/activity.ts`) — sert uniquement à calculer un vrai "N
// jours de suite" (remplace `mockStreak`, jusque-là identique et fixe
// pour tout le monde). `date` au format 'YYYY-MM-DD', heure locale.
export interface ActivityRecord {
  id?: number
  profileId: string
  date: string
}

// Kanji/mot/point de grammaire marqué favori — remplace les étoiles
// jusque-là purement visuelles (Dashboard "Mot du jour", Explorer) qui
// ne survivaient pas à un rechargement. Même forme que `MasteryRecord`
// (kind+itemId), table séparée plutôt qu'un champ sur `mastery` : un
// item favori n'est pas forcément maîtrisé, et inversement.
export interface FavoriteRecord {
  id?: number
  profileId: string
  kind: ItemKind
  itemId: string
  favoritedAt: number
}

// Réglages divers par profil — une seule ligne par profil (`profileId` en
// clé primaire, pas d'auto-incrément) plutôt qu'une table par réglage,
// vu le peu de champs pour l'instant. `kanjiGoal` : objectif affiché sur
// le Dashboard, personnalisable (remplace la valeur fixe 500 codée en
// dur). `hasCloudBackup` : vrai dès qu'une sauvegarde en ligne a réussi
// depuis cet appareil — sert à cacher automatiquement la bannière/le
// formulaire de création de code une fois que c'est fait, sans avoir à
// interroger le serveur juste pour ça.
export interface ProfileSettingsRecord {
  profileId: string
  kanjiGoal: number
  hasCloudBackup: boolean
}

// Une ligne par jour où le profil a passé du temps en séance (Kanjis/
// Vocabulaire/Grammaire/Révisions — voir CardLoopShell), `seconds` cumulé
// au fil de la journée (voir `src/db/timeSpent.ts`). Table séparée de
// `activity` : celle-ci ne sait dire QUE "a pratiqué ce jour-là" (pour le
// streak), pas COMBIEN de temps — remplace le "temps passé à écrire"
// jusqu'ici inventé (voir Stats.tsx, retiré) par une vraie mesure.
export interface TimeSpentRecord {
  id?: number
  profileId: string
  date: string
  seconds: number
}

class PeraPeraDB extends Dexie {
  profiles!: Table<ProfileRecord, string>
  mastery!: Table<MasteryRecord, number>
  notes!: Table<NoteRecord, string>
  activity!: Table<ActivityRecord, number>
  favorites!: Table<FavoriteRecord, number>
  profileSettings!: Table<ProfileSettingsRecord, string>
  timeSpent!: Table<TimeSpentRecord, number>

  constructor() {
    super('pera-pera')
    this.version(1).stores({
      profiles: 'id',
      // Index composé [profileId+kind+itemId] pour l'upsert/lookup d'un
      // item précis ; profileId et [profileId+kind] pour compter/lister
      // par profil (Dashboard, Stats) sans charger toute la table.
      mastery: '++id, [profileId+kind+itemId], profileId, [profileId+kind]',
    })
    // v2 : ajout des notes perso, tables existantes reprises à l'identique
    // (schéma Dexie additif — nécessaire pour que les bases déjà créées
    // sur un appareil upgradent proprement sans perdre profils/maîtrise).
    this.version(2).stores({
      profiles: 'id',
      mastery: '++id, [profileId+kind+itemId], profileId, [profileId+kind]',
      notes: 'id, profileId, updatedAt',
    })
    // v3 : ajout du suivi d'activité (vrai streak par profil).
    this.version(3).stores({
      profiles: 'id',
      mastery: '++id, [profileId+kind+itemId], profileId, [profileId+kind]',
      notes: 'id, profileId, updatedAt',
      activity: '++id, [profileId+date], profileId',
    })
    // v4 : ajout des favoris (vrais, persistés — remplace les étoiles
    // purement visuelles de Dashboard/Explorer).
    this.version(4).stores({
      profiles: 'id',
      mastery: '++id, [profileId+kind+itemId], profileId, [profileId+kind]',
      notes: 'id, profileId, updatedAt',
      activity: '++id, [profileId+date], profileId',
      favorites: '++id, [profileId+kind+itemId], profileId, [profileId+kind]',
    })
    // v5 : ajout des réglages par profil (objectif de kanjis, statut de
    // sauvegarde en ligne).
    this.version(5).stores({
      profiles: 'id',
      mastery: '++id, [profileId+kind+itemId], profileId, [profileId+kind]',
      notes: 'id, profileId, updatedAt',
      activity: '++id, [profileId+date], profileId',
      favorites: '++id, [profileId+kind+itemId], profileId, [profileId+kind]',
      profileSettings: 'profileId',
    })
    // v6 : ajout du suivi du temps passé en séance (vrai "temps passé par
    // jour" par profil, voir Stats.tsx).
    this.version(6).stores({
      profiles: 'id',
      mastery: '++id, [profileId+kind+itemId], profileId, [profileId+kind]',
      notes: 'id, profileId, updatedAt',
      activity: '++id, [profileId+date], profileId',
      favorites: '++id, [profileId+kind+itemId], profileId, [profileId+kind]',
      profileSettings: 'profileId',
      timeSpent: '++id, [profileId+date], profileId',
    })
  }
}

export const db = new PeraPeraDB()
