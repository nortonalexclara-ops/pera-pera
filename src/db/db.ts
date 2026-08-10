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

export type ItemKind = 'kanji' | 'vocab' | 'grammar' | 'hiragana' | 'katakana'

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
  // Valeur de `seconds` au dernier sync réussi avec un autre appareil
  // (voir cloudSyncMerge.ts) — permet de calculer combien de secondes
  // ont été ajoutées LOCALEMENT depuis cette date, pour additionner
  // correctement du temps passé en parallèle sur deux appareils le même
  // jour plutôt que de se contenter du plus grand des deux (qui ferait
  // perdre la pratique la plus courte). `undefined` avant le premier
  // sync — traité comme 0 (tout l'historique compte comme "nouveau").
  syncedSeconds?: number
}

// Un kanji/mot/point de grammaire marqué "À revoir" en séance (voir
// setMastered) — jusqu'ici, cette décision ne laissait aucune trace :
// `mastery` ne sait dire QUE "maîtrisé" (présent) ou pas (absent), donc
// impossible de distinguer "jamais vu" de "vu et mis à revoir". Table
// séparée plutôt qu'un statut sur `mastery` : un item peut passer de
// "à revoir" à "maîtrisé" (et inversement), les deux tables restent
// mutuellement exclusives par construction (voir setMastered). Sert au
// mode "À revoir" de la séance personnalisée (Kanjis/Vocabulaire/
// Grammaire), demande explicite de l'utilisatrice.
export interface ReviewMarkRecord {
  id?: number
  profileId: string
  kind: ItemKind
  itemId: string
  markedAt: number
}

// Mot exemple sauvegardé pendant une séance de Kanjis ("j'aime ce mot, je
// veux le revoir après" — voir la liste "Mots" de KanjiCardLoop.tsx)
// — distinct de `FavoriteRecord` (marqué depuis Explorer, sert de filtre
// de recherche) : celui-ci alimente une liste dédiée affichée dans Notes,
// pensée pour être parcourue après coup. Stocké en texte plutôt qu'en
// `kind`/`itemId` (contrairement à mastery/favorites/reviewMarks) : ces
// mots exemples sont des extraits intégrés à la fiche du kanji
// (`Kanji.frequentWords`, voir mockKanji.ts), sans identifiant de
// catalogue propre à référencer.
export interface SavedWordRecord {
  id?: number
  profileId: string
  word: string
  reading: string
  meaning: string
  // Caractère du kanji dont ce mot est un exemple d'usage — beaucoup de
  // ces mots (illustratifs, choisis pour montrer le kanji en contexte)
  // n'ont pas de fiche à eux dans le catalogue de vocabulaire. Sert de
  // repli fiable pour "cliquer et arriver sur la fiche" (voir
  // NotesList.tsx) : le kanji, lui, existe toujours dans Explorer.
  kanjiChar: string
  savedAt: number
}

// Trace d'une suppression, pour la synchronisation entre appareils (voir
// cloudSyncEngine.ts) — sans ça, supprimer un favori/mot sauvegardé/note
// sur un appareil pourrait le faire "réapparaître" en fusionnant avec une
// copie plus ancienne d'un autre appareil qui n'a pas encore vu cette
// suppression. `table` identifie la donnée concernée ('mastery' couvre
// aussi bien mastery que reviewMarks, traités comme un statut combiné —
// voir cloudSyncMerge.ts) ; `key` est l'identifiant naturel de l'item
// dans cette table (kind:itemId, ou `word` pour savedWords, ou l'id de
// la note). Une seule ligne par (profileId, table, key) — la fusion ne
// regarde que le tombstone le plus récent, pas un historique complet.
export type SyncTombstoneTable = 'mastery' | 'favorites' | 'savedWords' | 'notes'

export interface SyncTombstoneRecord {
  id?: number
  profileId: string
  table: SyncTombstoneTable
  key: string
  deletedAt: number
}

// État de la synchronisation automatique en arrière-plan pour ce profil
// (voir cloudSyncEngine.ts) — table séparée de `profileSettings` : le
// code PIN et l'activation de la synchro n'ont rien à voir avec les
// préférences d'affichage (kanjiGoal), les mélanger risquerait qu'un
// futur réglage écrase silencieusement l'état de synchro en réécrivant
// la ligne sans penser à le préserver.
export interface CloudSyncStateRecord {
  profileId: string
  pin: string
  enabled: boolean
  lastSyncedAt: number | null
}

class PeraPeraDB extends Dexie {
  profiles!: Table<ProfileRecord, string>
  mastery!: Table<MasteryRecord, number>
  notes!: Table<NoteRecord, string>
  activity!: Table<ActivityRecord, number>
  favorites!: Table<FavoriteRecord, number>
  profileSettings!: Table<ProfileSettingsRecord, string>
  timeSpent!: Table<TimeSpentRecord, number>
  reviewMarks!: Table<ReviewMarkRecord, number>
  savedWords!: Table<SavedWordRecord, number>
  syncTombstones!: Table<SyncTombstoneRecord, number>
  cloudSyncState!: Table<CloudSyncStateRecord, string>

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
    // v7 : ajout du marquage "À revoir" (indépendant de mastery — voir
    // ReviewMarkRecord), pour un mode de séance dédié.
    this.version(7).stores({
      profiles: 'id',
      mastery: '++id, [profileId+kind+itemId], profileId, [profileId+kind]',
      notes: 'id, profileId, updatedAt',
      activity: '++id, [profileId+date], profileId',
      favorites: '++id, [profileId+kind+itemId], profileId, [profileId+kind]',
      profileSettings: 'profileId',
      timeSpent: '++id, [profileId+date], profileId',
      reviewMarks: '++id, [profileId+kind+itemId], profileId, [profileId+kind]',
    })
    // v8 : ajout des mots exemples sauvegardés en séance (voir
    // SavedWordRecord), liste dédiée affichée dans Notes. Index sur
    // [profileId+word] (pas [profileId+kind+itemId], voir SavedWordRecord)
    // pour retrouver/dédoublonner par le texte du mot lui-même.
    this.version(8).stores({
      profiles: 'id',
      mastery: '++id, [profileId+kind+itemId], profileId, [profileId+kind]',
      notes: 'id, profileId, updatedAt',
      activity: '++id, [profileId+date], profileId',
      favorites: '++id, [profileId+kind+itemId], profileId, [profileId+kind]',
      profileSettings: 'profileId',
      timeSpent: '++id, [profileId+date], profileId',
      reviewMarks: '++id, [profileId+kind+itemId], profileId, [profileId+kind]',
      savedWords: '++id, [profileId+word], profileId',
    })
    // v9 : synchronisation automatique entre appareils (voir
    // cloudSyncEngine.ts) — tombstones pour propager les suppressions
    // lors d'une fusion, et état de synchro (code, activé, dernier
    // sync) séparé de profileSettings.
    this.version(9).stores({
      profiles: 'id',
      mastery: '++id, [profileId+kind+itemId], profileId, [profileId+kind]',
      notes: 'id, profileId, updatedAt',
      activity: '++id, [profileId+date], profileId',
      favorites: '++id, [profileId+kind+itemId], profileId, [profileId+kind]',
      profileSettings: 'profileId',
      timeSpent: '++id, [profileId+date], profileId',
      reviewMarks: '++id, [profileId+kind+itemId], profileId, [profileId+kind]',
      savedWords: '++id, [profileId+word], profileId',
      syncTombstones: '++id, [profileId+table+key], profileId',
      cloudSyncState: 'profileId',
    })
  }
}

export const db = new PeraPeraDB()
