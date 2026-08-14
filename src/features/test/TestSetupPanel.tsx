import { useState } from 'react'
import { ArrowRight } from 'lucide-react'
import { useLiveQuery } from 'dexie-react-hooks'
import ChoiceButtonGroup from '../../components/ui/ChoiceButtonGroup'
import { LEVEL_OPTIONS } from '../dashboard/sessionOptions'
import { useProfileStore } from '../profile/profileStore'
import { getTestRecord, type TestRecord } from '../../db/settings'
import type { JlptLevel } from '../kanji/mockKanji'
import { formatTime } from './MasteryTest'

const EMPTY_RECORD: TestRecord = { bestScore: 0, bestTimeSeconds: 0 }

// Pas de "Révisions" ici (contrairement à CustomSessionBuilder) : le test
// interroge uniquement sur ce qui est déjà marqué Maîtrisé, la notion de
// "à revoir" n'a pas de sens dans ce contexte.
const TEST_MODULE_OPTIONS = ['Kanjis', 'Vocabulaire', 'Grammaire']

interface TestSetupPanelProps {
  onStart: (level: JlptLevel, modules: string[]) => void
}

export default function TestSetupPanel({ onStart }: TestSetupPanelProps) {
  const [level, setLevel] = useState<JlptLevel | null>(null)
  // Les trois modules sont précochés (comme les types de vocabulaire dans
  // CustomSessionBuilder) — l'utilisatrice décoche plutôt que de tout
  // cocher à chaque fois.
  const [modules, setModules] = useState<Set<string>>(new Set(TEST_MODULE_OPTIONS))

  const profileId = useProfileStore((s) => s.activeProfileId)
  // Affiché avant de commencer pour donner un objectif clair ("tu dois
  // battre X") — esprit petit jeu plutôt qu'une simple série de questions.
  const record = useLiveQuery(
    () => (profileId ? getTestRecord(profileId) : Promise.resolve(EMPTY_RECORD)),
    [profileId],
    EMPTY_RECORD,
  )

  function toggleModule(opt: string) {
    setModules((prev) => {
      const next = new Set(prev)
      if (next.has(opt)) next.delete(opt)
      else next.add(opt)
      return next
    })
  }

  return (
    <div className="custom-builder">
      <p className="custom-builder__label">Niveau</p>
      <ChoiceButtonGroup
        options={LEVEL_OPTIONS}
        selected={level ? [level] : []}
        onToggle={(v) => setLevel(v as JlptLevel)}
      />

      <p className="custom-builder__label">Ce que tu testes</p>
      <ChoiceButtonGroup options={TEST_MODULE_OPTIONS} selected={[...modules]} onToggle={toggleModule} />
      {modules.size === 0 && <p className="module-config__hint">Choisis au moins un module.</p>}

      {(record.bestScore > 0 || record.bestTimeSeconds > 0) && (
        <p className="module-config__hint">
          Ton record : {record.bestScore} bonnes réponses · {formatTime(record.bestTimeSeconds)}
        </p>
      )}

      <button
        className="btn-primary hero-card__cta"
        disabled={!level || modules.size === 0}
        onClick={() => level && onStart(level, [...modules])}
      >
        Commencer le test
        <ArrowRight size={17} strokeWidth={2} />
      </button>
    </div>
  )
}
