import {
  NOVA_ACCENT_META,
  NOVA_ACCENT_ORDER,
  novaAccentId,
  type NovaAccentId,
} from '../utils/novaAccent'

/** Read/write Nova accent palette (ocean / ember / forest / violet). */
export function useNovaAccentTheme() {
  function cycleAccent() {
    const index = NOVA_ACCENT_ORDER.indexOf(novaAccentId.value)
    const next = NOVA_ACCENT_ORDER[(index + 1) % NOVA_ACCENT_ORDER.length]
    novaAccentId.value = next
  }

  function setAccent(id: NovaAccentId) {
    if (NOVA_ACCENT_ORDER.includes(id)) {
      novaAccentId.value = id
    }
  }

  return {
    accentId: novaAccentId,
    cycleAccent,
    setAccent,
    meta: NOVA_ACCENT_META,
  }
}
