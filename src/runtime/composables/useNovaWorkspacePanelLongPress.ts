import { onScopeDispose, shallowRef } from 'vue'

const LONG_PRESS_MS = 500

/**
 * Touch long-press on workspace overview cards to reveal the remove control.
 */
export function useNovaWorkspacePanelLongPress() {
  const revealWorkspaceId = shallowRef<string | null>(null)
  let timer: ReturnType<typeof setTimeout> | null = null

  function clearTimer() {
    if (timer) {
      clearTimeout(timer)
      timer = null
    }
  }

  function dismissReveal() {
    revealWorkspaceId.value = null
  }

  function onPanelPointerDown(workspaceId: string, e: PointerEvent) {
    if (e.pointerType === 'mouse') return
    clearTimer()
    timer = setTimeout(() => {
      revealWorkspaceId.value = workspaceId
      timer = null
    }, LONG_PRESS_MS)
  }

  function onPanelPointerEnd() {
    clearTimer()
  }

  function isRevealActive(workspaceId: string): boolean {
    return revealWorkspaceId.value === workspaceId
  }

  onScopeDispose(clearTimer)

  return {
    revealWorkspaceId,
    dismissReveal,
    onPanelPointerDown,
    onPanelPointerEnd,
    isRevealActive,
  }
}
