import type { CSSProperties, Ref } from 'vue'
import { computed, nextTick, onScopeDispose, shallowRef, watch } from 'vue'
import { useElementSize } from '@vueuse/core'
import { useDesktopWorkspaceStore } from '@owdproject/core/runtime/stores/storeDesktopWorkspace'
import {
  computeScaleToFit,
  useWorkspaceOverviewLiveScale,
} from '@owdproject/kit-theme/runtime/composables/useWorkspaceOverviewLiveScale'

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
      if (
        typeof ResizeObserver !== 'undefined' &&
        desktopWorkspaceStore.overview
      ) {
        const ro = new ResizeObserver(() => bumpLayout())
        ro.observe(node)
        viewportObservers.set(workspaceId, ro)
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

  watch(
    () => desktopWorkspaceStore.overview,
    (open) => {
      if (open) {
        void nextTick(() => {
          refreshStageSize()
          bumpLayout()
        })
      } else {
        disconnectViewportObservers()
        viewportById.value = {}
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

  function overviewStackStyle(): CSSProperties | undefined {
    if (!desktopWorkspaceStore.overview) return undefined

    void layoutTick.value

    const { width: stageWidth, height: stageHeight } = stageSize.value
    if (stageWidth <= 0 || stageHeight <= 0) return undefined

    const pw = panelW.value
    const ph = panelH.value
    const scale =
      pw > 0 && ph > 0
        ? computeScaleToFit(pw, ph, stageWidth, stageHeight) * FIT_PADDING
        : 1

    return {
      '--nova-workspace-thumb-scale': String(scale),
      '--nova-workspace-stage-width': `${stageWidth}px`,
      '--nova-workspace-stage-height': `${stageHeight}px`,
    } as CSSProperties
  }

  function innerOverviewStyle(
    workspaceId: string,
  ): CSSProperties | undefined {
    if (!desktopWorkspaceStore.overview) return undefined

    void layoutTick.value

    const { width: stageWidth, height: stageHeight } = stageSize.value
    if (stageWidth <= 0 || stageHeight <= 0) return undefined

    const panelEl = viewportById.value[workspaceId]
    const pw =
      panelEl?.clientWidth ??
      (workspaceId === sampleViewportId.value ? panelW.value : 0)
    const ph =
      panelEl?.clientHeight ??
      (workspaceId === sampleViewportId.value ? panelH.value : 0)

    if (pw <= 0 || ph <= 0) return undefined

    const scale =
      computeScaleToFit(pw, ph, stageWidth, stageHeight) * FIT_PADDING

    return {
      width: `${stageWidth}px`,
      height: `${stageHeight}px`,
      transform: `scale(${scale})`,
      transformOrigin: 'center center',
    }
  }

  return {
    stageSize,
    setViewportRef,
    innerOverviewStyle,
    overviewStackStyle,
    refreshStageSize,
  }
}
