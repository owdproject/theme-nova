import { computed } from 'vue'
import { useAppConfig } from 'nuxt/app'
import {
  novaAccentId,
} from '../utils/novaAccent'

/** Read/write Nova accent palette (ocean / ember / forest / violet / custom). */
export function useNovaAccentTheme() {
  const appConfig = useAppConfig()

  const config = computed(() => appConfig.desktop?.nova?.accents)

  const defaultAccent = computed(() => config.value?.default ?? 'ocean')
  const availableAccents = computed(() => config.value?.list ?? ['ocean', 'ember', 'forest', 'violet'])
  const accentMeta = computed(() => config.value?.meta ?? {
    ocean: { id: 'ocean', icon: 'mdi:waves' },
    ember: { id: 'ember', icon: 'mdi:fire' },
    forest: { id: 'forest', icon: 'mdi:pine-tree' },
    violet: { id: 'violet', icon: 'mdi:flower' },
  })

  function cycleAccent() {
    const list = availableAccents.value
    if (list.length === 0) return
    const index = list.indexOf(novaAccentId.value)
    const next = list[index === -1 ? 0 : (index + 1) % list.length]
    novaAccentId.value = next
  }

  function setAccent(id: string) {
    if (availableAccents.value.includes(id)) {
      novaAccentId.value = id
    }
  }

  return {
    accentId: novaAccentId,
    cycleAccent,
    setAccent,
    defaultAccent,
    availableAccents,
    accentMeta,
  }
}
