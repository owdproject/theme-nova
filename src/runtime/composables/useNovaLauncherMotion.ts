import { useNovaMotion } from './useNovaMotion'

/** @deprecated Use `useNovaMotion` — launcher shares the global motion preference. */
export function useNovaLauncherMotion() {
  return useNovaMotion()
}
