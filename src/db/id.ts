// `crypto.randomUUID()` n'existe que dans un "secure context" (HTTPS ou
// localhost) — indisponible quand l'app est ouverte via l'IP locale du
// réseau (ex. accès depuis l'iPad en LAN, http://192.168.x.x:5173), ce qui
// fait échouer silencieusement toute création d'enregistrement dans ce cas.
// `crypto.getRandomValues()` reste disponible partout, donc on l'utilise en
// priorité et on ne retombe sur Math.random que si crypto est totalement
// absent. Partagé par tout ce qui crée un id (profils, notes, ...) plutôt
// que dupliqué à chaque nouvelle table.
export function generateId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID()
  }
  if (typeof crypto !== 'undefined' && typeof crypto.getRandomValues === 'function') {
    const bytes = crypto.getRandomValues(new Uint8Array(16))
    bytes[6] = (bytes[6] & 0x0f) | 0x40
    bytes[8] = (bytes[8] & 0x3f) | 0x80
    const hex = [...bytes].map((b) => b.toString(16).padStart(2, '0')).join('')
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`
  }
  return `id-${Date.now()}-${Math.random().toString(36).slice(2)}`
}
