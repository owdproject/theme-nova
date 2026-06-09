import { ref } from 'vue'

export type NovaAccentId = 'ocean' | 'ember' | 'forest' | 'violet'

export type NovaAccentMeta = {
  id: NovaAccentId
  icon: string
}

export const NOVA_ACCENT_STORAGE_KEY = 'owd-nova-accent'

export const DEFAULT_ACCENT: NovaAccentId = 'ocean'

export const NOVA_ACCENT_ORDER: NovaAccentId[] = [
  'ocean',
  'ember',
  'forest',
  'violet',
]

export const NOVA_ACCENT_META: Record<NovaAccentId, NovaAccentMeta> = {
  ocean: { id: 'ocean', icon: 'mdi:waves' },
  ember: { id: 'ember', icon: 'mdi:fire' },
  forest: { id: 'forest', icon: 'mdi:pine-tree' },
  violet: { id: 'violet', icon: 'mdi:flower' },
}

/** Shared accent state — hydrated and synced by `nova-accent.client` plugin. */
export const novaAccentId = ref<NovaAccentId>(DEFAULT_ACCENT)

export function isNovaAccentId(value: string): value is NovaAccentId {
  return NOVA_ACCENT_ORDER.includes(value as NovaAccentId)
}

export function readPersistedAccent(): NovaAccentId | undefined {
  if (typeof localStorage === 'undefined') return undefined

  const stored = localStorage.getItem(NOVA_ACCENT_STORAGE_KEY)
  if (stored && isNovaAccentId(stored)) return stored

  return undefined
}

export function syncHtmlAccent(accent: NovaAccentId) {
  if (typeof document === 'undefined') return
  document.documentElement.dataset.novaAccent = accent
}

const NOVA_MOTION_STORAGE_KEY = 'owd-nova-motion'

/** Inline bootstrap: accent + motion prefs before first paint (avoids flash). */
export const novaAccentBootstrapScript = `(function(){var el=document.documentElement,a=${JSON.stringify(NOVA_ACCENT_ORDER)},d=${JSON.stringify(DEFAULT_ACCENT)};try{var s=localStorage.getItem(${JSON.stringify(NOVA_ACCENT_STORAGE_KEY)});if(s&&a.indexOf(s)!==-1){el.dataset.novaAccent=s}else{el.dataset.novaAccent=d}}catch(e){el.dataset.novaAccent=d}try{var m=localStorage.getItem(${JSON.stringify(NOVA_MOTION_STORAGE_KEY)});el.dataset.novaMotion=m==='false'?'off':'on'}catch(e){el.dataset.novaMotion='on'}})();`
