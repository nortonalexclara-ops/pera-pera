// Prononciation audio via la synthèse vocale native du navigateur (Web
// Speech API) — pas de fichiers audio à héberger/maintenir pour chaque
// kanji/mot ni d'API tierce payante : Safari/iOS et iPadOS embarquent déjà
// de bonnes voix japonaises, et c'est là-dessus que l'app est surtout
// utilisée.
export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

// Mise en cache une fois trouvée seulement (jamais un résultat "rien
// trouvé") — `getVoices()` peut renvoyer une liste vide tant que le
// navigateur ne l'a pas chargée de façon asynchrone en arrière-plan ; sans
// voix japonaise identifiée, `lang: 'ja-JP'` seul sur l'utterance suffit
// déjà à orienter la plupart des moteurs vers une voix cohérente.
let cachedJaVoice: SpeechSynthesisVoice | null = null

function findJapaneseVoice(): SpeechSynthesisVoice | null {
  if (cachedJaVoice) return cachedJaVoice
  const voices = window.speechSynthesis.getVoices()
  cachedJaVoice = voices.find((v) => v.lang?.toLowerCase().startsWith('ja')) ?? null
  return cachedJaVoice
}

function buildUtterance(text: string): SpeechSynthesisUtterance {
  const utterance = new SpeechSynthesisUtterance(text)
  utterance.lang = 'ja-JP'
  const voice = findJapaneseVoice()
  if (voice) utterance.voice = voice
  // Un peu plus lent que le débit par défaut — plus facile à suivre pour
  // quelqu'un qui apprend, sans tomber dans le débit syllabe-par-syllabe.
  utterance.rate = 0.85
  return utterance
}

// Lit un seul texte — annule ce qui était en train d'être lu plutôt que
// d'empiler (un second tap avant la fin du premier doit interrompre,
// pas mettre en file).
export function speakJapanese(text: string): void {
  if (!isSpeechSupported() || !text.trim()) return
  window.speechSynthesis.cancel()
  window.speechSynthesis.speak(buildUtterance(text))
}

// Lit plusieurs textes à la suite (ex. tous les on'yomi d'un kanji) — la
// file d'attente native de speechSynthesis enchaîne les utterances dans
// l'ordre une fois empilées, pas besoin d'attendre la fin de la première
// à la main.
export function speakJapaneseSequence(texts: string[]): void {
  if (!isSpeechSupported()) return
  window.speechSynthesis.cancel()
  texts.filter((t) => t.trim()).forEach((text) => window.speechSynthesis.speak(buildUtterance(text)))
}

// Les on'yomi/kun'yomi de mockKanji.ts sont formatés pour l'affichage,
// ex. "ジン (jin)" ou avec okurigana "おお(きい) (ookii)" — la
// romanisation finale entre parenthèses est retirée, les parenthèses
// d'okurigana sont aplaties (leur contenu kana est gardé, juste sans les
// parenthèses) pour reconstituer la prononciation complète ("おおきい",
// pas seulement "おお").
export function toSpokenKanjiReading(raw: string): string {
  return raw.replace(/\s*\([^()]*\)\s*$/, '').replace(/[()]/g, '')
}
