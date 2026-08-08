import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import ChoiceButtonGroup from '../../components/ui/ChoiceButtonGroup'
import { LEVEL_OPTIONS, CONTENT_OPTIONS, CONTENT_TO_MODE, DEFAULT_CONTENT_OPTION, VOCAB_TYPE_OPTIONS } from './sessionOptions'

const MODULE_OPTIONS = ['Kanjis', 'Vocabulaire', 'Grammaire', 'Révisions']

// Pas d'animation de sortie (voir PROJECT_STATE.md — AnimatePresence avec
// `exit` reste bloqué à mi-transition dans cet environnement) : seule
// l'apparition est animée, la disparition est instantanée.
const configPanelMotion = {
  initial: { opacity: 0, height: 0 },
  animate: { opacity: 1, height: 'auto' as const },
  transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] as const },
}

export default function CustomSessionBuilder({
  onStart,
}: {
  onStart: (
    modules: string[],
    level: string,
    contentModes: Partial<Record<'Kanjis' | 'Vocabulaire' | 'Grammaire', 'new' | 'mix' | 'review'>>,
  ) => void
}) {
  const [level, setLevel] = useState<string | null>(null)
  const [modules, setModules] = useState<Set<string>>(new Set())

  const [kanjiContent, setKanjiContent] = useState(DEFAULT_CONTENT_OPTION)
  const [vocabContent, setVocabContent] = useState(DEFAULT_CONTENT_OPTION)
  const [vocabTypes, setVocabTypes] = useState<Set<string>>(new Set(VOCAB_TYPE_OPTIONS))
  const [grammarContent, setGrammarContent] = useState(DEFAULT_CONTENT_OPTION)

  function toggleModule(opt: string) {
    setModules((prev) => {
      const next = new Set(prev)
      if (next.has(opt)) next.delete(opt)
      else next.add(opt)
      return next
    })
  }

  function toggleVocabType(opt: string) {
    setVocabTypes((prev) => {
      const next = new Set(prev)
      if (next.has(opt)) next.delete(opt)
      else next.add(opt)
      return next
    })
  }

  return (
    <div className="custom-builder">
      <p className="custom-builder__label">Niveau</p>
      <ChoiceButtonGroup options={LEVEL_OPTIONS} selected={level ? [level] : []} onToggle={setLevel} />

      <p className="custom-builder__label">Modules à travailler aujourd'hui</p>
      <ChoiceButtonGroup options={MODULE_OPTIONS} selected={[...modules]} onToggle={toggleModule} />

      {modules.has('Kanjis') && (
        <motion.div {...configPanelMotion} className="module-config">
          <p className="module-config__title">Kanjis</p>
          <ChoiceButtonGroup options={CONTENT_OPTIONS} selected={[kanjiContent]} onToggle={setKanjiContent} />
        </motion.div>
      )}

      {modules.has('Vocabulaire') && (
        <motion.div {...configPanelMotion} className="module-config">
          <p className="module-config__title">Vocabulaire</p>
          <ChoiceButtonGroup options={CONTENT_OPTIONS} selected={[vocabContent]} onToggle={setVocabContent} />
          <p className="module-config__subtitle">Type</p>
          <ChoiceButtonGroup options={VOCAB_TYPE_OPTIONS} selected={[...vocabTypes]} onToggle={toggleVocabType} />
        </motion.div>
      )}

      {modules.has('Grammaire') && (
        <motion.div {...configPanelMotion} className="module-config">
          <p className="module-config__title">Grammaire</p>
          <ChoiceButtonGroup options={CONTENT_OPTIONS} selected={[grammarContent]} onToggle={setGrammarContent} />
        </motion.div>
      )}

      {modules.has('Révisions') && (
        <motion.div {...configPanelMotion} className="module-config">
          <p className="module-config__title">Révisions</p>
          <p className="module-config__hint">
            Révise tout ce qui est dû aujourd'hui, tous modules confondus — aucun réglage nécessaire.
          </p>
        </motion.div>
      )}

      <button
        className="btn-primary hero-card__cta"
        disabled={!level || modules.size === 0}
        onClick={() =>
          onStart(MODULE_OPTIONS.filter((m) => modules.has(m)), level!, {
            Kanjis: CONTENT_TO_MODE[kanjiContent],
            Vocabulaire: CONTENT_TO_MODE[vocabContent],
            Grammaire: CONTENT_TO_MODE[grammarContent],
          })
        }
      >
        Commencer ma séance personnalisée
        <ArrowRight size={17} strokeWidth={2} />
      </button>
    </div>
  )
}
