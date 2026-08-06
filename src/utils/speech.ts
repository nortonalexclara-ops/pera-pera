// Prononciation audio via la synthèse vocale native du navigateur (Web
// Speech API) — pas de fichiers audio à héberger/maintenir pour chaque
// kanji/mot ni d'API tierce payante : Safari/iOS et iPadOS embarquent déjà
// de bonnes voix japonaises, et c'est là-dessus que l'app est surtout
// utilisée.
export function isSpeechSupported(): boolean {
  return typeof window !== 'undefined' && 'speechSynthesis' in window
}

// Liste toutes les voix japonaises installées sur l'appareil — peut être
// vide un court instant après le chargement de la page, le temps que le
// navigateur charge sa liste de voix de façon asynchrone (voir
// `onvoiceschanged`, utilisé par le sélecteur de voix dans Réglages).
export function listJapaneseVoices(): SpeechSynthesisVoice[] {
  if (!isSpeechSupported()) return []
  return window.speechSynthesis.getVoices().filter((v) => v.lang?.toLowerCase().startsWith('ja'))
}

// Préférence de voix — un choix d'appareil/navigateur (les voix
// installées diffèrent d'un appareil à l'autre), pas une donnée de
// profil : gardée en local uniquement, jamais dans la sauvegarde cloud.
const VOICE_PREF_KEY = 'pera-pera:speech-voice-uri'

export function getPreferredVoiceURI(): string | null {
  return localStorage.getItem(VOICE_PREF_KEY)
}

export function setPreferredVoiceURI(voiceURI: string | null): void {
  if (voiceURI) localStorage.setItem(VOICE_PREF_KEY, voiceURI)
  else localStorage.removeItem(VOICE_PREF_KEY)
}

// Relit `getVoices()` à chaque appel plutôt que de mettre en cache : ça
// reste peu coûteux (appelé seulement au clic sur un bouton "écouter",
// jamais dans une boucle chaude), et ça permet de refléter immédiatement
// un changement de préférence dans Réglages sans recharger la page. Sans
// préférence choisie (ou si la voix préférée n'est plus disponible),
// repli sur la première voix japonaise trouvée ; sans aucune voix
// japonaise identifiée, `lang: 'ja-JP'` seul sur l'utterance suffit déjà
// à orienter la plupart des moteurs vers une voix cohérente.
function findJapaneseVoice(): SpeechSynthesisVoice | null {
  const jaVoices = listJapaneseVoices()
  const preferredURI = getPreferredVoiceURI()
  return jaVoices.find((v) => v.voiceURI === preferredURI) ?? jaVoices[0] ?? null
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
