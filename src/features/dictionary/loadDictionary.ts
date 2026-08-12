// Dictionnaire de référence (pas du contenu appris) — voir
// `public/dictionary-fr.json`, dérivé de JMdict (licence CC BY-SA, même
// famille que KanjiVG déjà utilisé pour les tracés) via le projet
// jmdict-simplified (https://github.com/scriptin/jmdict-simplified),
// filtré aux ~15 000 entrées ayant au moins un sens traduit en français.
// Généré une fois, pas régénéré par l'appli — voir le script ponctuel
// utilisé pour le produire (non versionné, pas un outil applicatif).
export interface DictionarySense {
  pos: string[]
  gloss: string[]
}

export interface DictionaryEntry {
  id: string
  kanji: string[]
  kana: string[]
  common: boolean
  senses: DictionarySense[]
}

// Cache mémoire au niveau du module — un seul fetch par session, quel
// que soit le nombre de fois où Explorer est monté/démonté (changement
// d'onglet, navigation). Le cache HTTP normal du navigateur limite déjà
// les retéléchargements d'une session à l'autre.
let cached: Promise<DictionaryEntry[]> | null = null

export function fetchDictionary(): Promise<DictionaryEntry[]> {
  if (!cached) {
    cached = fetch('/dictionary-fr.json')
      .then((res) => {
        if (!res.ok) throw new Error('Dictionnaire indisponible.')
        return res.json() as Promise<DictionaryEntry[]>
      })
      .catch((err) => {
        // Un échec (hors-ligne, etc.) ne doit pas rester en cache — un
        // prochain appel (ex. retour en ligne) doit pouvoir réessayer,
        // plutôt que de rester bloqué sur une promesse déjà rejetée.
        cached = null
        throw err
      })
  }
  return cached
}

// Juste les tags les plus fréquemment rencontrés dans ce jeu de données
// (verbes/noms/adjectifs/adverbes...) — pas la peine de traduire les
// ~266 tags de JMdict (domaines techniques, dialectes régionaux rares...) :
// un tag non reconnu est simplement omis plutôt que d'afficher un code
// anglais cryptique. Préfixes (`v5`, `v1`, `v2`, `adj-`) couvrent les
// nombreuses variantes de conjugaison sans toutes les lister une par une.
const POS_EXACT: Record<string, string> = {
  n: 'nom',
  'n-pref': 'nom (préfixe)',
  'n-suf': 'nom (suffixe)',
  pn: 'pronom',
  'adj-no': 'adjectif (+ no)',
  'adj-pn': 'adjectif (pré-nominal)',
  'adj-t': 'adjectif (taru)',
  adv: 'adverbe',
  'adv-to': 'adverbe (+ to)',
  'aux-v': 'verbe auxiliaire',
  aux: 'auxiliaire',
  'aux-adj': 'adjectif auxiliaire',
  conj: 'conjonction',
  ctr: 'compteur',
  exp: 'expression',
  int: 'interjection',
  num: 'nombre',
  pref: 'préfixe',
  suf: 'suffixe',
  prt: 'particule',
  vs: 'verbe (suru)',
  'vs-i': 'verbe (suru)',
  'vs-s': 'verbe (suru spécial)',
  vk: 'verbe (kuru)',
  vz: 'verbe (zuru)',
  vi: 'verbe intransitif',
  vt: 'verbe transitif',
}

export function posLabel(pos: string[]): string {
  const labels = pos.map((p) => {
    if (POS_EXACT[p]) return POS_EXACT[p]
    if (p.startsWith('v5')) return 'verbe (godan)'
    if (p.startsWith('v1')) return 'verbe (ichidan)'
    if (p === 'adj-i') return 'adjectif en -i'
    if (p === 'adj-na') return 'adjectif en -na'
    return null
  })
  return [...new Set(labels.filter((l): l is string => l !== null))].join(', ')
}
