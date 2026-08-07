export type KanaScript = 'hiragana' | 'katakana'

export interface Kana {
  id: string
  script: KanaScript
  character: string
  romaji: string
}

// [hiragana, katakana, romaji][] — une ligne par son, dans l'ordre gojuon
// traditionnel (colonnes a/i/u/e/o), puis dakuten puis handakuten. Table
// compacte plutôt que 142 objets répétitifs écrits à la main : garantit
// aussi que hiragana et katakana restent en phase (même romaji, même
// ordre) — les deux alphabets sont dérivés de la même source ci-dessous.
// Volontairement sans les combinaisons ゃゅょ (kyaku, shakai...) pour ce
// premier jet — ce sont des combinaisons de caractères déjà couverts ici,
// pas de nouveaux glyphes à proprement apprendre.
const KANA_TABLE: [string, string, string][] = [
  // Gojuon
  ['あ', 'ア', 'a'],
  ['い', 'イ', 'i'],
  ['う', 'ウ', 'u'],
  ['え', 'エ', 'e'],
  ['お', 'オ', 'o'],
  ['か', 'カ', 'ka'],
  ['き', 'キ', 'ki'],
  ['く', 'ク', 'ku'],
  ['け', 'ケ', 'ke'],
  ['こ', 'コ', 'ko'],
  ['さ', 'サ', 'sa'],
  ['し', 'シ', 'shi'],
  ['す', 'ス', 'su'],
  ['せ', 'セ', 'se'],
  ['そ', 'ソ', 'so'],
  ['た', 'タ', 'ta'],
  ['ち', 'チ', 'chi'],
  ['つ', 'ツ', 'tsu'],
  ['て', 'テ', 'te'],
  ['と', 'ト', 'to'],
  ['な', 'ナ', 'na'],
  ['に', 'ニ', 'ni'],
  ['ぬ', 'ヌ', 'nu'],
  ['ね', 'ネ', 'ne'],
  ['の', 'ノ', 'no'],
  ['は', 'ハ', 'ha'],
  ['ひ', 'ヒ', 'hi'],
  ['ふ', 'フ', 'fu'],
  ['へ', 'ヘ', 'he'],
  ['ほ', 'ホ', 'ho'],
  ['ま', 'マ', 'ma'],
  ['み', 'ミ', 'mi'],
  ['む', 'ム', 'mu'],
  ['め', 'メ', 'me'],
  ['も', 'モ', 'mo'],
  ['や', 'ヤ', 'ya'],
  ['ゆ', 'ユ', 'yu'],
  ['よ', 'ヨ', 'yo'],
  ['ら', 'ラ', 'ra'],
  ['り', 'リ', 'ri'],
  ['る', 'ル', 'ru'],
  ['れ', 'レ', 're'],
  ['ろ', 'ロ', 'ro'],
  ['わ', 'ワ', 'wa'],
  ['を', 'ヲ', 'wo'],
  ['ん', 'ン', 'n'],
  // Dakuten
  ['が', 'ガ', 'ga'],
  ['ぎ', 'ギ', 'gi'],
  ['ぐ', 'グ', 'gu'],
  ['げ', 'ゲ', 'ge'],
  ['ご', 'ゴ', 'go'],
  ['ざ', 'ザ', 'za'],
  ['じ', 'ジ', 'ji'],
  ['ず', 'ズ', 'zu'],
  ['ぜ', 'ゼ', 'ze'],
  ['ぞ', 'ゾ', 'zo'],
  ['だ', 'ダ', 'da'],
  ['ぢ', 'ヂ', 'ji'],
  ['づ', 'ヅ', 'zu'],
  ['で', 'デ', 'de'],
  ['ど', 'ド', 'do'],
  ['ば', 'バ', 'ba'],
  ['び', 'ビ', 'bi'],
  ['ぶ', 'ブ', 'bu'],
  ['べ', 'ベ', 'be'],
  ['ぼ', 'ボ', 'bo'],
  // Handakuten
  ['ぱ', 'パ', 'pa'],
  ['ぴ', 'ピ', 'pi'],
  ['ぷ', 'プ', 'pu'],
  ['ぺ', 'ペ', 'pe'],
  ['ぽ', 'ポ', 'po'],
]

export const mockHiraganaList: Kana[] = KANA_TABLE.map(([hiragana, , romaji], i) => ({
  id: `hira-${i}`,
  script: 'hiragana',
  character: hiragana,
  romaji,
}))

export const mockKatakanaList: Kana[] = KANA_TABLE.map(([, katakana, romaji], i) => ({
  id: `kata-${i}`,
  script: 'katakana',
  character: katakana,
  romaji,
}))
