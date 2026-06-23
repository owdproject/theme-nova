import { watch } from 'vue'
import {
  NOVA_ACCENT_STORAGE_KEY,
  novaAccentId,
  readPersistedAccent,
  syncHtmlAccent,
} from '../utils/novaAccent'
import { useNovaAccentTheme } from '../composables/useNovaAccentTheme'

/**
 * Nova accent palettes: localStorage → shared ref → html[data-nova-accent].
 * Head bootstrap script prevents first-paint flash on reload.
 */
export default defineNuxtPlugin(() => {
  const { availableAccents, defaultAccent } = useNovaAccentTheme()

  let initialAccent = readPersistedAccent()
  if (!initialAccent || !availableAccents.value.includes(initialAccent)) {
    initialAccent = defaultAccent.value
  }

  novaAccentId.value = initialAccent
  syncHtmlAccent(initialAccent)

  watch(novaAccentId, (id) => {
    localStorage.setItem(NOVA_ACCENT_STORAGE_KEY, id)
    syncHtmlAccent(id)
  })
})
