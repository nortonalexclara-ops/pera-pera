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

class PeraPeraDB extends Dexie {
  profiles!: Table<ProfileRecord, string>
  mastery!: Table<MasteryRecord, number>
  notes!: Table<NoteRecord, string>
  activity!: Table<ActivityRecord, number>

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
  }
}

export const db = new PeraPeraDB()
