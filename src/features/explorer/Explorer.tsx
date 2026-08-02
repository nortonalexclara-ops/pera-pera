import { useMemo, useState } from 'react'
import { useLiveQuery } from 'dexie-react-hooks'
import { Search, Star, ChevronDown, PenLine } from 'lucide-react'
import ChoiceButtonGroup from '../../components/ui/ChoiceButtonGroup'
import PageTransition from '../../components/ui/PageTransition'
import FuriganaText from '../../components/ui/FuriganaText'
import type { Kanji } from '../kanji/mockKanji'
import type { VocabWord } from '../vocab/mockVocab'
import type { GrammarPoint } from '../grammar/mockGrammar'
import { useProfileStore } from '../profile/profileStore'
import { getAllMasteredIds } from '../../db/mastery'
import type { ItemKind } from '../../db/db'
import { buildExplorerItems, normalizeSearch, type ExplorerItem } from './buildExplorerItems'
import KanjiPracticeBox from './KanjiPracticeBox'
// Réutilise les classes partagées (meaning-pill, conjugation-grid,
// grammar-rule, flip-card__label...) déjà définies pour les cartes de
// session — même motif de reuse que WritingCanvas/ModuleEndCard,
// consigné dans PROJECT_STATE.md.
import '../kanji/SessionCard.css'
import './Explorer.css'

const LEVEL_OPTIONS = ['Tous', 'N5', 'N4', 'N3', 'N2', 'N1']
const KIND_OPTIONS = ['Tous', 'Kanjis', 'Vocabulaire', 'Grammaire']
const MASTERY_OPTIONS = ['Tous', 'Non maîtrisés', 'Maîtrisés']
const KIND_TO_LABEL: Record<string, string> = { kanji: 'Kanjis', vocab: 'Vocabulaire', grammar: 'Grammaire' }
const TYPE_LABELS: Record<string, string> = { nom: 'Nom', verbe: 'Verbe', adjectif: 'Adjectif', expression: 'Expression' }
const EMPTY_MASTERED: Record<ItemKind, Set<string>> = { kanji: new Set(), vocab: new Set(), grammar: new Set() }

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1)
}

function isKanji(data: ExplorerItem['data']): data is Kanji {
  return 'character' in data && 'onyomi' in data
}
function isVocab(data: ExplorerItem['data']): data is VocabWord {
  return 'word' in data && 'wordSegments' in data
}
function isGrammar(data: ExplorerItem['data']): data is GrammarPoint {
  return 'pattern' in data && 'rule' in data
}

export default function Explorer() {
  const allItems = useMemo(() => buildExplorerItems(), [])
  const [query, setQuery] = useState('')
  const [level, setLevel] = useState('Tous')
  const [kind, setKind] = useState('Tous')
  const [theme, setTheme] = useState('Tous')
  const [mastery, setMastery] = useState('Tous')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [practiceId, setPracticeId] = useState<string | null>(null)
  const [favorites, setFavorites] = useState<Set<string>>(new Set())

  const profileId = useProfileStore((s) => s.activeProfileId)
  const masteredIds = useLiveQuery(
    () => (profileId ? getAllMasteredIds(profileId) : Promise.resolve(EMPTY_MASTERED)),
    [profileId],
    EMPTY_MASTERED,
  )

  // Champs lexicaux disponibles — dérivés des kanjis existants (seul type de
  // contenu à en avoir pour l'instant), triés alphabétiquement.
  const themeOptions = useMemo(() => {
    const set = new Set<string>()
    allItems.forEach((item) => item.themes.forEach((t) => set.add(t)))
    return ['Tous', ...Array.from(set).sort((a, b) => a.localeCompare(b, 'fr')).map(capitalize)]
  }, [allItems])

  function handleKindToggle(next: string) {
    setKind(next)
    if (next !== 'Kanjis') setTheme('Tous')
  }

  function toggleFavorite(id: string) {
    setFavorites((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const results = useMemo(() => {
    const q = normalizeSearch(query)
    const themeFilter = theme === 'Tous' ? null : theme.toLowerCase()
    return allItems.filter((item) => {
      if (level !== 'Tous' && item.jlptLevel !== level) return false
      if (kind !== 'Tous' && KIND_TO_LABEL[item.kind] !== kind) return false
      if (themeFilter && !item.themes.includes(themeFilter)) return false
      if (q && !normalizeSearch(item.searchText).includes(q)) return false
      if (mastery !== 'Tous') {
        const isMastered = masteredIds[item.kind].has(item.data.id)
        if (mastery === 'Maîtrisés' && !isMastered) return false
        if (mastery === 'Non maîtrisés' && isMastered) return false
      }
      return true
    })
  }, [allItems, query, level, kind, theme, mastery, masteredIds])

  return (
    <PageTransition>
      <div className="explorer">
        <h1 className="explorer__title">Explorer</h1>
        <p className="explorer__subtitle">Parcours librement tous les kanjis, mots et points de grammaire.</p>

        <div className="explorer__search">
          <Search size={17} strokeWidth={1.75} />
          <input
            type="text"
            placeholder="Chercher un kanji, un mot, une lecture, un sens..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoComplete="off"
            spellCheck={false}
          />
        </div>

        <div className="explorer__filters">
          <ChoiceButtonGroup options={LEVEL_OPTIONS} selected={[level]} onToggle={setLevel} />
          <ChoiceButtonGroup options={KIND_OPTIONS} selected={[kind]} onToggle={handleKindToggle} />
          <ChoiceButtonGroup options={MASTERY_OPTIONS} selected={[mastery]} onToggle={setMastery} />
        </div>

        {kind === 'Kanjis' && (
          <div className="explorer__theme-filter">
            <label className="explorer__theme-label" htmlFor="explorer-theme-select">
              Champ lexical
            </label>
            <div className="explorer__select-wrap">
              <select
                id="explorer-theme-select"
                className="explorer__select"
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
              >
                {themeOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <ChevronDown size={16} strokeWidth={2} className="explorer__select-chevron" />
            </div>
          </div>
        )}

        <p className="explorer__count">
          {results.length} résultat{results.length !== 1 ? 's' : ''}
        </p>

        {results.length === 0 && <p className="explorer__empty">Rien ne correspond à cette recherche.</p>}

        <ul className="explorer-list">
          {results.map((item) => {
            const isExpanded = expandedId === item.id
            const isPracticing = practiceId === item.id
            const isFavorite = favorites.has(item.id)
            const canPractice = isKanji(item.data) && item.data.strokePaths.length > 0
            return (
              <li key={item.id} className="explorer-item">
                <button
                  type="button"
                  className="explorer-row"
                  onClick={() => setExpandedId(isExpanded ? null : item.id)}
                >
                  <span className="explorer-row__kind-badge">{KIND_TO_LABEL[item.kind]}</span>
                  <span className="explorer-row__headline">{item.headline}</span>
                  <span className="explorer-row__sub">{item.subLabel}</span>
                  <span className="explorer-row__meaning">{item.meanings.join(', ')}</span>
                  <span className="explorer-row__practice-slot">
                    {canPractice && (
                      <span
                        role="button"
                        tabIndex={0}
                        className={`explorer-row__practice${isPracticing ? ' is-active' : ''}`}
                        title="S'entraîner à l'écrire"
                        onClick={(e) => {
                          e.stopPropagation()
                          setPracticeId(isPracticing ? null : item.id)
                        }}
                      >
                        <PenLine size={15} strokeWidth={1.75} />
                      </span>
                    )}
                  </span>
                  <span
                    role="button"
                    tabIndex={0}
                    className="explorer-row__favorite"
                    onClick={(e) => {
                      e.stopPropagation()
                      toggleFavorite(item.id)
                    }}
                  >
                    <Star size={16} strokeWidth={1.75} fill={isFavorite ? 'var(--color-warm)' : 'none'} color={isFavorite ? 'var(--color-warm)' : undefined} />
                  </span>
                  <ChevronDown size={16} strokeWidth={2} className={`explorer-row__chevron${isExpanded ? ' is-open' : ''}`} />
                </button>

                {isPracticing && isKanji(item.data) && (
                  <div className="explorer-detail">
                    <KanjiPracticeBox kanji={item.data} />
                  </div>
                )}

                {isExpanded && (
                  <div className="explorer-detail">
                    {isKanji(item.data) && <KanjiDetail kanji={item.data} />}
                    {isVocab(item.data) && <VocabDetail vocab={item.data} />}
                    {isGrammar(item.data) && <GrammarDetail point={item.data} />}
                  </div>
                )}
              </li>
            )
          })}
        </ul>
      </div>
    </PageTransition>
  )
}

function KanjiDetail({ kanji }: { kanji: Kanji }) {
  return (
    <div className="explorer-detail__body">
      <div className="explorer-detail__readings">
        <div>
          <p className="flip-card__label">On&apos;yomi</p>
          <p className="flip-card__reading-value">{kanji.onyomi.join(' · ') || '—'}</p>
        </div>
        <div>
          <p className="flip-card__label">Kun&apos;yomi</p>
          <p className="flip-card__reading-value">{kanji.kunyomi.join(' · ') || '—'}</p>
        </div>
        <div>
          <p className="flip-card__label">Radical</p>
          <p className="flip-card__reading-value">
            {kanji.radical.character} ({kanji.radical.meaning})
          </p>
        </div>
        <div>
          <p className="flip-card__label">Traits</p>
          <p className="flip-card__reading-value">{kanji.strokeCount}</p>
        </div>
      </div>

      {/* Absent pour les kanjis atomiques (ex. 人, 大) — le radical
          ci-dessus suffit déjà à les décrire. */}
      {kanji.components.length > 0 && (
        <>
          <p className="flip-card__label">Clés</p>
          <ul className="explorer-detail__components">
            {kanji.components.map((c) => (
              <li key={c.character} className="component-chip">
                <span className="component-chip__char">{c.character}</span>
                <span className="component-chip__meaning">{c.meaning}</span>
              </li>
            ))}
          </ul>
        </>
      )}

      <p className="flip-card__label">Mots fréquents</p>
      <ul className="explorer-detail__examples">
        {kanji.frequentWords.map((w, i) => (
          <li key={i}>
            <span className="example__jp">
              <FuriganaText segments={w.segments} />
            </span>
            <span className="explorer-detail__example-meaning">{w.meaning}</span>
          </li>
        ))}
      </ul>

      <p className="flip-card__label">Exemples</p>
      <ul className="explorer-detail__examples">
        {kanji.examples.map((ex, i) => (
          <li key={i}>
            <span className="example__jp example__jp--sentence">
              <FuriganaText segments={ex.segments} />
            </span>
            <span className="explorer-detail__example-meaning">{ex.translation}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function VocabDetail({ vocab }: { vocab: VocabWord }) {
  return (
    <div className="explorer-detail__body">
      <span className="word-type-badge">{TYPE_LABELS[vocab.type]}</span>

      {vocab.verbConjugation && (
        <table className="conjugation-grid explorer-detail__conjugation">
          <thead>
            <tr>
              <th></th>
              <th>Positif</th>
              <th>Négatif</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Neutre (présent)</td>
              <td>{vocab.verbConjugation.dictionaryPresentPositive}</td>
              <td>{vocab.verbConjugation.dictionaryPresentNegative}</td>
            </tr>
            <tr>
              <td>Neutre (passé)</td>
              <td>{vocab.verbConjugation.dictionaryPastPositive}</td>
              <td>{vocab.verbConjugation.dictionaryPastNegative}</td>
            </tr>
            <tr className="conjugation-grid__group-start">
              <td>Poli (présent)</td>
              <td>{vocab.verbConjugation.politePresentPositive}</td>
              <td>{vocab.verbConjugation.politePresentNegative}</td>
            </tr>
            <tr>
              <td>Poli (passé)</td>
              <td>{vocab.verbConjugation.politePastPositive}</td>
              <td>{vocab.verbConjugation.politePastNegative}</td>
            </tr>
          </tbody>
        </table>
      )}
      {vocab.verbConjugation && (
        <p className="conjugation-te">
          て形 : <strong>{vocab.verbConjugation.teForm}</strong>
        </p>
      )}

      {vocab.conjugations && (
        <table className="conjugation-grid conjugation-grid--simple explorer-detail__conjugation">
          <tbody>
            {vocab.conjugations.map((c) => (
              <tr key={c.form}>
                <td>{c.form}</td>
                <td>{c.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <p className="flip-card__label">Exemples</p>
      <ul className="explorer-detail__examples">
        {vocab.examples.map((ex, i) => (
          <li key={i}>
            <span className="example__jp example__jp--sentence">
              <FuriganaText segments={ex.segments} />
            </span>
            <span className="explorer-detail__example-meaning">{ex.translation}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}

function GrammarDetail({ point }: { point: GrammarPoint }) {
  return (
    <div className="explorer-detail__body">
      <div className="grammar-rule explorer-detail__grammar-rule">
        <div className="grammar-rule__block">
          <p className="flip-card__label">Règle</p>
          <p className="grammar-rule__text">{point.rule}</p>
        </div>
        <div className="grammar-rule__block">
          <p className="flip-card__label">Utilisation</p>
          <p className="grammar-rule__text">{point.usage}</p>
        </div>
      </div>

      <p className="flip-card__label">Exemples</p>
      <ul className="explorer-detail__examples">
        {point.examples.map((ex, i) => (
          <li key={i}>
            <span className="example__jp example__jp--sentence">
              <FuriganaText segments={ex.segments} />
            </span>
            <span className="explorer-detail__example-meaning">{ex.translation}</span>
          </li>
        ))}
      </ul>
    </div>
  )
}
