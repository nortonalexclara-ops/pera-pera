import { motion } from 'framer-motion'
import { useLiveQuery } from 'dexie-react-hooks'
import { PenLine } from 'lucide-react'
import PageTransition from '../../components/ui/PageTransition'
import AmbientGlow from '../../components/ui/AmbientGlow'
import { mockKanjiList, type JlptLevel } from '../kanji/mockKanji'
import { mockVocabList } from '../vocab/mockVocab'
import { mockGrammarList } from '../grammar/mockGrammar'
import { useProfileStore } from '../profile/profileStore'
import { getAllMasteredIds } from '../../db/mastery'
import { mockHardestItems, mockWritingTime, type HardestItemEntry } from './mockStats'
import './Stats.css'

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
}

const KIND_LABELS: Record<HardestItemEntry['kind'], string> = {
  kanji: 'Kanji',
  vocab: 'Vocab',
  grammar: 'Grammaire',
}

const JLPT_LEVELS: JlptLevel[] = ['N5', 'N4', 'N3', 'N2', 'N1']

// Résout un HardestItemEntry vers { headline, meaning } selon son type —
// un seul kanji/mot/point de grammaire référencé par id, jamais dupliqué
// en dur dans mockStats.ts.
function resolveHardestItem(entry: HardestItemEntry): { headline: string; meaning: string } | null {
  if (entry.kind === 'kanji') {
    const k = mockKanjiList.find((k) => k.id === entry.itemId)
    return k ? { headline: k.character, meaning: k.meanings.join(', ') } : null
  }
  if (entry.kind === 'vocab') {
    const w = mockVocabList.find((w) => w.id === entry.itemId)
    return w ? { headline: w.word, meaning: w.meanings.join(', ') } : null
  }
  const g = mockGrammarList.find((g) => g.id === entry.itemId)
  return g ? { headline: g.pattern, meaning: g.meaning } : null
}

export default function StatsScreen() {
  const profileId = useProfileStore((s) => s.activeProfileId)

  // Seule vraie donnée persistée de cet écran : ce qui a été coché
  // "Maîtrisé" en séance (voir src/db/mastery.ts). Tout le reste de cette
  // fonction (répartition par module, progression par niveau) est dérivé
  // de ça + des listes de contenu réelles — plus aucun chiffre inventé
  // pour ces deux sections, contrairement à la première version de cet
  // écran (voir PROJECT_STATE.md).
  const masteredIds = useLiveQuery(
    () => (profileId ? getAllMasteredIds(profileId) : Promise.resolve(null)),
    [profileId],
    null,
  )
  const masteredKanji = masteredIds?.kanji ?? new Set<string>()
  const masteredVocab = masteredIds?.vocab ?? new Set<string>()
  const masteredGrammar = masteredIds?.grammar ?? new Set<string>()

  const moduleBreakdown = [
    { label: 'Kanjis', mastered: masteredKanji.size, total: mockKanjiList.length },
    { label: 'Vocabulaire', mastered: masteredVocab.size, total: mockVocabList.length },
    { label: 'Grammaire', mastered: masteredGrammar.size, total: mockGrammarList.length },
  ]

  const levelProgress = JLPT_LEVELS.map((level) => {
    const levelKanji = mockKanjiList.filter((k) => k.jlptLevel === level)
    const mastered = levelKanji.filter((k) => masteredKanji.has(k.id)).length
    return { level, mastered, target: levelKanji.length }
  }).filter((l) => l.target > 0)

  const totalMastered = masteredKanji.size
  const totalTarget = mockKanjiList.length
  const maxMinutes = Math.max(...mockWritingTime.map((d) => d.minutes))
  const weekTotal = mockWritingTime.reduce((sum, d) => sum + d.minutes, 0)

  return (
    <PageTransition>
      <div className="stats">
        <div className="stats__header">
          <AmbientGlow top={-90} left={-60} size={240} />
          <h1 className="stats__title">Statistiques</h1>
          <p className="stats__subtitle">
            {totalMastered} / {totalTarget} kanjis maîtrisés (sur le contenu déjà disponible)
          </p>
        </div>

        <motion.div variants={listVariants} initial="hidden" animate="visible">
          <motion.section className="stats-card" variants={fadeUp}>
            <h2 className="stats-card__title">Répartition par module</h2>
            <ul className="module-breakdown">
              {moduleBreakdown.map((m) => {
                const percent = m.total > 0 ? Math.round((m.mastered / m.total) * 100) : 0
                return (
                  <li key={m.label} className="module-tile">
                    <p className="module-tile__label">{m.label}</p>
                    <p className="module-tile__count">
                      {m.mastered} <span>/ {m.total}</span>
                    </p>
                    <div className="module-tile__track">
                      <motion.div
                        className="module-tile__fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${percent}%` }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </div>
                  </li>
                )
              })}
            </ul>
          </motion.section>

          <motion.section className="stats-card" variants={fadeUp}>
            <h2 className="stats-card__title">Progression par niveau JLPT</h2>
            <p className="stats-card__hint">
              Basée sur les kanjis déjà disponibles dans l'app — pas d'objectif chiffré équivalent côté vocabulaire/grammaire.
            </p>
            <ul className="level-bars">
              {levelProgress.map((l) => {
                const percent = l.target > 0 ? Math.round((l.mastered / l.target) * 100) : 0
                return (
                  <li key={l.level} className="level-bar">
                    <span className="level-bar__badge">{l.level}</span>
                    <div className="level-bar__track">
                      <motion.div
                        className="level-bar__fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${percent}%` }}
                        transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </div>
                    <span className="level-bar__count">
                      {l.mastered} / {l.target}
                    </span>
                  </li>
                )
              })}
            </ul>
          </motion.section>

          <motion.section className="stats-card" variants={fadeUp}>
            <h2 className="stats-card__title">Le plus difficile en ce moment</h2>
            <p className="stats-card__hint">Ce que tu rates le plus souvent en révision — kanjis, vocabulaire et grammaire mélangés.</p>
            <ul className="rank-list">
              {mockHardestItems.map((entry, i) => {
                const resolved = resolveHardestItem(entry)
                if (!resolved) return null
                return (
                  <li key={`${entry.kind}-${entry.itemId}`} className="rank-row">
                    <span className="rank-row__index">{i + 1}</span>
                    <span className="rank-row__kind-badge">{KIND_LABELS[entry.kind]}</span>
                    <span className="rank-row__char">{resolved.headline}</span>
                    <span className="rank-row__meaning">{resolved.meaning}</span>
                    <div className="rank-row__bar-track">
                      <motion.div
                        className="rank-row__bar-fill"
                        initial={{ width: 0 }}
                        animate={{ width: `${entry.missRate}%` }}
                        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                      />
                    </div>
                    <span className="rank-row__value">{entry.missRate}%</span>
                  </li>
                )
              })}
            </ul>
          </motion.section>

          <motion.section className="stats-card" variants={fadeUp}>
            <div className="stats-card__head-row">
              <h2 className="stats-card__title">
                <PenLine size={16} strokeWidth={1.75} />
                Temps passé à écrire
              </h2>
              <span className="stats-card__total">{weekTotal} min cette semaine</span>
            </div>
            <div className="write-chart">
              {mockWritingTime.map((d) => (
                <div key={d.day} className="write-chart__col">
                  <div className="write-chart__track">
                    <motion.div
                      className="write-chart__bar"
                      initial={{ height: 0 }}
                      animate={{ height: `${(d.minutes / maxMinutes) * 100}%` }}
                      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                  <span className="write-chart__minutes">{d.minutes}</span>
                  <span className="write-chart__day">{d.day}</span>
                </div>
              ))}
            </div>
          </motion.section>
        </motion.div>
      </div>
    </PageTransition>
  )
}
