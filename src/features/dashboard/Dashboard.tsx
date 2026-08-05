import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useLiveQuery } from 'dexie-react-hooks'
import { Flame, ArrowRight, Star, CloudUpload, X } from 'lucide-react'
import { useProfileStore } from '../profile/profileStore'
import { countMastered, getAllMasteredIds } from '../../db/mastery'
import { getStreak } from '../../db/activity'
import { isFavorite as checkIsFavorite, toggleFavorite } from '../../db/favorites'
import type { ItemKind } from '../../db/db'
import { mockKanjiList } from '../kanji/mockKanji'
import { mockVocabList } from '../vocab/mockVocab'
import { mockGrammarList } from '../grammar/mockGrammar'
import type { RecommendedSession } from './mockDashboard'
import { getKanjiGoal, getHasCloudBackup, DEFAULT_KANJI_GOAL } from '../../db/settings'
import { getWordOfDay } from './wordOfDay'
import AmbientGlow from '../../components/ui/AmbientGlow'
import ProgressRing from '../../components/ui/ProgressRing'
import PageTransition from '../../components/ui/PageTransition'
import SessionModeToggle, { type SessionMode } from './SessionModeToggle'
import RecommendedSessionPanel from './RecommendedSessionPanel'
import CustomSessionBuilder from './CustomSessionBuilder'
import './Dashboard.css'

const EMPTY_MASTERED: Record<ItemKind, Set<string>> = { kanji: new Set(), vocab: new Set(), grammar: new Set() }

// Taille cible d'une séance recommandée — pas un objectif de progression
// (voir mockGoal pour ça), juste "combien de cartes proposer aujourd'hui"
// pour rester dans les ~25 min annoncées. Le nombre réellement affiché/
// proposé est le minimum entre cette cible et ce qui reste vraiment à
// apprendre (ou à réviser), pour ne jamais promettre plus que le contenu
// disponible ne peut tenir.
const SESSION_SIZE = { kanji: 5, vocab: 12, grammar: 3, review: 38 }

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
}

function greeting() {
  const hour = new Date().getHours()
  return hour < 18 ? 'Bonjour' : 'Bonsoir'
}

export default function Dashboard() {
  const navigate = useNavigate()
  const profileId = useProfileStore((s) => s.activeProfileId)
  const profileName = useProfileStore((s) => s.activeProfileName) ?? 'vous'

  // Bannière "retrouve ton profil sur un autre appareil" — juste une
  // préférence d'affichage, pas une vraie donnée de profil : stockée en
  // localStorage (par profil) plutôt qu'en IndexedDB. Cachée une fois
  // fermée, sans date d'expiration ni réapparition automatique.
  const backupBannerKey = `pera-pera:backup-banner-dismissed:${profileId ?? ''}`
  const [backupBannerDismissed, setBackupBannerDismissed] = useState(
    () => profileId != null && localStorage.getItem(backupBannerKey) === '1',
  )
  function dismissBackupBanner() {
    if (profileId) localStorage.setItem(backupBannerKey, '1')
    setBackupBannerDismissed(true)
  }

  // Le nombre de kanjis maîtrisés vient réellement de la base (persisté par
  // profil). `useLiveQuery` se réabonne automatiquement : cocher
  // "Maîtrisé" en séance met ce chiffre à jour dès le retour sur le
  // Dashboard, sans rechargement.
  const masteredKanjiCount = useLiveQuery(
    () => (profileId ? countMastered(profileId, 'kanji') : Promise.resolve(0)),
    [profileId],
    0,
  )

  // Objectif personnalisable depuis Réglages (voir src/db/settings.ts) —
  // remplace l'ancienne valeur fixe (500) codée en dur.
  const kanjiGoal = useLiveQuery(
    () => (profileId ? getKanjiGoal(profileId) : Promise.resolve(DEFAULT_KANJI_GOAL)),
    [profileId],
    DEFAULT_KANJI_GOAL,
  )

  // Cache automatiquement la bannière/le lien "créer un code" une fois
  // qu'une sauvegarde en ligne existe déjà pour ce profil — pas la peine
  // de continuer à le proposer (demande utilisatrice).
  const hasCloudBackup = useLiveQuery(
    () => (profileId ? getHasCloudBackup(profileId) : Promise.resolve(false)),
    [profileId],
    false,
  )

  // Tous les items maîtrisés (3 kinds) en un aller-retour — sert à calculer
  // "nouveaux" (= pas encore dans cet ensemble) et "à réviser" (= dedans)
  // pour la séance recommandée, en vrai plutôt qu'en chiffres inventés.
  const masteredIds = useLiveQuery(
    () => (profileId ? getAllMasteredIds(profileId) : Promise.resolve(EMPTY_MASTERED)),
    [profileId],
    EMPTY_MASTERED,
  )

  // Vrai streak par profil (voir src/db/activity.ts) — remplace
  // `mockStreak`, jusque-là fixe et identique pour tout le monde.
  const streak = useLiveQuery(() => (profileId ? getStreak(profileId) : Promise.resolve(0)), [profileId], 0)

  // Recalculé une seule fois par montage (pas à chaque rendu) — la date ne
  // change pas pendant la session de l'utilisateur sur cet écran.
  const [wordOfDay] = useState(() => getWordOfDay())
  const wordOfDayReading = wordOfDay.wordSegments.map((s) => s.reading ?? s.text).join('')

  // Vrai favori persisté (voir src/db/favorites.ts) — remplace un
  // `useState` purement visuel qui oubliait tout au rechargement.
  const isWordFavorite = useLiveQuery(
    () => (profileId ? checkIsFavorite(profileId, 'vocab', wordOfDay.id) : Promise.resolve(false)),
    [profileId, wordOfDay.id],
    false,
  )
  // Démarre sur "personnalisée" plutôt que "recommandée" (demande
  // explicite de l'utilisatrice) — reste modifiable via le même
  // interrupteur, ce n'est qu'un changement de mode par défaut à
  // l'ouverture du Dashboard.
  const [mode, setMode] = useState<SessionMode>('custom')

  const goalCurrent = masteredKanjiCount ?? 0
  const goalPercent = Math.round((goalCurrent / kanjiGoal) * 100)
  const remaining = kanjiGoal - goalCurrent

  const newKanjiCount = Math.min(SESSION_SIZE.kanji, Math.max(0, mockKanjiList.length - masteredIds.kanji.size))
  const newVocabCount = Math.min(SESSION_SIZE.vocab, Math.max(0, mockVocabList.length - masteredIds.vocab.size))
  const newGrammarCount = Math.min(SESSION_SIZE.grammar, Math.max(0, mockGrammarList.length - masteredIds.grammar.size))
  const reviewCount = Math.min(
    SESSION_SIZE.review,
    masteredIds.kanji.size + masteredIds.vocab.size + masteredIds.grammar.size,
  )

  const recommendedSession: RecommendedSession = {
    kanjiCount: newKanjiCount,
    vocabCount: newVocabCount,
    grammarCount: newGrammarCount,
    reviewCount,
    durationMinutes: 25,
  }

  // Dénominateur de secours pour éviter une division par zéro si tous les
  // kanjis disponibles sont déjà maîtrisés (newKanjiCount = 0) — on retombe
  // sur la taille de séance cible plutôt que d'afficher Infinity/NaN.
  const paceDays = Math.ceil(remaining / (newKanjiCount > 0 ? newKanjiCount : SESSION_SIZE.kanji))

  const recommendedModules = [
    recommendedSession.kanjiCount > 0 && 'Kanjis',
    recommendedSession.vocabCount > 0 && 'Vocabulaire',
    recommendedSession.grammarCount > 0 && 'Grammaire',
    recommendedSession.reviewCount > 0 && 'Révisions',
  ].filter((m): m is string => Boolean(m))

  return (
    <PageTransition>
      <div className="dashboard">
        <div className="dashboard__header">
          <AmbientGlow top={-90} left={-60} size={260} color="var(--color-warm-glow)" />
          <AmbientGlow top={-40} left={140} size={200} />
          <h1 className="dashboard__greeting">
            {greeting()}, {profileName}
          </h1>
          <p className="dashboard__streak">
            <Flame size={14} className="dashboard__streak-icon" />
            {streak} jour{streak !== 1 ? 's' : ''} de suite
          </p>
        </div>

        {!backupBannerDismissed && !hasCloudBackup && (
          <motion.div
            className="backup-banner"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            <CloudUpload size={18} strokeWidth={1.75} className="backup-banner__icon" />
            <p className="backup-banner__text">
              Retrouve ton compte et ta progression sur tous tes appareils : crée un code à 4 chiffres.
            </p>
            <button type="button" className="backup-banner__link" onClick={() => navigate('/settings')}>
              Configurer
              <ArrowRight size={13} strokeWidth={2} />
            </button>
            <button
              type="button"
              className="backup-banner__dismiss"
              onClick={dismissBackupBanner}
              title="Ne plus afficher"
            >
              <X size={15} strokeWidth={1.75} />
            </button>
          </motion.div>
        )}

        <motion.div variants={listVariants} initial="hidden" animate="visible">
          {/* Carte héro : les éléments fixes (toggle) ne bougent pas, seul
              le contenu du mode sélectionné change. */}
          <motion.div className={`hero-card card${mode === 'custom' ? ' mode-custom' : ''}`} variants={fadeUp}>
            <SessionModeToggle mode={mode} onChange={setMode} />

            <motion.div
              key={mode}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
            >
              {mode === 'recommended' ? (
                <RecommendedSessionPanel
                  session={recommendedSession}
                  onStart={() =>
                    navigate('/session', {
                      state: {
                        modules: recommendedModules,
                        contentModes: { Kanjis: 'new', Vocabulaire: 'new', Grammaire: 'new' },
                        limits: {
                          Kanjis: SESSION_SIZE.kanji,
                          Vocabulaire: SESSION_SIZE.vocab,
                          Grammaire: SESSION_SIZE.grammar,
                          Révisions: SESSION_SIZE.review,
                        },
                      },
                    })
                  }
                />
              ) : (
                <CustomSessionBuilder
                  onStart={(modules, level, contentModes) => navigate('/session', { state: { modules, level, contentModes } })}
                />
              )}
            </motion.div>
          </motion.div>

          <motion.div className="dashboard__secondary-grid" variants={fadeUp}>
            <div className="soft-card goal-card">
              <ProgressRing percent={goalPercent} label={`${goalCurrent}`} sublabel={`/ ${kanjiGoal}`} />
              <div>
                <p className="goal-card__label">Maîtriser {kanjiGoal} kanjis</p>
                <p className="goal-card__remaining">{remaining} kanjis restants</p>
                <p className="goal-card__pace">à ce rythme : ~{paceDays} jours</p>
              </div>
            </div>

            <div className="soft-card word-card">
              <p className="word-card__eyebrow">Mot du jour</p>
              <p className="word-card__jp">{wordOfDay.word}</p>
              <p className="word-card__reading">
                {wordOfDayReading} · {wordOfDay.meanings[0]}
              </p>
              <div className="word-card__actions">
                <motion.button
                  className={`word-card__action${isWordFavorite ? ' active' : ''}`}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => profileId && toggleFavorite(profileId, 'vocab', wordOfDay.id)}
                >
                  <Star size={14} strokeWidth={1.75} fill={isWordFavorite ? 'var(--color-warm)' : 'none'} />
                  Favori
                </motion.button>
                <button
                  className="word-card__action"
                  onClick={() => navigate('/explorer', { state: { query: wordOfDay.word } })}
                >
                  Voir la fiche
                  <ArrowRight size={12} strokeWidth={2} />
                </button>
              </div>
            </div>
          </motion.div>

          <motion.div className="dashboard__training-link" variants={fadeUp}>
            <button className="btn-link" onClick={() => navigate('/training')}>
              Envie de t'entraîner librement ?
              <ArrowRight size={14} strokeWidth={2} />
            </button>
          </motion.div>
        </motion.div>
      </div>
    </PageTransition>
  )
}
