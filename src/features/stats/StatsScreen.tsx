import { motion } from 'framer-motion'
import { useLiveQuery } from 'dexie-react-hooks'
import PageTransition from '../../components/ui/PageTransition'
import AmbientGlow from '../../components/ui/AmbientGlow'
import { mockKanjiList, type JlptLevel } from '../kanji/mockKanji'
import { mockVocabList } from '../vocab/mockVocab'
import { mockGrammarList } from '../grammar/mockGrammar'
import { useProfileStore } from '../profile/profileStore'
import { getAllMasteredIds } from '../../db/mastery'
import './Stats.css'

const listVariants = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.1, delayChildren: 0.05 } },
}

const fadeUp = {
  hidden: { opacity: 0, y: 12 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] } },
}

const JLPT_LEVELS: JlptLevel[] = ['N5', 'N4', 'N3', 'N2', 'N1']

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
        </motion.div>
      </div>
    </PageTransition>
  )
}
