export interface Point {
  x: number
  y: number
}

export interface StrokeMatchResult {
  correct: boolean
  strokeCountMatches: boolean
  drawnCount: number
  expectedCount: number
  // 0 = forme/position quasi identiques, plus c'est grand plus les traits
  // comparés diffèrent. Purement indicatif en interne, pas montré à
  // l'utilisateur.
  averageStrokeScore: number
  // Le pire des traits — voir plus bas pourquoi c'est lui qui décide, pas
  // la moyenne.
  maxStrokeScore: number
}

const SAMPLE_N = 24
// Distance normalisée acceptée pour le PIRE trait — calibré en dessinant de
// vrais traits dans le navigateur et en lisant le score réel (voir
// PROJECT_STATE.md pour l'historique des deux bugs successifs sur ce
// seuil).
const MAX_STROKE_THRESHOLD = 0.3

// Échantillonne un tracé SVG path (repère KanjiVG, viewBox 0-109) en N
// points répartis uniformément le long de sa longueur. Fonctionne sur un
// élément détaché du DOM (pas besoin de l'attacher pour ces méthodes de
// géométrie SVG).
export function samplePath(d: string, n = SAMPLE_N): Point[] {
  const path = document.createElementNS('http://www.w3.org/2000/svg', 'path')
  path.setAttribute('d', d)
  const len = path.getTotalLength()
  const points: Point[] = []
  for (let i = 0; i < n; i++) {
    const pt = path.getPointAtLength((len * i) / (n - 1))
    points.push({ x: pt.x, y: pt.y })
  }
  return points
}

// Rééchantillonne une liste de points bruts (dessinés à main levée, donc
// espacés irrégulièrement — beaucoup de points quand le geste est lent, peu
// quand il est rapide) en N points équidistants le long du tracé par
// longueur d'arc, pour pouvoir comparer point à point avec la référence.
export function resamplePoints(points: Point[], n = SAMPLE_N): Point[] {
  if (points.length === 0) return []
  if (points.length === 1) return Array.from({ length: n }, () => points[0])

  const distances = [0]
  for (let i = 1; i < points.length; i++) {
    distances.push(distances[i - 1] + Math.hypot(points[i].x - points[i - 1].x, points[i].y - points[i - 1].y))
  }
  const total = distances[distances.length - 1]
  if (total === 0) return Array.from({ length: n }, () => points[0])

  const result: Point[] = []
  for (let i = 0; i < n; i++) {
    const target = (total * i) / (n - 1)
    let j = 1
    while (j < distances.length && distances[j] < target) j++
    const j0 = Math.max(0, j - 1)
    const j1 = Math.min(j, points.length - 1)
    const segLen = distances[j1] - distances[j0] || 1
    const t = (target - distances[j0]) / segLen
    result.push({ x: points[j0].x + (points[j1].x - points[j0].x) * t, y: points[j0].y + (points[j1].y - points[j0].y) * t })
  }
  return result
}

// Recentre et met à l'échelle un GROUPE de traits ensemble (une seule
// transformation, calculée sur la boîte englobante de tous les points
// combinés) plutôt que trait par trait. C'est la différence cruciale avec
// la première version de cet algorithme : normaliser chaque trait
// isolément fait perdre sa position et sa taille RELATIVE au reste du
// caractère — un tout petit trait dessiné n'importe où se remet alors à
// l'échelle tout seul et peut "accidentellement" bien matcher. En
// normalisant tout le caractère d'un coup, un trait doit être à la bonne
// place ET à la bonne taille EN PLUS d'avoir la bonne forme.
function normalizeGroup(strokes: Point[][]): Point[][] {
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

function averageDistance(a: Point[], b: Point[]): number {
  let sum = 0
  for (let i = 0; i < a.length; i++) sum += Math.hypot(a[i].x - b[i].x, a[i].y - b[i].y)
  return sum / a.length
}

/**
 * Compare les traits dessinés par l'utilisateur aux vrais tracés KanjiVG du
 * kanji. Comparaison de forme ET position, normalisées une seule fois pour
 * tout le caractère (voir `normalizeGroup`), trait par trait **dans l'ordre
 * du dessin** — encourage aussi le bon ordre des traits, pas seulement la
 * silhouette finale. C'est une heuristique honnête (vraie mesure de
 * similarité), pas une reconnaissance d'écriture — elle peut se tromper sur
 * des tracés ambigus, mais elle ne triche pas.
 *
 * Le verdict se base sur le PIRE trait (`maxStrokeScore`), pas la moyenne.
 * Bug corrigé : avec la moyenne, un kanji à beaucoup de traits (会, 買...)
 * pouvait avoir un ou deux traits n'importe comment "noyés" par plusieurs
 * traits courts qui matchent trivialement — accepté à tort tant que le
 * nombre de traits était bon. Exiger que CHAQUE trait soit correct empêche
 * ça, quel que soit le nombre de traits du kanji.
 */
export function matchKanjiStrokes(drawnStrokes: Point[][], referencePaths: string[]): StrokeMatchResult {
  const drawnCount = drawnStrokes.length
  const expectedCount = referencePaths.length
  const strokeCountMatches = drawnCount === expectedCount

  const n = Math.min(drawnCount, expectedCount)
  const drawnResampled = drawnStrokes.slice(0, n).map((s) => resamplePoints(s, SAMPLE_N))
  const referenceResampled = referencePaths.slice(0, n).map((d) => samplePath(d, SAMPLE_N))

  const drawnNorm = normalizeGroup(drawnResampled)
  const referenceNorm = normalizeGroup(referenceResampled)

  const perStrokeScores = drawnNorm.map((d, i) => averageDistance(d, referenceNorm[i]))
  const averageStrokeScore = perStrokeScores.length ? perStrokeScores.reduce((a, b) => a + b, 0) / perStrokeScores.length : Infinity
  const maxStrokeScore = perStrokeScores.length ? Math.max(...perStrokeScores) : Infinity

  return {
    correct: strokeCountMatches && maxStrokeScore <= MAX_STROKE_THRESHOLD,
    strokeCountMatches,
    drawnCount,
    expectedCount,
    averageStrokeScore,
    maxStrokeScore,
  }
}
