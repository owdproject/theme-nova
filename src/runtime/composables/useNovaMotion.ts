import { ref, watch } from 'vue'
import { useAppConfig } from 'nuxt/app'

const STORAGE_KEY = 'owd-nova-motion'
const LEGACY_LAUNCHER_KEY = 'owd-nova-launcher-animation'

const motionEnabled = ref(true)
let hydrated = false

function readStored(): boolean | null {
  if (typeof localStorage === 'undefined') return null
  const stored = localStorage.getItem(STORAGE_KEY)
  if (stored === 'true') return true
  if (stored === 'false') return false
  return null
}

function readLegacyStored(): boolean | null {
  if (typeof localStorage === 'undefined') return null
  const stored = localStorage.getItem(LEGACY_LAUNCHER_KEY)
  if (stored === 'true') return true
  if (stored === 'false') return false
  return null
}

function defaultFromConfig(): boolean {
  const appConfig = useAppConfig()
  const motion = appConfig?.desktop?.motion?.animation
  if (motion !== undefined) return motion !== false
  return appConfig?.desktop?.launcher?.animation !== false
}

function syncMotionAttribute(enabled: boolean) {
  if (!import.meta.client) return
  const value = enabled ? 'on' : 'off'
  document.documentElement.setAttribute('data-nova-motion', value)
  document.body.setAttribute('data-nova-motion', value)
}

function hydratePreference() {
  if (!import.meta.client || hydrated) return
  hydrated = true

  const stored = readStored()
  if (stored !== null) {
    motionEnabled.value = stored
    syncMotionAttribute(stored)
    return
  }

  const legacy = readLegacyStored()
  if (legacy !== null) {
    motionEnabled.value = legacy
    localStorage.setItem(STORAGE_KEY, String(legacy))
    localStorage.removeItem(LEGACY_LAUNCHER_KEY)
    syncMotionAttribute(legacy)
    return
  }

  const enabled = defaultFromConfig()
  motionEnabled.value = enabled
  syncMotionAttribute(enabled)
}

watch(motionEnabled, (enabled) => {
  if (!import.meta.client) return
  localStorage.setItem(STORAGE_KEY, String(enabled))
  syncMotionAttribute(enabled)
})

/** Global Nova motion: launcher transitions + window focus/active transitions. */
export function useNovaMotion() {
  hydratePreference()

  function setEnabled(enabled: boolean) {
    motionEnabled.value = enabled
  }

  function toggle() {
    motionEnabled.value = !motionEnabled.value
  }

  return {
    enabled: motionEnabled,
    setEnabled,
    toggle,
  }
}
