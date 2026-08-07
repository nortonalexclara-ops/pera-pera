import { useEffect, useMemo, useRef, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { useLiveQuery } from 'dexie-react-hooks'
import { Search, Star, ChevronDown, PenLine } from 'lucide-react'
import ChoiceButtonGroup from '../../components/ui/ChoiceButtonGroup'
import PageTransition from '../../components/ui/PageTransition'
import FuriganaText from '../../components/ui/FuriganaText'
import SpeakButton from '../../components/ui/SpeakButton'
import type { Kanji } from '../kanji/mockKanji'
import type { VocabWord } from '../vocab/mockVocab'
import type { GrammarPoint } from '../grammar/mockGrammar'
import { useProfileStore } from '../profile/profileStore'
import { getAllMasteredIds } from '../../db/mastery'
import { getAllFavoriteIds, toggleFavorite as toggleFavoriteDb } from '../../db/favorites'
import type { ItemKind } from '../../db/db'
import { buildExplorerItems, normalizeSearch, type ExplorerItem } from './buildExplorerItems'
import KanjiPracticeBox from './KanjiPracticeBox'
import { reconstructReading } from '../../utils/furigana'
import { toSpokenKanjiReading } from '../../utils/speech'
import { wordExceedsOwnLevel, wordHasUnmasteredKanji } from '../../utils/kanjiLevel'
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
const EMPTY_FAVORITES: Record<ItemKind, Set<string>> = { kanji: new Set(), vocab: new Set(), grammar: new Set() }
// Sans plafond, ~10 000 résultats sans filtre devenaient ~10 000 <li> montés
// d'un coup — c'était la vraie cause du chargement lent signalé, pas
// `buildExplorerItems` (déjà mémoïsé). On affiche par paliers plutôt que de
// tout monter, avec un bouton "Afficher plus" pour continuer.
const RESULTS_PAGE_SIZE = 60

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

// Texte brut (sans furigana) d'un mot segmenté — sert à rebondir vers sa
// propre fiche (ex. 安全 depuis la liste "Mots fréquents" de 安), pas à
// l'affichage (voir FuriganaText pour ça).
function segmentsToText(segments: { text: string }[]): string {
  return segments.map((s) => s.text).join('')
}

export default function Explorer() {
  const location = useLocation()
  // Arrivée depuis la reconnaissance de kanji manuscrit (voir
  // Notebook.tsx) : `navigate('/explorer', { state: { query } })` pré-
  // remplit la recherche avec le candidat choisi plutôt que de laisser
  // l'utilisateur retaper le kanji.
  const initialQuery = (location.state as { query?: string } | null)?.query ?? ''
  const allItems = useMemo(() => buildExplorerItems(), [])
  const [query, setQuery] = useState(initialQuery)
  const [level, setLevel] = useState('Tous')
  const [kind, setKind] = useState('Tous')
  const [theme, setTheme] = useState('Tous')
  const [mastery, setMastery] = useState('Tous')
  const [favoriteFilter, setFavoriteFilter] = useState('Tous')
  const [expandedId, setExpandedId] = useState<string | null>(null)
  const [practiceId, setPracticeId] = useState<string | null>(null)
  const [visibleCount, setVisibleCount] = useState(RESULTS_PAGE_SIZE)
  // Élément DOM de chaque ligne, par id — sert à scroller la ligne
  // nouvellement dépliée en haut de l'écran (voir l'effet plus bas).
  const rowRefs = useRef<Map<string, HTMLLIElement>>(new Map())
  // Mis à `true` juste avant un changement de recherche censé aboutir à
  // UNE fiche précise (arrivée par lien profond, mot fréquent cliqué) —
  // consommé dès que `results` reflète la nouvelle recherche.
  const pendingAutoExpandRef = useRef(false)

  const profileId = useProfileStore((s) => s.activeProfileId)
  const masteredIds = useLiveQuery(
    () => (profileId ? getAllMasteredIds(profileId) : Promise.resolve(EMPTY_MASTERED)),
    [profileId],
    EMPTY_MASTERED,
  )
  // Vrais favoris persistés (voir src/db/favorites.ts) — remplace un
  // `useState` purement visuel qui oubliait tout au rechargement.
  const favoriteIds = useLiveQuery(
    () => (profileId ? getAllFavoriteIds(profileId) : Promise.resolve(EMPTY_FAVORITES)),
    [profileId],
    EMPTY_FAVORITES,
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

  // Ouvrir un panneau (détail OU entraînement) sur une carte ferme
  // l'AUTRE panneau s'il était ouvert sur une carte différente — demande
  // explicite de l'utilisatrice ("si je clique sur une autre carte je
  // veux que ça ferme la précédente"). Ne touche pas à l'état de la
  // MÊME carte : ouvrir le détail d'un item n'y ferme pas sa propre
  // pratique d'écriture si elle était déjà affichée.
  function handleToggleExpand(id: string) {
    setExpandedId((prev) => (prev === id ? null : id))
    setPracticeId((prev) => (prev === id ? prev : null))
  }

  function handleTogglePractice(id: string) {
    setPracticeId((prev) => (prev === id ? null : id))
    setExpandedId((prev) => (prev === id ? prev : null))
  }

  // Rebondir d'un mot fréquent (ex. 安全 dans la fiche de 安) vers sa
  // propre entrée — demande explicite de l'utilisatrice. Réinitialise
  // les filtres pour garantir que l'entrée cible n'est pas cachée par un
  // filtre actif (niveau, maîtrise...), plutôt que de risquer une
  // recherche qui ne renvoie "rien" sans explication apparente. Même
  // mécanisme de dépliage automatique que l'arrivée par lien profond
  // (voir l'effet sur `initialQuery` plus bas) : pas la peine de laisser
  // l'utilisatrice retaper un clic pour ouvrir la fiche qu'elle vient de
  // demander explicitement.
  function openExample(text: string) {
    setQuery(text)
    setLevel('Tous')
    setKind('Tous')
    setTheme('Tous')
    setMastery('Tous')
    setFavoriteFilter('Tous')
    setPracticeId(null)
    setExpandedId(null)
    pendingAutoExpandRef.current = true
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  // Arrivée par lien profond avec une recherche pré-remplie (mot du jour,
  // reconnaissance de kanji manuscrit...) : ouvre directement la fiche
  // correspondante plutôt que de laisser une simple liste filtrée qu'il
  // faudrait encore déplier soi-même.
  useEffect(() => {
    if (initialQuery) pendingAutoExpandRef.current = true
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const results = useMemo(() => {
    const q = normalizeSearch(query)
    const themeFilter = theme === 'Tous' ? null : theme.toLowerCase()
    return allItems.filter((item) => {
      if (level !== 'Tous' && item.jlptLevel !== level) return false
      if (kind !== 'Tous' && KIND_TO_LABEL[item.kind] !== kind) return false
      if (themeFilter && !item.themes.includes(themeFilter)) return false
      if (q && !item.normalizedSearchText.includes(q)) return false
      if (mastery !== 'Tous') {
        const isMastered = masteredIds[item.kind].has(item.data.id)
        if (mastery === 'Maîtrisés' && !isMastered) return false
        if (mastery === 'Non maîtrisés' && isMastered) return false
      }
      if (favoriteFilter === 'Favoris' && !favoriteIds[item.kind].has(item.data.id)) return false
      return true
    })
  }, [allItems, query, level, kind, theme, mastery, masteredIds, favoriteFilter, favoriteIds])

  // Nouvelle recherche/filtre = on repart du premier palier, pas de rester
  // scrollé à "300 affichés" sur un tout autre sous-ensemble de résultats.
  useEffect(() => {
    setVisibleCount(RESULTS_PAGE_SIZE)
  }, [results])

  // Consomme le dépliage automatique en attente (voir `openExample` et
  // l'effet sur `initialQuery`) dès que `results` reflète la recherche
  // visée — ouvre la première correspondance plutôt que de laisser une
  // liste filtrée fermée.
  useEffect(() => {
    if (pendingAutoExpandRef.current && results.length > 0) {
      setExpandedId(results[0].id)
      pendingAutoExpandRef.current = false
    }
  }, [results])

  // "Quand j'ouvre une carte... j'arrive à la fin de la nouvelle carte,
  // j'aimerais arriver au début" (demande utilisatrice) — remonte la
  // ligne nouvellement dépliée en haut de l'écran plutôt que de laisser
  // le navigateur là où le déplacement de mise en page (fermeture de
  // l'ancien panneau, ouverture du nouveau) l'a laissé retomber.
  useEffect(() => {
    if (!expandedId) return
    const el = rowRefs.current.get(expandedId)
    el?.scrollIntoView({ block: 'start', behavior: 'smooth' })
  }, [expandedId])

  const visibleResults = results.slice(0, visibleCount)

  return (
    <PageTransition>
      <div className="explorer">
        <h1 className="explorer__title">Explorer</h1>
        <p className="explorer__subtitle">Parcours librement tous les kanjis, mots et points de grammaire.</p>

        <div className="explorer__search-row">
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
          {/* Interrupteur simple plutôt qu'une rangée de choix de plus
              (voir session-toggle sur le Dashboard pour l'esprit) — un
              favori est un statut personnel binaire ("je veux voir QUE
              mes favoris" ou non), pas une catégorie à choisir parmi
              plusieurs. Sortir cette bascule de `.explorer__filters`
              réduit aussi le nombre de rangées de boutons empilées, seul
              vrai reproche sur la mise en page (trop de catégories à
              la fois). */}
          <button
            type="button"
            className={`explorer__fav-toggle${favoriteFilter === 'Favoris' ? ' active' : ''}`}
            onClick={() => setFavoriteFilter(favoriteFilter === 'Favoris' ? 'Tous' : 'Favoris')}
            title="Afficher uniquement les favoris"
          >
            <Star size={15} strokeWidth={1.75} fill={favoriteFilter === 'Favoris' ? 'var(--color-warm)' : 'none'} />
            Favoris
          </button>
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
          {visibleResults.map((item, i) => {
            const isExpanded = expandedId === item.id
            const isPracticing = practiceId === item.id
            const isFavorite = favoriteIds[item.kind].has(item.data.id)
            const canPractice = isKanji(item.data) && item.data.strokePaths.length > 0
            return (
              <li
                key={item.id}
                className="explorer-item"
                ref={(el) => {
                  if (el) rowRefs.current.set(item.id, el)
                  else rowRefs.current.delete(item.id)
                }}
              >
                <button
                  type="button"
                  className="explorer-row"
                  onClick={() => handleToggleExpand(item.id)}
                >
                  {/* Position dans la liste actuelle (résultats filtrés,
                      pas dans les 10216 items bruts) — `i` correspond
                      déjà à l'index dans `results` puisque `visibleResults`
                      en est une slice à partir de 0. */}
                  <span className="explorer-row__index">{i + 1}</span>
                  <span className="explorer-row__kind-badge">{KIND_TO_LABEL[item.kind]}</span>
                  <span className="explorer-row__headline">
                    {/* Même règle que le recto des cartes de séance (voir
                        VocabCardLoop) : hiragana sous le kanji dès qu'un
                        mot contient un kanji pas encore enseigné à ce
                        niveau (ex. 挨拶 en N4) OU pas encore maîtrisé par
                        ce profil précisément (ex. 明るい en N5 si "明"
                        n'est pas encore coché "Maîtrisé"). */}
                    {isVocab(item.data) &&
                    (wordExceedsOwnLevel(item.data.word, item.data.jlptLevel) ||
                      wordHasUnmasteredKanji(item.data.word, masteredIds.kanji)) ? (
                      <FuriganaText segments={item.data.wordSegments} />
                    ) : (
                      item.headline
                    )}
                    {isKanji(item.data) && (
                      <SpeakButton
                        text={[...item.data.onyomi, ...item.data.kunyomi].map(toSpokenKanjiReading)}
                        className="explorer-row__speak-btn"
                      />
                    )}
                    {isVocab(item.data) && (
                      <SpeakButton
                        text={reconstructReading(item.data.wordSegments)}
                        className="explorer-row__speak-btn"
                      />
                    )}
                  </span>
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
                          handleTogglePractice(item.id)
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
                      if (profileId) toggleFavoriteDb(profileId, item.kind, item.data.id)
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
                    {isKanji(item.data) && <KanjiDetail kanji={item.data} onExampleClick={openExample} />}
                    {isVocab(item.data) && <VocabDetail vocab={item.data} />}
                    {isGrammar(item.data) && <GrammarDetail point={item.data} />}
                  </div>
                )}
              </li>
            )
          })}
        </ul>

        {visibleCount < results.length && (
          <button
            type="button"
            className="btn-link explorer__load-more"
            onClick={() => setVisibleCount((v) => v + RESULTS_PAGE_SIZE)}
          >
            Afficher plus ({results.length - visibleCount} restants)
          </button>
        )}
      </div>
    </PageTransition>
  )
}

function KanjiDetail({ kanji, onExampleClick }: { kanji: Kanji; onExampleClick: (text: string) => void }) {
  return (
    <div className="explorer-detail__body">
      <div className="explorer-detail__readings">
        <div>
          <p className="flip-card__label">On&apos;yomi</p>
          <p className="flip-card__reading-value">{kanji.onyomi.join(', ') || '—'}</p>
        </div>
        <div>
          <p className="flip-card__label">Kun&apos;yomi</p>
          <p className="flip-card__reading-value">{kanji.kunyomi.join(', ') || '—'}</p>
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
            <button
              type="button"
              className="explorer-detail__example-link"
              onClick={() => onExampleClick(segmentsToText(w.segments))}
              title="Ouvrir ce mot dans Explorer"
            >
              <span className="example__jp">
                <FuriganaText segments={w.segments} />
                <SpeakButton text={reconstructReading(w.segments)} />
              </span>
            </button>
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
              <SpeakButton text={reconstructReading(ex.segments)} />
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
              <SpeakButton text={reconstructReading(ex.segments)} />
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
