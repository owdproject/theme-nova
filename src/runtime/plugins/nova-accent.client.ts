import { watch } from 'vue'
import {
  DEFAULT_ACCENT,
  NOVA_ACCENT_STORAGE_KEY,
  novaAccentId,
  readPersistedAccent,
  syncHtmlAccent,
} from '../utils/novaAccent'

/**
 * Nova accent palettes: localStorage → shared ref → html[data-nova-accent].
 * Head bootstrap script prevents first-paint flash on reload.
 */
export default defineNuxtPlugin(() => {
  novaAccentId.value = readPersistedAccent() ?? DEFAULT_ACCENT
  syncHtmlAccent(novaAccentId.value)

  watch(novaAccentId, (id) => {
    localStorage.setItem(NOVA_ACCENT_STORAGE_KEY, id)
    syncHtmlAccent(id)
  })
})
