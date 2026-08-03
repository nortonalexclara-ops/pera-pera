import { samplePath, resamplePoints, type Point } from './strokeMatch'

export interface RecognizableKanji {
  id: string
  character: string
  strokePaths: string[]
}

export interface RecognitionMatch {
  id: string
  character: string
  score: number
}

// Points par trait après rééchantillonnage — sert à comparer deux traits
// entre eux (voir `strokeDistance`), pas à représenter tout le caractère
// comme un seul chemin (voir plus bas pourquoi).
const STROKE_SAMPLE_N = 16
// Densité intermédiaire par trait de référence avant rééchantillonnage —
// sert juste à extraire des points depuis le path SVG.
const REF_STROKE_SAMPLE_N = 10
// Coût forfaitaire d'un trait sans correspondance (le dessin a plus ou
// moins de traits que le candidat). Du même ordre de grandeur qu'un
// mauvais match de trait plutôt qu'un score énorme : un trait en trop ou
// manquant ne doit pas à lui seul écarter un candidat par ailleurs très
// proche, mais doit peser plus qu'un simple bruit de mesure.
const UNMATCHED_STROKE_COST = 0.55

function centerAndScaleGroup(strokes: Point[][]): Point[][] {
  const all = strokes.flat()
  const xs = all.map((p) => p.x)
  const ys = all.map((p) => p.y)
  const minX = Math.min(...xs)
  const maxX = Math.max(...xs)
  const minY = Math.min(...ys)
  const maxY = Math.max(...ys)
  const scale = Math.max(maxX - minX, maxY - minY) || 1
  const cx = (minX + maxX) / 2
  const cy = (minY + maxY) / 2
  return strokes.map((stroke) => stroke.map((p) => ({ x: (p.x - cx) / scale, y: (p.y - cy) / scale })))
}

function strokeDistance(a: Point[], b: Point[]): number {
  let sum = 0
  for (let i = 0; i < a.length; i++) sum += Math.hypot(a[i].x - b[i].x, a[i].y - b[i].y)
  return sum / a.length
}

// Apparie chaque trait dessiné au trait de référence le plus proche par un
// algorithme glouton (pas une recherche exhaustive, mais largement
// suffisant pour le petit nombre de traits d'un kanji) : on prend la paire
// (trait dessiné, trait de référence) la plus proche restante, on la
// retire des deux côtés, on recommence.
//
// Volontairement INSENSIBLE À L'ORDRE de dessin — contrairement à
// `matchKanjiStrokes` (qui vérifie un tracé contre UNE cible connue en
// séance, trait i contre trait i, dans l'ordre, pour aussi encourager le
// bon ordre d'écriture), ici la cible n'est pas connue à l'avance : un
// utilisateur qui dessine 女 en partant par un trait différent de l'ordre
// KanjiVG doit quand même pouvoir être reconnu si la FORME globale est
// bonne.
function greedyStrokeMatchScore(drawn: Point[][], reference: Point[][]): number {
  const n = drawn.length
  const m = reference.length
  if (n === 0 || m === 0) return Infinity

  const dist: number[][] = drawn.map((d) => reference.map((r) => strokeDistance(d, r)))
  const usedDrawn = new Array(n).fill(false)
  const usedRef = new Array(m).fill(false)
  const pairs = Math.min(n, m)
  let total = 0

  for (let k = 0; k < pairs; k++) {
    let best = Infinity
    let bi = -1
    let bj = -1
    for (let i = 0; i < n; i++) {
      if (usedDrawn[i]) continue
      for (let j = 0; j < m; j++) {
        if (usedRef[j]) continue
        if (dist[i][j] < best) {
          best = dist[i][j]
          bi = i
          bj = j
        }
      }
    }
    usedDrawn[bi] = true
    usedRef[bj] = true
    total += best
  }

  const unmatched = Math.abs(n - m)
  total += unmatched * UNMATCHED_STROKE_COST
  return total / Math.max(n, m)
}

// Traits KanjiVG déjà normalisés/rééchantillonnés une fois pour toutes —
// évite de reparser les path SVG à chaque appui sur "Reconnaître" pour un
// même kanji (jusqu'à ~2491 candidats, coût DOM SVG non négligeable).
const referenceCache = new Map<string, Point[][]>()

function referenceStrokes(candidate: RecognizableKanji): Point[][] {
  const cached = referenceCache.get(candidate.id)
  if (cached) return cached
  const raw = candidate.strokePaths.map((d) => samplePath(d, REF_STROKE_SAMPLE_N))
  const normalized = centerAndScaleGroup(raw)
  const resampled = normalized.map((s) => resamplePoints(s, STROKE_SAMPLE_N))
  referenceCache.set(candidate.id, resampled)
  return resampled
}

/**
 * Classe les kanjis candidats par ressemblance avec le tracé dessiné, sans
 * connaître à l'avance le kanji visé (contrairement à `matchKanjiStrokes`,
 * utilisé en séance pour VÉRIFIER un tracé contre UNE cible connue).
 * Normalise le dessin comme UN SEUL groupe de traits (position/taille
 * relatives conservées — même principe que `normalizeGroup` dans
 * strokeMatch.ts), puis apparie chaque trait dessiné au trait de référence
 * le plus proche indépendamment de l'ordre de dessin (voir
 * `greedyStrokeMatchScore`). Reste une heuristique de forme honnête, pas un
 * modèle entraîné — elle peut se tromper sur des tracés ambigus.
 */
export function recognizeKanji(
  drawnStrokes: Point[][],
  candidates: RecognizableKanji[],
  topK = 5,
): RecognitionMatch[] {
  const nonEmpty = drawnStrokes.filter((s) => s.length > 0)
  if (nonEmpty.length === 0) return []

  const drawnNormalized = centerAndScaleGroup(nonEmpty)
  const drawnResampled = drawnNormalized.map((s) => resamplePoints(s, STROKE_SAMPLE_N))

  const scored = candidates.map((candidate) => ({
    id: candidate.id,
    character: candidate.character,
    score: greedyStrokeMatchScore(drawnResampled, referenceStrokes(candidate)),
  }))
  scored.sort((a, b) => a.score - b.score)
  return scored.slice(0, topK)
}
