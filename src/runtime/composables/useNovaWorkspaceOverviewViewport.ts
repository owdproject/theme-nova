import type { CSSProperties, Ref } from 'vue'
import { computed, nextTick, onScopeDispose, shallowRef, watch } from 'vue'
import { useElementSize } from '@vueuse/core'
import { useDesktopWorkspaceStore } from '@owdproject/core/runtime/stores/storeDesktopWorkspace'
import {
  computeScaleToFit,
  useWorkspaceOverviewLiveScale,
} from '@owdproject/core/runtime/composables/useWorkspaceOverviewLiveScale'

const FIT_PADDING = 0.94

/**
 * Nova workspace overview: stage-sized viewport scaled to fit panel, centered.
 */
export function useNovaWorkspaceOverviewViewport(
  shellStageRef: Ref<HTMLElement | null | undefined>,
) {
  const desktopWorkspaceStore = useDesktopWorkspaceStore()
  const { stageSize, refreshStageSize } =
    useWorkspaceOverviewLiveScale(shellStageRef)

  const viewportById = shallowRef<Record<string, HTMLElement>>({})
  const sampleViewportId = computed(
    () => desktopWorkspaceStore.list[0] ?? null,
  )
  const sampleViewport = computed(() => {
    const id = sampleViewportId.value
    return id ? (viewportById.value[id] ?? null) : null
  })

  const { width: panelW, height: panelH } = useElementSize(sampleViewport)

  const viewportObservers = new Map<string, ResizeObserver>()
  let layoutEpoch = 0
  const layoutTick = shallowRef(0)

  function bumpLayout() {
    layoutEpoch += 1
    layoutTick.value = layoutEpoch
  }

  function attachViewportObserver(workspaceId: string, node: HTMLElement) {
    if (typeof ResizeObserver === 'undefined') return

    const prev = viewportObservers.get(workspaceId)
    if (prev) prev.disconnect()

    const ro = new ResizeObserver(() => bumpLayout())
    ro.observe(node)
    viewportObservers.set(workspaceId, ro)
  }

  function attachAllViewportObservers() {
    for (const [workspaceId, node] of Object.entries(viewportById.value)) {
      attachViewportObserver(workspaceId, node)
    }
  }

  function setViewportRef(workspaceId: string, el: unknown) {
    const prev = viewportObservers.get(workspaceId)
    if (prev) {
      prev.disconnect()
      viewportObservers.delete(workspaceId)
    }

    const node = el instanceof HTMLElement ? el : null
    const current = viewportById.value[workspaceId]
    if (current === node) return

    const next = { ...viewportById.value }
    if (node) {
      next[workspaceId] = node
      if (desktopWorkspaceStore.overview) {
        attachViewportObserver(workspaceId, node)
      }
    } else {
      delete next[workspaceId]
    }
    viewportById.value = next
    bumpLayout()
  }

  function disconnectViewportObservers() {
    for (const ro of viewportObservers.values()) ro.disconnect()
    viewportObservers.clear()
  }

  function scheduleOverviewLayoutRefresh() {
    void nextTick(() => {
      refreshStageSize()
      attachAllViewportObservers()
      bumpLayout()
      requestAnimationFrame(() => {
        refreshStageSize()
        bumpLayout()
      })
    })
  }

  watch(
    () => desktopWorkspaceStore.overview,
    (open) => {
      if (open) {
        scheduleOverviewLayoutRefresh()
      } else {
        disconnectViewportObservers()
      }
    },
  )

  watch(stageSize, () => {
    if (desktopWorkspaceStore.overview) bumpLayout()
  })

  watch([panelW, panelH], () => {
    if (desktopWorkspaceStore.overview) bumpLayout()
  })

  onScopeDispose(disconnectViewportObservers)

  function resolvePanelSize(workspaceId: string): {
    width: number
    height: number
  } {
    const panelEl = viewportById.value[workspaceId]
    const width =
      panelEl?.clientWidth ??
      (workspaceId === sampleViewportId.value ? panelW.value : 0)
    const height =
      panelEl?.clientHeight ??
      (workspaceId === sampleViewportId.value ? panelH.value : 0)

    return { width, height }
  }

  function computeThumbScale(
    panelWidth: number,
    panelHeight: number,
    stageWidth: number,
    stageHeight: number,
  ): number {
    if (panelWidth > 0 && panelHeight > 0) {
      return (
        computeScaleToFit(panelWidth, panelHeight, stageWidth, stageHeight) *
        FIT_PADDING
      )
    }

    const sampleW = panelW.value
    const sampleH = panelH.value
    if (sampleW > 0 && sampleH > 0) {
      return (
        computeScaleToFit(sampleW, sampleH, stageWidth, stageHeight) *
        FIT_PADDING
      )
    }

    return 0.2
  }

  function overviewStackStyle(): CSSProperties | undefined {
    if (!desktopWorkspaceStore.overview) return undefined

    void layoutTick.value

    const { width: stageWidth, height: stageHeight } = stageSize.value
    if (stageWidth <= 0 || stageHeight <= 0) return undefined

    const scale = computeThumbScale(
      panelW.value,
      panelH.value,
      stageWidth,
      stageHeight,
    )

    return {
      '--nova-workspace-thumb-scale': String(scale),
      '--nova-workspace-stage-width': `${stageWidth}px`,
      '--nova-workspace-stage-height': `${stageHeight}px`,
    } as CSSProperties
  }

  function resolveOverviewScale(workspaceId: string): number | undefined {
    if (!desktopWorkspaceStore.overview) return undefined

    void layoutTick.value

    const { width: stageWidth, height: stageHeight } = stageSize.value
    if (stageWidth <= 0 || stageHeight <= 0) return undefined

    const { width: pw, height: ph } = resolvePanelSize(workspaceId)
    return computeThumbScale(pw, ph, stageWidth, stageHeight)
  }

  function scaleShellStyle(
    workspaceId: string,
  ): CSSProperties | undefined {
    if (!desktopWorkspaceStore.overview) return undefined

    const { width: stageWidth, height: stageHeight } = stageSize.value
    if (stageWidth <= 0 || stageHeight <= 0) return undefined

    const scale = resolveOverviewScale(workspaceId)
    if (scale === undefined) return undefined

    return {
      width: `${stageWidth * scale}px`,
      height: `${stageHeight * scale}px`,
      flexShrink: 0,
    }
  }

  function innerOverviewStyle(
    workspaceId: string,
  ): CSSProperties | undefined {
    if (!desktopWorkspaceStore.overview) return undefined

    const { width: stageWidth, height: stageHeight } = stageSize.value
    if (stageWidth <= 0 || stageHeight <= 0) return undefined

    const scale = resolveOverviewScale(workspaceId)
    if (scale === undefined) return undefined

    return {
      width: `${stageWidth}px`,
      height: `${stageHeight}px`,
      transform: `translate(-50%, -50%) scale(${scale})`,
      transformOrigin: 'center center',
    }
  }

  return {
    stageSize,
    setViewportRef,
    scaleShellStyle,
    innerOverviewStyle,
    overviewStackStyle,
    refreshStageSize,
  }
}
